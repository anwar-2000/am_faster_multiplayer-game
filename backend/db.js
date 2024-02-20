const {Pool} = require("pg")
const pool = new Pool({
    host : "postgres",
    port : "5432",
    user : "drwx_anwar",
    password : "drwx_anwar",
    database : "am_faster_db"
})

module.exports = pool