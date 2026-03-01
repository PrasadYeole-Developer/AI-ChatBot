const { Server } = require("socket.io");
const app = require("./src/app");
const { createServer } = require("http");
const { getContent } = require("./src/service/ai.service");
require("dotenv").config();

const httpServer = createServer(app);
const io = new Server(httpServer, {});

const history = [];

io.on("connection", (socket) => {
  console.log("User Connected.");
  socket.on("disconnect", () => {
    console.log("User Disconnected.");
  });
  socket.on("message", (message) => {
    console.log("Message received: ", message);
  });
  socket.on("get-content", async (data) => {
    try {
      console.log(data.prompt);
      history.push({
        role: "user",
        parts: [{ text: data.prompt }],
      });
      const response = await getContent(history);
      history.push({
        role: "model",
        parts: [{ text: response }],
      });
      console.log("AI Response: ", response);
      socket.emit("ai-response", { response });
    } catch (error) {
      console.error("Error:", error.message);
      socket.emit("ai-response", "API error. Try again.");
    }
  });
});
// IO is the main server and socket is the client that is connected to the server. We can use socket to send and receive messages from the client.

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is runnning on ${process.env.PORT}`);
});
