import { db } from "../config/database.connection.js";

export async function getCustomers(_, res) {
    try {
        const customers = await db.query("SELECT * FROM customers ORDER BY id")
        res.send(customers.rows)
    } catch (error) {
        res.sendStatus(500);
    }
}

export async function getCustomer(req, res) {
    const { id } = req.params;

    try {
        const customer = await db.query("SELECT * FROM customers WHERE id = $1", [id])
        if (customer.rowCount) {
            res.send(customer.rows[0])
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const duplicate = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf])

        if (duplicate.rowCount) {
            return res.status(409).send("Customer already exists");
        }

        await db.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4) RETURNING *;",
            [name, phone, cpf, birthday])
        res.status(201).send("Customer added successfully");
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const duplicate = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2`,
            [cpf, id])

        if (duplicate.rowCount) {
            return res.status(409).send("Customer already exists");
        }

        await db.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5",
            [name, phone, cpf, birthday, id])
        res.status(200).send("Customer updated successfully");
    } catch (error) {
        res.status(500).send(error.message)
    }
}