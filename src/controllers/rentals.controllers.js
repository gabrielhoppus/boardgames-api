import { db } from "../config/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(_, res) {
    try {
        const rentals = await db.query(`
            SELECT json_build_object (
                'id', rentals.id,
                'customerId', rentals."customerId",
                'gameId', rentals."gameId",
                'rentDate', rentals."rentDate",
                'daysRented', rentals."daysRented",
                'returnDate', rentals."returnDate",
                'originalPrice', rentals."originalPrice",
                'delayFee', rentals."delayFee",
                'customer', json_build_object (
                    'id', customers.id,
                    'name', customers.name
                ),
                'game', json_build_object (
                    'id', games.id,
                    'name', games.name
                )
            ) FROM rentals JOIN customers ON rentals."customerId" = customers.id
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

// export async function updateCustomer(req, res) {
//     const { id } = req.params;
//     const { name, phone, cpf, birthday } = req.body;

//     try {
//         const duplicate = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2`,
//             [cpf, id])

//         if (duplicate.rowCount) {
//             return res.status(409).send("Customer already exists");
//         }

//         await db.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5",
//             [name, phone, cpf, birthday, id])
//         res.status(200).send("Customer updated successfully");
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// }