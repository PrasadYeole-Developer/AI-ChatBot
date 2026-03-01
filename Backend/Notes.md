## AI ChatBot :

- LLM - a program which is highly trained on text data to understand human language
- AI Memory
- - Short term - text based
- - Long term - vector based
- Web Sockets - communication protocol, enables bidirectional communication between client and server, Persistant (always open)

We will use socket.io to implement websocket, socket.io is a library and websocket is a protocol

```server.js
// IO is the main server and socket is the client that is connected to the server. We can use socket to send and receive messages from the client.
2 built in events in socket.io are connection and disconnect. We can use these events to log when a user connects or disconnects from the server.
custom events are events that we can define ourselves, for example, we can define an event called "message" to send messages from the client to the server and vice versa.
.on is used to listen events and .emit is used to fire events. For example, we can use socket.on("message", callback) to listen for the "message" event and socket.emit("message", data) to fire the "message" event with some data.
```

if listener .on is on server, then emitter .emit is on client and vice versa. For example, if we have socket.on("message", callback) on the server, then we can use socket.emit("message", data) on the client to send a message to the server.