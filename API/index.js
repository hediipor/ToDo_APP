const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = 3001;

const URI = "mongodb://localhost:27017/todo-app";

const database = "todo-app";

const CardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ListID: {
        type: String,
        required: true
    }
});

const ListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cards: [CardSchema] // Embed Card documents in the cards array
});

const List = mongoose.model('List', ListSchema, 'List');
const Cards = mongoose.model('Card', CardSchema);
async  function connectDB() {
    try{
        await mongoose.connect(URI);
        console.log('MongoDB Connected');
    }catch(error){
        console.log('Error connecting to the database: ', error);
    }
}

connectDB();
app.use(express.json());

app.get("/getlists", async (request, response) => {
    try {
        const lists = await List.find().lean();
        console.log('Lists from MongoDB:', lists);
        response.json(lists);
    } catch (error) {
        console.log("Error getting lists: ", error);
        response.status(500).send("Server Error");
    }
});


app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT)
});
