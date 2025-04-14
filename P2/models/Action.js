const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  dataKontakt: { type: Date, required: true },
  rodzajAkcji: { type: String, enum: ["Telefon", "Spotkanie", "Inne"], required: true },
  opisAkcji: { type: String, required: true },
  klient: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true }
});

module.exports = mongoose.model("Action", actionSchema);
