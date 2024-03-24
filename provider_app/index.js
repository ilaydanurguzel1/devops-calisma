const express = require('express');
const app = express();
const amqp = require('amqplib');

// var amqp = require('amqplib/callback_api');

// const url = 'amqp://localhost';
// const queue = 'my-queue';

// let channel = null;
// amqp.connect(url, function (err, conn) {
//   if (!conn) {
//     throw new Error(`AMQP connection not available on ${url}`);
//   }
//   conn.createChannel(function (err, ch) {
//     channel = ch;
//   });
// });

// process.on('exit', code => {
//     channel.close();
//     console.log(`Closing`);
//   });


// app.post("/", (req, res) => {
//     channel.sendToQueue(queue, new Buffer.from(req.body.message));
//     res.send('index', {response: `Successfully sent: ${req.body.message}`});
// });

// app.listen(3000, () => {
//     console.log("Server is starting on port 3000");
// })

const PORT = process.env.PORT || 4001;

app.use(express.json());

// app.get("/send-msg", (req, res) => {
//   res.send("Hello World")
// });

app.listen(PORT, () => 
  console.log("Server running at port" + PORT)
);

let channel, connection;

async function connectQueue(){
  try{
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    await channel.assertQueue("test-queue");
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.log("Error connecting", err);
  }
}

async function sendData(data) {
  if (!channel) {
    console.error("Channel is not initialized");
    return;
  }

  try{
  await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
  } catch (err){
    console.error("Error sending data to RabbitMQ", err);
  }
  
  await channel.close();
  await connection.close();
}

app.get("/send-msg", (req, res) => {
  const data ={
    title: "Little Big",
    author: "Jerry Honkey"
  }

  sendData(data);
  console.log("A message is sent to queue");
  res.send("Message sent");
})

connectQueue();

