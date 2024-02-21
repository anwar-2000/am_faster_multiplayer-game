const express = require("express")
const app = express()
require('dotenv').config();

const users = require("./routes/users")
const pool = require("./db")
const port = 3000
const mainTables = require("./sqlQueries/setupQueries")



app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.get("/setup_db_", async (req,res)=>{
    try {
        await pool.query(mainTables)
        res.status(200).send({message : "Successfully created TABLES for db"})

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})
app.get("/", (req,res) => {
    res.status(200).send({
        "message" : "Hello World"
    })
})

app.use("/users",users)
app.use("/game",games)
app.use("auth",auth)


app.listen(port,()=> console.log(` Server listening on port ${port}`))