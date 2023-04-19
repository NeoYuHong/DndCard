import * as XLSX from "xlsx";
import { nanoid } from "nanoid";

const frontend = process.env.REACT_APP_FRONTEND_URL

const defaultInitializer = (index) => index;
export class Utils {

    static genId() {
        return nanoid(11)
    }

    static async genTemplate() {
        try {
            const res = await fetch(`/api/card/type`);
            const result = await res.json();

            // gen unique id for each card
            const output = result.message.map((item) => {
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


}
