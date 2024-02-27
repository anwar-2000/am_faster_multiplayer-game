const express = require("express")
const app = express()
const http = require("http")

const server = http.createServer(app)
const socketIo = require("socket.io")
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

const io = socketIo(server,{ 
  cors: {
    origin: "http://localhost:3000"
  }
})
const socketUsers = {}; // Map to store socket.id -> username associations

io.on("connection", (socket) => {
  console.log("client connected /from server/: ", socket.id);
  
  // Store username when user logs in
  socket.on("login", (username) => {
    socketUsers[username] = socket.id;
    console.log(`successfully attached user ${username} to sockets id : ${socket.id}`)
  });

  // Handling invitation
  socket.on("sendInvitation", (invitation) => {
    // Lookingup recipient's socket id using their username
    const recipientSocketId = socketUsers[invitation.recipientUsername];
    if (recipientSocketId) {
      // Emit invitation to recipient's socket
      io.to(recipientSocketId).emit("receiveInvitation", invitation);
    } else {
      console.log("Recipient not found");
      io.to(socket.id).emit("user-not-found")
    }
  });

  // testt
  socket.on("test", () => {
    console.log("********* Am working :) ********")
  });

  // Handling game result
  socket.on("gameResult", (result) => {
    // Saving game result to database
  });

  // Handling disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Removing user from users map upon disconnection
    for (const [username, id] of Object.entries(socketUsers)) {
      if (id === socket.id) {
        delete socketUsers[username];
        break;
      }
    }
  });
});

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
app.use("/games",games)
app.use("/auth",auth)
app.use("/challenges",challenges)


server.listen(port,()=> console.log(` Server listening on port ${port}`))