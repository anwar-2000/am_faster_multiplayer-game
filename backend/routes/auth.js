const express = require("express")
const router = express.Router()
const pool = require("../db")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        //checking if user exists
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) {
            // User with provided username doesn't exist
            return res.status(401).send({ message: "Invalid username or password" });
        }
    // Comparing hashed password from the database with provided password
        const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!passwordMatch) {
            // Password doesn't match
            return res.status(401).send({ message: "Invalid  password" });
        }
        // Generating JWT token
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Inserting user session into user_sessions table
        await pool.query("INSERT INTO user_sessions(user_id, session_end) VALUES ($1, NOW() + INTERVAL '7 days')", [user.rows[0].id]);

        // Successful login
        res.status(200).send({ message: "Logged in successfully", token });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Logout Route
router.post("/logout", async (req, res) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    //no token provided
    if(!token){
        res.status(200).send({message : "User already logged out"})
    }
    try {   
       // Decoding the token to extract user ID
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       //TODO :  adding blacklisting token feature here 
       const userId = decodedToken.userId;
       // Deleting the user session from the user_sessions table
       await pool.query("DELETE FROM user_sessions WHERE user_id = $1", [userId]); 
       res.status(200).send({message : "Logged out successfully"})    
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});


module.exports = router