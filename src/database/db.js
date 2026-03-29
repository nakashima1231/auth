const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});


module.exports = conexao;