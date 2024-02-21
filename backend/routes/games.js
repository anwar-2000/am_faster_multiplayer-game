const express = require("express")
const router = express.Router()
const pool = require("../db")


//get all played_games
router.get("/",async (req,res) => {
    //const {user_id} = req.body
    try {
        const all_played_games = await pool.query("SELECT * FROM played_games")
        res.status(200).send({
            users : all_played_games.rows
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

//get user played games infos
router.get("/games/:userId",async (req,res)=>{
    const userId = req.params.userId;
    if(!userId){
        res.status(500).send({message : "No userID received"})
    }
    try {
        const user_played_games = await pool.query("SELECT * FROM played_games WHERE user_id=$1",[userId])
        res.status(200).send({
            played_games : user_played_games.rows
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

//create a game
router.post("/", async (req,res)=>{
    const {user_id,user_score,opponent,opponent_score,} = req.body
    try {
        await pool.query("INSERT INTO played_games (user_id,opponent_username,opponent_score,user_score) VALUES ($1,$2,$3,$4)",[user_id,opponent,opponent_score,user_score])
        res.status(200).send({message : "Successfully created game"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})





module.exports = router