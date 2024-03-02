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
const roomGameState = {}; // Map to store in progress game stats
const MISTAKE_PENALTY = 1; // Each mistake adds 1 to the score
const TIME_PENALTY = 0.1; // Each second adds 0.1 to the score

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
    console.log("sent invitation",invitation)
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
      //creating room
      const roomId = `${invitation.sender_username}__${invitation.recipientUsername}`;
      socket.join(roomId)
      console.log(`SEND : is he really there`,socket.rooms)
  // Emit invitation to recipient's socket
      io.to(recipientSocketId).emit("receiveInvitation", {...invitation,roomId});
    } else {
      console.log("Recipient not found");
      io.to(socket.id).emit("user_not_found")
    }
  });
  socket.on("invitationAccepted", async (invitation) => {
    try {
        // Creating a unique room or channel for the two users
        const {roomId} = invitation 
        console.log(`joined room is ${roomId}`)       
        // both of users join Room
        socket.join(roomId)
        console.log(`RECEIVE : is he really there`,socket.rooms)
        // const recipientSocket = socketUsers[invitation.recipientUsername]
        // console.log("Recipient socket:", recipientSocket)
        // //socketUsers[invitation.recipientUsername].join(roomId)
        // io.sockets.sockets.get(recipientSocket).join(roomId)
        //updating invitation table
        const values = ["accepted", invitation.senderId, invitation.recipientId, invitation.challengeId];
        await pool.query("UPDATE game_invitations SET status=$1 WHERE sender_id=$2 AND recipient_id=$3 AND challenge_id=$4", values);
        // Notifying both users about the acceptance and provide them with the room ID
        io.to(roomId).emit("goToGame",{roomId , ...invitation })
        // io.to(socketUsers[invitation.sender_username]).emit("goToGame", { senderSocket : socket.id, recipientSocket,roomId , ...invitation });
        // io.to(socket.id).emit("goToGame", { senderSocket : socket.id, recipientSocket,roomId , ...invitation });
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

  if (readyUserSocket) {
    console.log("THIS USER IS READY", username);
    io.to(roomId).emit("onUserIsReady", username);

    // Initializing room readiness status if not already initialized
    roomReadyStatus[roomId] = roomReadyStatus[roomId] || {};

    // Marking user as ready in the room
    roomReadyStatus[roomId][username] = true;

    // Checking if all users in the room are ready
    const usersInRoom = Object.keys(roomReadyStatus[roomId]);
    const allUsersReady = usersInRoom.every(user => roomReadyStatus[roomId][user]);

    console.log("ALL USERS ARE READY", allUsersReady);

    if (allUsersReady) {
      // Emitting event to start the game once all users are ready
      io.in(roomId).emit("startGame");
      console.log(`STARTING GAME IN THE ROOM ${roomId}`);
      
      // Resetting room readiness status for the next game
      roomReadyStatus[roomId] = {};
    }
  } else {
    console.log(`Socket not found for user: ${username}`);
    io.to(socket.id).emit("user_not_found");
  }
});
socket.on("gameEnded", async ({challengeId,username, roomId, finishedIn, mistakes }) => {
  // Update game state to 'finished' for the user
  console.log(`**************** challengeId is : ${challengeId}`)
  roomGameState[roomId] = roomGameState[roomId] || {};
  roomGameState[roomId][username] = {
      finishedIn,
      mistakes
  };

  // Check if both players have finished the game
  if (roomGameState[roomId] && Object.keys(roomGameState[roomId]).length === 2) {
      // Both players have finished the game
      const [user1, user2] = Object.keys(roomGameState[roomId]);
      const { mistakes: mistakes1, finishedIn: time1 } = roomGameState[roomId][user1];
      const { mistakes: mistakes2, finishedIn: time2 } = roomGameState[roomId][user2];

      console.log(`User ${user1} has ${mistakes1} mistakes and finished in ${time1}s`);
      console.log(`User ${user2} has ${mistakes2} mistakes and finished in ${time2}s`);

      // Calculate a score for each user based on a combination of mistakes and time --> the lower the score the better performence
      const score1 = mistakes1 * MISTAKE_PENALTY + time1 * TIME_PENALTY;
      const score2 = mistakes2 * MISTAKE_PENALTY + time2 * TIME_PENALTY;

      // Determine the winner based on the lowest score
      let winner = null;
      // Announce the winner with how much time it took and how much mistakes
      if (score1 < score2) {
          winner = user1;
          console.log(`Winner is ${winner} with a score of ${score1} in ${time1}s`);
          io.to(socketUsers[winner]).emit("winnerAnnouncement", { winner, mistakes: mistakes1, time: time1 });
          io.to(socketUsers[user2]).emit("Lost", { winner, mistakes: mistakes1, time: time1 });
      } else if (score2 < score1) {
          winner = user2;
          console.log(`Winner is ${winner} with a score of ${score2} in ${time2}s`);
          io.in(socketUsers[winner]).emit("winnerAnnouncement", { winner, mistakes: mistakes2, time: time2 });
          io.to(socketUsers[user1]).emit("Lost", { winner, mistakes: mistakes2, time: time2 });
      } else {
          // If scores are equal, consider it as a tie
          winner = null;
          console.log("It's a tie!");
          io.in(roomId).emit("Tie", {score1});
      }
      //db save game********************
      // try {
      //   const userId = await pool.query("SELECT id from users WHERE users.username=$1",[user1])
      //   await pool.query("INSERT INTO online_played_games(user)")
      // } catch (error) {
      //   console.log("ERROR SAVING TO DB",error)
      // }
      // Clear room and ready states
      delete roomReadyStatus[roomId];
      delete roomGameState[roomId];
  }else{
    //send one user is still playing
    console.log("One User is still playing wait %__%")
    io.to(roomId).emit("userFinished",username)
  }
});
// testt
  socket.on("test", () => {
    console.log("********* Am working :) ********")
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