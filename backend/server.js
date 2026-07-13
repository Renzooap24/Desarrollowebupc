require('dotenv').config(); // Carga las variables del .env
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración usando variables de entorno
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Importar rutas (Esto hace que tu equipo no se pelee por el archivo)
const rutasClientes = require('./routes/clientes');
app.use('/api/clientes', rutasClientes(dbConfig)); // Pasamos la config a la ruta

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));