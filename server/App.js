const express = require('express');
const {MongoClient} = require('mongodb');
const cors = require('cors');
require('dotenv').config()

const mongodb_uri = process.env.MONGODB_URI;
const db = process.env.DB;
const collection = process.env.COLLECTION;

const app = express();
const PORT = 3000;
const client = new MongoClient(mongodb_uri)

app.use(cors())
app.use(express.json())

// Connect to MongoDB
async function run() {
    try {
        await client.connect();
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB", err);
    }
}

run(); 
// invoke the function

app.get("/userdata", async (request,response)=> {
    try {
        const database = await client.db(db);
        const coll = await database.collection(collection);
        const data = await coll.find().toArray()

        response.status(200).send(data)
    } catch (error) {
        console.error("Something went wrong: ", error)
    }
})



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})