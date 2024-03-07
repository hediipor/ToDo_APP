const express = require("express");
const router = express.Router();
const List = require("../models/listModel");

router.post("/:id", async (request, response, next) => {
  try {
    const listId = request.params.id;
    const { card } = request.body;
    if (!listId || !card) {
      return response
        .status(400)
        .json({ error: "List ID and cards are required to add cards" });
    }

    const existingList = await List.findById(listId);
    if (!existingList) {
      return response.status(404).json({ error: "List not found" });
    }

    existingList.cards.push(card);
    await existingList.save();

    response.status(200).json(card);
  } catch (error) {
    console.error("Error adding cards to list: ", error);
    response.status(500).send("Server Error");
    return next(error);
  }
});

router.delete("/:listId/:cardName", async (request, response, next) => {
  try {
    const listId = request.params.listId;
    const cardName = request.params.cardName;
    const existingList = await List.findById(listId);

    if (!existingList) {
      return response.status(404).json({ error: "List not found" });
    }
    existingList.cards = existingList.cards.filter((card) => card !== cardName);
    await existingList.save();

    response.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card: ", error);
    response.status(500).send("Server Error");
    return next(error);
  }
});

router.put("/:listId/:cardName", async (request, response, next) => {
  try {
    const { listId, cardName } = request.params;
    const { newName } = request.body;

    if (!listId || !cardName || !newName) {
      return response.status(400).json({
        error:
          "List ID, card name, and new name are required for updating a card",
      });
    }

    const existingList = await List.findById(listId);

    if (!existingList) {
      return response.status(404).json({ error: "List not found" });
    }

    const cardIndex = existingList.cards.indexOf(cardName);

    if (cardIndex === -1) {
      return response.status(404).json({ error: "Card not found in the list" });
    }

    existingList.cards[cardIndex] = newName;
    await existingList.save();

    response.status(200).json({ message: "Card updated successfully" });
  } catch (error) {
    console.error("Error updating card: ", error);
    response.status(500).send("Server Error");
    return next(error);
  }
});

router.put("/:id", async (request, response, next) => {
  try {
    const listId = request.params.id;
    const { cards } = request.body;
    if (!listId || !cards) {
      return response
        .status(400)
        .json({ error: "List ID and cards are required to update cards" });
    }

    const existingList = await List.findById(listId);
    if (!existingList) {
      return response.status(404).json({ error: "List not found" });
    }

    existingList.cards = cards;
    await existingList.save();

    response.status(200).json(existingList);
  } catch (error) {
    console.error("Error updating cards in the list: ", error);
    response.status(500).send("Server Error");
    return next(error);
  }
});

module.exports = router;
