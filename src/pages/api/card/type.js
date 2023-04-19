// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import card from '@/templates/card.json'

export default function handler(req, res) {

    try {
        res.status(200).json({ message: card })

    } catch (error) {

        console.log("[ERROR][/api/card/type]" + error)
        res.status(500).json({ message: "Resource not found" })

    }



}

//https://localhost:3000/api/type