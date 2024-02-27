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
const roomReadyStatus = {} // Map to store user ready states in a room


io.on("connection", (socket) => {
  console.log("client connected /from server/: ", socket.id);
  
  // Store username when user logs in
  socket.on("login", (username) => {
    socketUsers[username] = socket.id;
    console.log(`successfully attached user ${username} to sockets id : ${socket.id}`)
  });

  // Handling invitation
  socket.on("sendInvitation", async (invitation) => {
    // Lookingup recipient's socket id using their username
    console.log("invitation",invitation)
    const recipientSocketId = socketUsers[invitation.recipientUsername];
    if (recipientSocketId) {
      const query = `
                INSERT INTO game_invitations 
                (sender_id, sender_username, recipient_id, recipient_username, challenge_id, status) 
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
      const values = [invitation.senderId, invitation.sender_username, invitation.recipientId, invitation.recipientUsername, invitation.challengeId, "pending"];
      try {
        await pool.query(query, values);
      } catch (error) {
        console.log("Error while Inserting in game invitations ... ",error)
      }
  // Emit invitation to recipient's socket
      io.to(recipientSocketId).emit("receiveInvitation", invitation);
    } else {
      console.log("Recipient not found");
      io.to(socket.id).emit("user_not_found")
    }
  });
  socket.on("invitationAccepted", async (invitation) => {
    try {
        // Creating a unique room or channel for the two users
        const roomId = `${invitation.sender_username}__${invitation.recipientUsername}`;        
        // both of users join Room
        socket.join(roomId)
        const recipientSocket = socketUsers[invitation.recipientUsername]
        console.log("Recipient socket:", recipientSocket)
        //socketUsers[invitation.recipientUsername].join(roomId)
        io.sockets.sockets.get(recipientSocket).join(roomId)
        //updating invitation table
        const values = ["accepted", invitation.senderId, invitation.recipientId, invitation.challengeId];
        await pool.query("UPDATE game_invitations SET status=$1 WHERE sender_id=$2 AND recipient_id=$3 AND challenge_id=$4", values);
        // Notifying both users about the acceptance and provide them with the room ID
        io.to(recipientSocket).emit("goToGame", { senderSocket : socket.id, recipientSocket,roomId , ...invitation });
        io.to(socket.id).emit("goToGame", { senderSocket : socket.id, recipientSocket,roomId , ...invitation });
      } catch (error) {
        console.error("Error accepting invitation:", error);
        // sending an error message to sender
        io.to(socket.id).emit("invitation_error", { message: "Failed to accept invitation" });
    }
});
  socket.on("invitationRejected", async (invitation) => {
  try {
      //updating invitation table
      const values = ["rejected", invitation.senderId, invitation.recipientId, invitation.challengeId];
      await pool.query("UPDATE game_invitations SET status=$1 WHERE sender_id=$2 AND recipient_id=$3 AND challenge_id=$4", values);
      // Notifying sender user about the rejectence 
      io.to(socketUsers[invitation.sender_username]).emit("heRejectedYou",invitation);
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      // sending an error message to sender
      // io.to(socket.id).emit("invitation_error", { message: "Failed to reject invitation" });
  }
});
socket.on("userReady", (gameInfo) => {
  const { username, roomId } = gameInfo;
  const readyUserSocket = socketUsers[username];

  if (readyUserSocket) { // Check if socket exists for the user
      io.to(roomId).emit("onUserIsReady", username); // Emit event 
      roomReadyStatus[roomId] = roomReadyStatus[roomId] || {}; // Initialize room readiness status if not already initialized
      roomReadyStatus[roomId][username] = true; // Mark user as ready in the room

      // Check if both users in the room are ready
      const usersInRoom = Object.keys(roomReadyStatus[roomId]);
      const allUsersReady = usersInRoom.every(user => roomReadyStatus[roomId][user]);

      if (allUsersReady) {
          // Emit event to start the game once both users are ready
          io.to(roomId).emit("startGame");
      }
  } else {
      console.log(`Socket not found for user: ${username}`);
  }
});
  socket.on("gameEnded",(gameStats)=>{
    //logic to announce the winner ! + clear room and ready states
  })
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

//testing to see if invitation table have data of events that happened ...
app.get("/invitations", async (req,res)=>{
   try {
      const invitations = await pool.query("SELECT * FROM game_invitations")
      res.status(200).send({
        invitations : invitations.rows
      })
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
app.use("/games",games)
app.use("/auth",auth)
app.use("/challenges",challenges)


server.listen(port,()=> console.log(` Server listening on port ${port}`))