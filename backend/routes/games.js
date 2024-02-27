const express = require("express")
const router = express.Router()
const pool = require("../db")
const jwt = require("jsonwebtoken")

//get user played games infos
router.get("/",async (req,res)=>{
    const user_token = req.headers["authorization"];
    if(!user_token){
        res.status(500).send({message : "No token received"})
    }
    const decodedToken = jwt.verify(user_token.split(" ")[1], process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    try {
        const user_played_games = await pool.query(`
            SELECT p.*, t.difficulty, t.category
            FROM played_games p
            INNER JOIN text_samples t ON p.challenge_id = t.id
            WHERE p.user_id = $1
        `, [userId]);
        res.status(200).send({
            played_games : user_played_games.rows
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

//save a solo game
router.post("/", async (req,res)=>{
    const user_token = req.headers["authorization"]
    const {mistakes,time,challenge_id} = req.body
    // Decoding the token to extract user ID
    const decodedToken = jwt.verify(user_token.split(" ")[1], process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    try {
        await pool.query("INSERT INTO played_games (user_id,mistakes,time,challenge_id) VALUES ($1,$2,$3,$4)",[userId,mistakes,time,challenge_id])
        res.status(200).send({message : "Successfully saved a solo game"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

//save a online_game
router.post("/online", async (req,res)=>{
    const user_token = req.headers["authorization"]

    const {user_score,opponent,opponent_score,} = req.body
    // Decoding the token to extract user ID
       const decodedToken = jwt.verify(user_token.split(" ")[1], process.env.JWT_SECRET);
       const userId = decodedToken.userId;
    try {
        await pool.query("INSERT INTO online_played_games (user_id,opponent_username,opponent_score,user_score) VALUES ($1,$2,$3,$4)",[userId,opponent,opponent_score,user_score])
        res.status(200).send({message : "Successfully saved online game"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})




module.exports = router