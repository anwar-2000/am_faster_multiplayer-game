const express = require("express")
const app = express()
const users = require("./routes/users")
const pool = require("./db")
const mainTables = require("./sqlQueries/setupQueries")
const port = 3000

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.get("/setup", async (req,res)=>{
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
        "message" : "hello world"
    })
})
app.use("/users",users)


app.listen(port,()=> console.log(` Server listening on port ${port}`))