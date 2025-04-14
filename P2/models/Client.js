const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  companyOrPerson: {
    type: String,
    enum: ['company', 'person'],
    required: false
  },
  nip: { type: String, required: false }
});

module.exports = mongoose.model("Client", clientSchema);
