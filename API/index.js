const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

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
    cards: [CardSchema] 
});

const List = mongoose.model('List', ListSchema, 'List');
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
        response.json(lists);
    } catch (error) {
        console.log("Error getting lists: ", error);
        response.status(500).send("Server Error");
    }
});

app.get("/getListById/:id", async (request, response) => {
    try {
        const listId = request.params.id;
        if (!listId) {
            return response.status(400).json({ error: 'List ID is required for getting a list' });
        }
        const list = await List.findById(listId).lean();
        if (!list) {
            return response.status(404).json({ error: 'List not found' });
        }
        response.json(list);
    } catch (error) {
        console.error("Error getting list by id: ", error);
        response.status(500).send("Server Error");
    }
});

app.post("/addList", async (request, response) => {
    try {
        const { name } = request.body;
        console.log('Name from request:', name);
        if (!name) {
            return response.status(400).json({ error: 'Name is required for a new list' });
        }
        const newList = new List({ name });
        await newList.save();
        response.status(201).json(newList);
    } catch (error) {
        console.error("Error adding list: ", error);
        response.status(500).send("Server Error");
    }
});

app.delete("/deleteList/:id", async (request, response) => {
    try {
        const listId = request.params.id;
        if (!listId) {
            return response.status(400).json({ error: 'List ID is required for deletion' });
        }
        const existingList = await List.findById(listId);
        if (!existingList) {
            return response.status(404).json({ error: 'List not found' });
        }
        await existingList.remove();
        response.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error("Error deleting list: ", error);
        response.status(500).send("Server Error");
    }
});

app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT)
});
