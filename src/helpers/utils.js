import * as XLSX from "xlsx";
import { nanoid } from "nanoid";
import card from '@/templates/card.json'

const defaultInitializer = (index) => index;
export class Utils {

    static genId() {
        return nanoid(11)
    }

    static async genTemplate() {
        try {
            const output = card.map((item) => {
                item.id = nanoid(11)
                return item;
            })

            return output;
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    static async exportToExcel(data) {
        const filename = 'data.xlsx';
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "People");
        XLSX.writeFile(wb, filename);
    }

    static parseCardData(file) {
        file = file.filter((item) => item.id !== "tempfix")
        file = file.map(({ title, description, value, multiplier }, index) => ({ SN: index + 1, title, description, value: value * multiplier, }));
        return file
    }

    static createRange(length, initializer = defaultInitializer) {
        return [...new Array(length)].map((_, index) => initializer(index));
    }

    static async genData(length) {
        // TODO: if length is 0, can't drag item in. Using this as a temp fix
        if (length == 0)
            return [{
                "id": 'tempfix',
                "name": "temp fix",
                "invis": true,
            }]
        return [...new Array(length)].map((_, index) => {
            return {
                "id": this.genId(),
                "name": "Training Sessions Item",
                "title": `Training Sessions ${index + 1}`,
                "description": "Calculate training session cost",
                "unit": "$",
                "value": "",
                "multiplier": "1.75",
                "color": "red"
            }
        });
    }

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
        }

        return undefined;
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

}
