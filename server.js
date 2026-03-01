const { Server } = require("socket.io");
const app = require("./src/app");
const { createServer } = require("http");
require("dotenv").config();

const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("User Connected.");
  socket.on("disconnect", () => {
    console.log("User Disconnected.");
  });
  socket.on("message", (message) => {
    console.log("Message received: ", message);
  });
  
});
// IO is the main server and socket is the client that is connected to the server. We can use socket to send and receive messages from the client.

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is runnning on ${process.env.PORT}`);
});
