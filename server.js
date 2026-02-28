const { Server } = require("socket.io");
const app = require("./src/app");
const { createServer } = require("http");
const PORT = 3000;

const httpServer = createServer(app);

Server.on("connection", (socket) => {});

httpServer.listen(3000, () => {
  console.log(`Server is runnning on ${PORT}`);
});
