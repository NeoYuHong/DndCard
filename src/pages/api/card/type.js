// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs';

export default function handler(req, res) {

    try {

        const type = JSON.parse(fs.readFileSync(`./src/templates/card.json`).toString());
        res.status(200).json({ message: type })

    } catch (error) {

        console.log("[ERROR][/api/card/type]" + error)
        res.status(500).json({ message: "Resource not found" })

    }



}

//https://localhost:3000/api/type