const cors = require("cors");
const twilio = require("twilio");
const dotenv = require("dotenv");
const express = require("express");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer");
const groupCallHandler = require("./groupCallHandler");
const groupCallListeners = require("./group-call/index");
// const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.raw({ type: "video/webm" }));

dotenv.config();

app.post("/saveRecording", (req, res) => {
  const recordingPath = `./recordings/recording-${Date.now()}.webm`;
  fs.writeFileSync(recordingPath, req.body);
  res.status(200).send("Recording saved successfully");
});

const server = app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send({
    api: "africa-agility-api",
  });
});
app.get("/api/get-turn-credentials", (req, res) => {
  try {
    const accountsid = "ACac1be9816df6c12a9bac341c43e6ceb1";
    const authToken = "ba7c2d9540bd6bb39e57eec050cc4d79";
    const client = twilio(accountsid, authToken);

    client.tokens.create().then((token) => res.send({ token }));
  } catch (error) {
    console.log(error);
  }
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

groupCallHandler.createPeerServerListeners(peerServer);

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.post("/saveRecording", (req, res) => {
  const recordingPath = `./recordings/recording-${Date.now()}.webm`;
  fs.writeFileSync(recordingPath, req.body);
  res.status(200).send("Recording saved successfully");
});

io.on("connection", (socket) => {
  socket.emit("connection", null);
  groupCallListeners(socket, io);
});
