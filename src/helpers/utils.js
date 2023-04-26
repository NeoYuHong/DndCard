import * as XLSX from "xlsx";
import { nanoid } from "nanoid";
import card from '@/templates/card.json'
import { evaluate } from 'mathjs'
import { toast } from "react-toastify";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export class Utils {

    // Export only data to PDF file
    static exportPDF(data) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        const documentDefinition = {
            content: [
                { text: '', style: 'header' },
                {
                    style: 'table',
                    table: {
                        headerRows: 1,
                        widths: [30, '*', '*', '*'],
                        body: [
                            [
                                { text: 'SN', fillColor: '#7CFC00' },
                                { text: 'Title', fillColor: '#7CFC00' },
                                { text: 'Description', fillColor: '#7CFC00' },
                                { text: 'Value', fillColor: '#7CFC00' }
                            ],
                            ...data.map((item, index) => {
                                const value = item.manualValue?.length ? item.manualValue : item.value;
                                return [index + 1, item.title, item.description, value];
                            })
                        ],
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                table: {
                    margin: [0, 10, 0, 0],
                },
            },
        };

        pdfMake.createPdf(documentDefinition).download(this.generateFilename('pdf'));
    }

    // Export only data to Excel file
    static async exportExcel(data) {
        const filename = `${this.generateFilename('xlsx')}`;
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "People");
        XLSX.writeFile(wb, filename);
    }

    // Export both template and data to JSON file
    static exportJson(data) {

        // Convert the JSON object to a string
        const jsonString = JSON.stringify(data, null, 3);

        // Create a Blob from the string
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a URL from the Blob
        const url = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.generateFilename('json')}`;

        // Append the link to the document body
        document.body.appendChild(link);

        // Click the link to download the file
        link.click();

        // Clean up the URL object
        URL.revokeObjectURL(url);

    }

    // Import both template and data to JSON file
    static async importJson(event, setItems) {

        if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];

        // Check if the file extension is .json
        if (file.name.split('.').pop().toLowerCase() !== 'json') {
            return toast.error("Invalid file format! Please select JSON file.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {

            try {

                const contents = JSON.parse(reader.result)

                if (!this.validateItem(contents))
                    throw 'Invalid data structure!'

                const parsedTemplate = contents.Template.map((item) => {
                    item.id = item.name;
                    return item;
                })

                const parsedData = contents.Data.map((item) => {
                    item.id = Utils.generateId()
                    return item;
                })

                let duplicate = 0;

                setItems((items) => {

                    const Template = parsedTemplate.reduce((acc, item) => {
                        if (acc.findIndex(x => x.name === item.name) === -1) {
                            acc.push(item);
                        } else
                            duplicate++;
                        return acc;
                    }, items.Template)

                    // Show success message for imported data and template
                    toast.success(`Imported ${parsedData.length} data and ${Template.length - duplicate} template!`, {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });

                    return ({
                        Template,
                        Data: [...items.Data, ...parsedData]
                    })
                })

                event.target.value = null;

                // If duplicate templates were found, show an error message after a short delay
                if (duplicate > 0) {
                    const delayTime = 800; // Time to wait before showing the error message, in milliseconds
                    setTimeout(() => {
                        toast.success(`${duplicate} duplicate template(s) removed.`, {
                            position: "bottom-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }, delayTime);
                }


            } catch (error) {
                toast.error("Error importing! Please check the content of the file.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                console.error(error)
            }
        };


    }

    // Generate random ID for DND items
    static generateId() {
        return nanoid(11)
    }

    // Load template from JSON file and add random ID for each template item
    static async generateTemplate() {
        try {
            const output = card
                .filter((item) => !item.disabled)
                .map((item) => {
                    item.id = this.generateId();
                    return item;
                })

            return output;
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    // Parse data and template
    static parseItems(data) {
        return {
            Data: this.parseDataRaw(data.Data),
            Template: this.parseTemplate(data.Template)
        }
    }

    // Parse template
    static parseTemplate(file) {
        file = file.map((item) => {
            delete item.id
            return item;
        });
        return file
    }

    // Parse data (SN, title, description, value)
    static parseData(file) {
        file = file.filter((item) => item.id !== "tempfix")
        file = file.map(({ title, description, value, manualValue, expression }, index) => ({ SN: index + 1, title, description, value: manualValue?.length > 0 ? manualValue : this.computeValue(value, expression), }));
        return file
    }

    // Parse data (name, title, description, preUnit, postUnit, value, color, prompt, expression, isTemplate)
    static parseDataRaw(data) {
        return data
            .filter((item) => item.id !== "tempfix")
            .map((item) => {
                delete item.isTemplate
                delete item.id
                return item;
            })
    }

    // Generate filename file_<timestamp>.<extension>
    static generateFilename(extension) {
        const timestamp = new Date().getTime();
        const filename = `file_${timestamp}.${extension}`;
        return filename;
    }

    // Validate data and template exists in items
    static validateItem(items) {
        if (!items) return false;
        if (!items['Data']) return false;
        if (!items['Template']) return false;
        return true;
    }

    // When there is no data, hovering over the data container does nothing.
    // Using this invisible item as a temp fix so that there is atleast 1 item in the data container
    static tempfix = {
        "id": 'tempfix',
        "name": "temp fix",
        "invis": true,
    }

    // Generate data to test the app
    static async generateData(length) {
        // TODO: if length is 0, can't drag item in. Using this as a temp fix
        if (length == 0)
            return [this.tempfix]
        return [...new Array(length)].map((_, index) => {
            return {
                "id": this.generateId(),
                "name": "Training Sessions Item",
                "title": `Training Sessions ${index + 1}`,
                "description": "Calculate training session cost",
                "preUnit": "hr",
                "postUnit": "$",
                "value": "",
                "color": "#FF69B4",
                "prompt": "Enter the number of hours",
                "expression": "value * 1.75",
            }
        });
    }

    // Generate random color
    static generateColor() {
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 10);
        }
        return color;
    }

    // Get pre defined color
    static getColor(color) {
        switch (String(color).toUpperCase()) {
            case 'A':
                return '#7193f1';
            case 'B':
                return '#ffda6c';
            case 'C':
                return '#00bcd4';
            case 'RED':
                return '#ef769f';
            case undefined:
                return '#ef769f';
            default:
                return color;
        }
    }

    static multipleContainersCoordinateGetter = (
        event,
        { context: { active, droppableRects, droppableContainers, collisionRect } }
    ) => {
        if (directions.includes(event.code)) {
            event.preventDefault();

            if (!active || !collisionRect) {
                return;
            }

            const filteredContainers = [];

            droppableContainers.getEnabled().forEach((entry) => {
                if (!entry || entry?.disabled) {
                    return;
                }

                const rect = droppableRects.get(entry.id);

                if (!rect) {
                    return;
                }

                const data = entry.data.current;

                if (data) {
                    const { type, children } = data;

                    if (type === 'container' && children?.length > 0) {
                        if (active.data.current?.type !== 'container') {
                            return;
                        }
                    }
                }

                switch (event.code) {
                    case KeyboardCode.Down:
                        if (collisionRect.top < rect.top) {
                            filteredContainers.push(entry);
                        }
                        break;
                    case KeyboardCode.Up:
                        if (collisionRect.top > rect.top) {
                            filteredContainers.push(entry);
                        }
                        break;
                    case KeyboardCode.Left:
                        if (collisionRect.left >= rect.left + rect.width) {
                            filteredContainers.push(entry);
                        }
                        break;
                    case KeyboardCode.Right:
                        if (collisionRect.left + collisionRect.width <= rect.left) {
                            filteredContainers.push(entry);
                        }
                        break;
                }
            });

            const collisions = closestCorners({
                active,
                collisionRect: collisionRect,
                droppableRects,
                droppableContainers: filteredContainers,
                pointerCoordinates: null,
            });
            const closestId = getFirstCollision(collisions, 'id');

            if (closestId != null) {
                const newDroppable = droppableContainers.get(closestId);
                const newNode = newDroppable?.node.current;
                const newRect = newDroppable?.rect.current;

                if (newNode && newRect) {

                    if (newDroppable.data.current?.type === 'container') {
                        return {
                            x: newRect.left + 20,
                            y: newRect.top + 74,
                        };
                    }

                    return {
                        x: newRect.left,
                        y: newRect.top,
                    };

                }
            }
        }

        return undefined;
    };

    // Compute value using expression
    static computeValue(value, expression) {
        try {
            if (!expression || !value) return 0;
            return evaluate(expression, { value: value, Math });
        } catch (error) {
            console.log(error)
            return 'expression error';
        }
    }

    // Prevent "e", "E", "+", "-" from being inputted into number input field.
    // Copy pasting still works
    static preventExponentialInput(event) {
        const key = event.key;
        if (key === 'E' || key === 'e' || key === '+' || key === '-') {
            event.preventDefault();
        }
    }

}
