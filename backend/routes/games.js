const express = require("express")
const router = express.Router()
const pool = require("../db")


//get number of all played_games
router.get("/",async (req,res) => {
    //const {user_id} = req.body
    try {
        const all_played_games = await pool.query("SELECT COUNT(*) FROM played_games")
        res.status(200).send({
            users : all_played_games.rows[0].count
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

//save a game
router.post("/", async (req,res)=>{
    const {user_id,user_score,game_id} = req.body
    try {
        await pool.query("INSERT INTO played_games (user_id,user_score,game_id) VALUES ($1,$2,$3,$4)",[user_id,user_score,game_id])
        res.status(200).send({message : "Successfully created game"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

//save a online_game
router.post("/online", async (req,res)=>{
    const {user_id,user_score,opponent,opponent_score,} = req.body
    try {
        await pool.query("INSERT INTO online_played_games (user_id,opponent_username,opponent_score,user_score) VALUES ($1,$2,$3,$4)",[user_id,opponent,opponent_score,user_score])
        res.status(200).send({message : "Successfully created game"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// router.post("/new_challenge", async (req,res)=>{
//     const {text,difficulty,category} = req.body
//     try {
//         await pool.query("INSERT INTO text_samples (text_content,difficulty,category) VALUES ($1,$2,$3)",[text,difficulty,category])
//         res.status(200).send({message : "Successfully created new challenge"})
//     } catch (error) {
//         console.log(error)
//         res.sendStatus(500)
//     }
// })


module.exports = router