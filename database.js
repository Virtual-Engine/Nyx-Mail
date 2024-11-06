const mysql = require('mysql2/promise');
const config = require("./config")
const { log, logfile } = require('nyx-logger');

const pool = mysql.createPool(config.database.connect());


module.exports = {
    query: async (sql, params) => {
        const [rows] = await pool.query(sql, params);
        return rows;
    },
};