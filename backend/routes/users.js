const express = require("express")
const router = express.Router()
const pool = require("../db")
const bcrypt = require("bcrypt")


// get number of  online users
router.get("/online", async (req, res) => {
    try {
        const onlineUsersQuery = `
            SELECT u.username , u.id
            FROM user_sessions su
            JOIN users u ON su.user_id = u.id;
        `;
        const onlineUsersResult = await pool.query(onlineUsersQuery);
        //console.log(online_users)
        if(onlineUsersResult.rows.length < 1){
            return res.status(400).send({message : "No online Users at the moment ! "})
        }
        const onlineUsers = onlineUsersResult.rows;
        return  res.status(200).send({
            online_users: onlineUsers
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

//get all users
router.get("/",async (req,res) => {
    try {
        const users = await pool.query("SELECT * FROM users")
        return res.status(200).send({
            users : users.rows
        })
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})

//get user infos
router.get("/user/:username", async (req,res)=>{
    const username = req.params.username;
    if(!userId){
        return res.status(400).send({message : "No username received"})
    }
    try {
        const user = await pool.query("SELECT * FROM users WHERE username=$1",[username])
        if(user.rows.length < 1){   
           return res.status(404).send({message : "No user found"})
        }
        res.status(200).send({
            user : user.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})

//create a user / register
router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    //hashing password 
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        //seeing if user already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).send({ message: "Username or email already exists" });
        }
        // else creating a new user
        await pool.query("INSERT INTO users (username,email,password) VALUES ($1,$2,$3)", [username, email, hashedPassword])
        return res.status(200).send({ message: "Successfully created user" });
    } catch (error) {
        console.error(error)
        // Checking for unique constraint violation error
        if (error.code === "23505") { // Unique violation error code
            return res.status(400).send({ message: "Username or email already exists" });
        }

        return res.sendStatus(500);
    }
})

//edit user infos
router.put("/user/:userId",async (req,res)=>{
    const {username,email} = req.body
    const userId = req.params.userId
    try {
        if((!username && !email) || !userId){
            return res.status(400).send({message : "invalid PARAMS"})
        }
        else if (!username){
            await pool.query("UPDATE users SET email=$2 WHERE id=$1",[userId,email])
            return res.status(200).send({message : "successfullt edited user"})
        }
        else if(!email){
            await pool.query("UPDATE users SET username=$2 WHERE id=$1",[userId,username])
            return res.status(200).send({message : "successfullt edited user"})
        }
        await pool.query("UPDATE users SET email=$2 , username=$3 WHERE id=$1",[userId,email,username])
        return  res.status(200).send({message : "successfullt edited user"})
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }   
})

//delete user
router.delete("/user/:userId", async (req,res)=>{
    const userId = req.params.userId
    try {
        await pool.query("DELETE FROM users WHERE id=$1",[userId])
       return  res.status(200).send({message : "user deleted Successfully"})
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})




module.exports = router