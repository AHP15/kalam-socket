import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "https";
import { Server } from "socket.io";
import jwt  from "jsonwebtoken";

const APP = express();

APP.use(cors({
    origin: "http://localhost:8080",
}));

APP.use(bodyParser.json());
// parse request with content-type "application/x-www-form-urlencoded"
APP.use(bodyParser.urlencoded({extended: true}));

const httpServer  = createServer(APP);
const io = new Server(httpServer, {
    cors:{
      origin:"https://admiring-heyrovsky-f50208.netlify.app",
    }
});

// middlewares
const { TokenExpiredError } = jwt;
const catchError = (err) => {
    if(err instanceof TokenExpiredError){
        return new Error( "Unauthorized! Access Token was expired!");
    }

    return new Error( "Unauthorized!");
}

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  let err;

  if(!token){
    err = new Error("No token is provided!!");
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if(err){
        return next(catchError(err));
    }

    next();
  });

});

io.on("connection", (socket) => {
  // ...
  console.log("id", socket.id);

  socket.on("join_room", chatId =>{
    socket.join(chatId);
    console.log("joined");
  });
  
  socket.on("message", (message, chatId) => {
    console.log(message);
    io.to(chatId).emit("server_msg", message);
  });

  socket.conn.on("close", reason => {
    console.log(reason);
  });

  socket.on("error", err =>{
    console.log("error",err.message);
  });
});

APP.get("/", (req, res) =>{
    res.status(200).send({message: "hello from socket app"});
})

const port = process.env.PORT || 8081;
httpServer.listen(port);
/*
APP.listen(port, () =>{
    console.log("listening on port 8080");
});
*/
console.log("listening on port 8081");