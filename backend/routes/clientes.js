const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = (dbConfig) => {
    router.get('/', async (req, res) => {
        try {
            let pool = await sql.connect(dbConfig);
            let result = await pool.request().query('SELECT * FROM Clientes');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
    return router;
};