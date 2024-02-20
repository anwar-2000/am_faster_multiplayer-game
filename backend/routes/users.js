const express = require("express")
const router = express.Router()
const pool = require("../db")


//get all users
router.get("/",async (req,res) => {
    try {
        const users = await pool.query("SELECT * FROM users")
        res.status(200).send({
            users : users.rows
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

//get user infos
router.get("/user/:userId",(req,res)=>{
    res.status(200).send({
        message : "hello world users "
    })
})

//create a user / register
router.post("/", async (req,res)=>{
    const {username,email} = req.body
    try {
        await pool.query("INSERT INTO users (username,email,password) VALUES ($1,$2,$3)",[username,"hbdydjh",email])
        res.status(200).send({message : "Successfully created user"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

//edit user infos
router.put("/user/:userId",(req,res)=>{
    res.status(200).send({
        message : "hello world users "
    })
})

//delete user
router.delete("/user/:userId",(req,res)=>{
    res.status(200).send({
        message : "hello world users "
    })
})




module.exports = router