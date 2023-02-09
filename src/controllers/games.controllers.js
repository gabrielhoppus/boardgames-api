import { db } from "../config/database.connection.js";

export async function getGames(res) {
    try {
        const games = await db.query("SELECT * FROM games;")
            .then(res.status(200).send(games.rows))
            .catch(() => { res.status(500).send("Erro ao executar requisição") })

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    const duplicate = await db.query(`SELECT * FROM games WHERE name = ${name}`)

    if (duplicate) return res.sendsStatus(409);

    try {
        await db.query(`INSERT INTO games (name, image, stockTotal, pricePerDay) VALUES ($1, $2, $3, $4);`,
            [name, image, stockTotal, pricePerDay])
            .then(res.sendStatus(201))
            .catch(() => { res.status(500).send("Erro ao executar requisição") })
    } catch (error) {
        res.status(500).send(error.message)
    }
}