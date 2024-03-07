const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: true,
  },
  cards: {
    type: [String],
  },
});

const List = mongoose.model("List", ListSchema, "List");

module.exports = List;
