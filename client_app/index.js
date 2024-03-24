const express = require("express");
const app = express();
const amqp = require('amqplib');

// app.get("/", (req, res) => {
//     res.send("Hello World");
// });

// app.listen(3000, () => {
//     console.log("Server is starting on port 3000");
// })

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => 
  console.log("Server running at port" + PORT)
);

let channel, connection;
connectQueue();

async function connectQueue(){
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel();

        await channel.assertQueue("test-queue");
        channel.consume("test-queue", data => {
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        });
    } catch (err) {
        console.log(err);
    }
}