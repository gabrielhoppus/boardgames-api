import { db } from "../config/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(_, res) {
    try {
        const rentals = await db.query(`
            SELECT rentals.*,
            json_build_object (
                'id', customers.id,
                'name', customers.name
            ) AS customer,
            json_build_object (
                'id', games.id,
                'name', games.name
            ) AS game
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id;`)

        res.send(rentals.rows)
    } catch (error) {
        res.sendStatus(500);
    }
}


export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentalDate = dayjs(Date.now()).format("YYYY-MM-DD");

    try {

        const customerDuplicate = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
        const gameDuplicate = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);

        if (!customerDuplicate.rowCount || !gameDuplicate.rowCount) {
            return res.sendStatus(400);
        }

        const stockCheck = await db.query(`SELECT "stockTotal" FROM games WHERE id = $1`, [gameId]);
        const gameCheck = await db.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId])

        if (stockCheck.rows[0].stockTotal <= gameCheck.rowCount) {
            return res.status(400).send("Game is out of stock");
        }

        const rentedGame = await db.query("SELECT * FROM games WHERE id = $1", [gameId]);
        const { pricePerDay } = rentedGame.rows[0]
        const originalPrice = daysRented * pricePerDay

        await db.query(
            `INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
            [customerId, gameId, rentalDate, daysRented, null, originalPrice, null])
        res.status(201).send("Rental added successfully");
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function closeRental(req, res) {
    const { id } = req.params;
    const returnDate = dayjs(Date.now());

    try {
        const rental = await db.query("SELECT * FROM rentals WHERE id = $1", [id])

        if (!rental.rowCount) {
            return res.status(404).send("Rental not found");
        }

        if (rental.rows[0].returnDate === null) {
            return res.status(400).send("Rental still open");
        }

        const gameId = rental.rows[0].gameId
        const daysRented = rental.rows[0].daysRented
        const initialDate = dayjs(rental.rows[0].rentDate)
        const diff = returnDate.diff(initialDate, "day")
        const diffComparison = diff > daysRented

        if (diffComparison) {
            const delay = diff - daysRented
            const game = await db.query("SELECT * FROM games WHERE id = $1", [gameId])
            const delayFee = game.rows[0].pricePerDay * delay

            await db.query(
                `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
                [returnDate, delayFee, id])
            res.sendStatus(200)
        } else {
            await db.query(
                `UPDATE rentals SET "returnDate" = $1 WHERE id = $2`,
                [returnDate, id])
            res.sendStatus(200)
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function deleteRental(req, res){
    const { id } = req.params;

    try {
        const rental = await db.query("SELECT * FROM rentals WHERE id = $1", [id])

        if (!rental.rowCount) {
            return res.status(404).send("Rental not found");
        }

        if (rental.rows[0].returnDate !== null) {
            return res.status(400).send("Rental already closed");
        }

        await db.query(`DELETE FROM rentals WHERE id = $1`, [id])
        res.sendStatus(200)
    } catch {
        res.status(500).send(error.message)
    }

}