import { db } from "../config/database.connection.js";

function buildQuery(name, offset, limit, order, desc) {
    let query = "SELECT * FROM customers";
    query += name ? ` WHERE cpf ILIKE '${name}%'` : "";
    query += offset ? ` OFFSET '${offset}'` : "";
    query += limit ? ` LIMIT '${limit}'` : "";
    query += order ? ` ORDER BY '${order}'` : "";
    query += desc === "true" ? ` DESC` : "";
    return query;
}

export async function getGames(_, res) {

    try {
        const { name, offset, limit, order, desc } = req.query;
        const query = buildQuery(name, offset, limit, order, desc);
        const games = await db.query(query)
        res.send(games.rows)
    } catch {
        res.sendStatus(500);
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const duplicate = await db.query(`SELECT * FROM games WHERE name = $1`, [name])

        if (duplicate.rowCount) {
            return res.status(409).send("Game already exists");
        }

        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4) RETURNING *;`,
            [name, image, stockTotal, pricePerDay])
        res.status(201).send("Game added successfully");
    } catch (error) {
        res.status(500).send(error.message)
    }
}