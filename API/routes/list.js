const express = require("express");
const router = express.Router();
const List = require("../models/listModel");

router.get("/", async (request, response, next) => {
  try {
    const lists = await List.find().lean();
    response.json(lists);
  } catch (error) {
    console.log("Error getting lists: ", error);
    response.status(500).send("Server Error");
    return next(error);
  }
});

router.get("/:id", async (request, response, next) => {
  try {
    const listId = request.params.id;
    if (!listId) {
      return response
        .status(400)
        .json({ error: "List ID is required for getting a list" });
    }
    const list = await List.findById(listId).lean();
    if (!list) {
      return response.status(404).json({ error: "List not found" });
    }
    response.json(list);
  } catch (error) {
    console.error("Error getting list by id: ", error);
    response.status(500).send("Server Error");
    return next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const { listName } = request.body;
    if (!listName) {
      return response
        .status(400)
        .json({ error: "Name is required for a new list" });
    }
    const newList = new List({ listName });
    await newList.save();
    response.status(201).json(newList);
  } catch (error) {
    console.error("Error adding list: ", error);
    response.status(500).send("Server Error");
    return next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const listId = request.params.id;
    if (!listId) {
      return response
        .status(400)
        .json({ error: "List ID is required for deletion" });
    }
    const existingList = await List.findById(listId);
    if (!existingList) {
      return response.status(404).json({ error: "List not found" });
    }
    await existingList.deleteOne();
    response.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list: ", error);
    response.status(500).send("Server Error");
    return next(error);
  }
});

module.exports = router;
