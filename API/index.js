const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const URI = "mongodb://localhost:27017/todo-app";



const ListSchema = new mongoose.Schema({
    listName: {
        type: String,
        required: true
    },
    cards: {
        type: [String],
    }
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
        const { listName } = request.body;
        console.log('Name from request:', listName);
        if (!listName) {
            return response.status(400).json({ error: 'Name is required for a new list' });
        }
        const newList = new List({ listName });
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
        await existingList.deleteOne();
        response.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error("Error deleting list: ", error);
        response.status(500).send("Server Error");
    }
});

app.post("/addCards/:id", async (request, response) => {
    try {
        const listId = request.params.id;
        const { cards } = request.body;
        console.log(cards);
        if (!listId || !cards) {
            return response.status(400).json({ error: 'List ID and cards are required to add cards' });
        }

        const existingList = await List.findById(listId);
        if (!existingList) {
            return response.status(404).json({ error: 'List not found' });
        }

        existingList.cards.push(...cards);
        await existingList.save();

        response.status(200).json(existingList);
    } catch (error) {
        console.error("Error adding cards to list: ", error);
        response.status(500).send("Server Error");
    }
});


app.delete("/deleteCard/:listId/:cardName", async (request, response) => {
    try {
        const listId = request.params.listId;
        const cardName = request.params.cardName;
        const existingList = await List.findById(listId);

        if (!existingList) {
            return response.status(404).json({ error: 'List not found' });
        }
        existingList.cards = existingList.cards.filter(card => card !== cardName);
        await existingList.save();

        response.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error("Error deleting card: ", error);
        response.status(500).send("Server Error");
    }
});


app.put("/updateCard/:listId/:cardName", async (request, response) => {
    try {
        const { listId, cardName } = request.params;
        const { newName } = request.body;

        if (!listId || !cardName || !newName) {
            return response.status(400).json({ error: 'List ID, card name, and new name are required for updating a card' });
        }

        const existingList = await List.findById(listId);

        if (!existingList) {
            return response.status(404).json({ error: 'List not found' });
        }

        const cardIndex = existingList.cards.indexOf(cardName);

        if (cardIndex === -1) {
            return response.status(404).json({ error: 'Card not found in the list' });
        }

        existingList.cards[cardIndex] = newName;
        await existingList.save();

        response.status(200).json({ message: 'Card updated successfully' });
    } catch (error) {
        console.error("Error updating card: ", error);
        response.status(500).send("Server Error");
    }
});






app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT)
});
