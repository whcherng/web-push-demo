const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush= require("web-push");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 4000;

const vapidKeys={
  publicKey:"BOurIPw3zSgD6ajBiCsTw0SN4RozhPAAFL95iMTNGtpHTe7gdAZfx0QO4JE_sLZxWhdGFZjaD4FAcncc0pbtXx0",
  privateKey:"t18qcHwAqQIn1YGcombKm5CUAxzq0Za6qsPDjGO2Yec"
}

webpush.setVapidDetails(
    'mailto:whcherng@yopmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const sendNotification = (subscription, dataToSend='myUnifi has new application!') => {
  webpush.sendNotification(subscription, dataToSend);
}

app.get("/", (req, res) => res.send("Hello World!"));

const dummyDb = { subscription: null }; //dummy in memory store

const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription;
};

// The new /save-subscription endpoint
app.post("/save-subscription", async (req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: "success" });
});

app.get('/send-notification', (req,res) => {
  const subscription = dummyDb.subscription
  const message = "Hello World"
  console.log(subscription);
  sendNotification(subscription, message)
  res.json({ message: 'message sent'})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
