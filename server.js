import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const APP = express();

APP.use(cors({
    origin: "http://localhost:8080",
}));

APP.use(bodyParser.json());
// parse request with content-type "application/x-www-form-urlencoded"
APP.use(bodyParser.urlencoded({extended: true}));

APP.get("/", (req, res) =>{
    res.status(200).send({message: "hello from socket app"});
})

APP.listen(8080, () =>{
    console.log("listening on port 8080");
});