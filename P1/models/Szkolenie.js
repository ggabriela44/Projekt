const mongoose = require("mongoose");

const SzkolenieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    event: { type: String, required: true },
    city: { type: String, required: true }
});

module.exports = mongoose.model('Szkolenia', SzkolenieSchema);