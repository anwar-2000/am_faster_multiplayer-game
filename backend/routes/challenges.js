const express = require("express");
const router = express.Router()
const pool = require('../db')

// get all challenges 
router.get("/", async (req,res)=>{
    try {
        const challenges = await pool.query("SELECT * FROM text_samples")
        if(challenges.rows.length < 1){
            res.status(400).send({message : "0 challenges found !"})
            return;
        }
        res.status(200).send({
            challenges : challenges.rows
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// get a challenge details
router.get("/:challengeId", async (req,res)=>{

    const challengeId = req.params.challengeId
    try {
        const challenges = await pool.query("SELECT * FROM text_samples WHERE id=$1",[challengeId])
        if(challenges.rows.length < 1){
            res.status(400).send({message : "challenge not found !"})
            return;
        }
        res.status(200).send({
            challenge : challenges.rows[0]
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

//create a new one
router.post("/new_challenge", async (req,res)=>{
    const {text,difficulty,category} = req.body
    try {
        await pool.query("INSERT INTO text_samples (text_content,difficulty,category) VALUES ($1,$2,$3)",[text,difficulty,category])
        res.status(200).send({message : "Successfully created new challenge"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
 })
// deleting challenge
 router.delete("/:challengeId", async (req,res)=>{
    const challengeId = req.params.challengeId
    try {
        await pool.query("DELETE FROM text_samples WHERE id=$1",[challengeId])
        res.status(200).send({message : "Successfully deleted the challenge"})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
 })


module.exports = router