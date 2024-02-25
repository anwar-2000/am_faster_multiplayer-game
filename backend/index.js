const express = require("express")
const app = express()
require('dotenv').config();
const cors = require("cors")
const users = require("./routes/users")
const games = require("./routes/games")
const auth = require("./routes/auth")
const challenges = require("./routes/challenges")
const pool = require("./db")
const port = 8000
const mainTables = require("./sqlQueries/setupQueries")
// const text_samples = require("./consts/textSamples")


app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));


app.get("/setup_db_", async (req, res) => {
    try {
        // Drop all existing tables
        await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");

        // Recreate tables with new definitions
        await pool.query(mainTables);
        res.status(200).send({ message: "Successfully recreated TABLES for db" });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get("/", (req,res) => {
    res.status(200).send({
        "message" : "Hello World"
    })
})

app.use("/users",users)
app.use("/game",games)
app.use("/auth",auth)
app.use("/challenges",challenges)


app.listen(port,()=> console.log(` Server listening on port ${port}`))