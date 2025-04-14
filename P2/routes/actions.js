const express = require("express");
const router = express.Router();
const Action = require("../models/Action");
const Client = require("../models/Client");
const { requireLogin } = require("../middleware/auth");

// Formularz dodawania akcji
router.post("/add", requireLogin, async (req, res) => {
  const { clientId } = req.body;
  try {
    const client = await Client.findById(clientId).lean();
    res.render("actions/add", { client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

// Dodawanie akcji do klienta
router.post("/save", requireLogin, async (req, res) => {
  const { clientId, dataKontakt, rodzajAkcji, opisAkcji } = req.body;
  let errors = [];

  // Walidacja
  if (!dataKontakt || !rodzajAkcji || !opisAkcji) {
    errors.push("Wszystkie pola są wymagane.");
  }

  // Sprawdzenie poprawności rodzaju akcji
  const dozwoloneRodzaje = ["Telefon", "Spotkanie", "Inne"];
  if (rodzajAkcji && !dozwoloneRodzaje.includes(rodzajAkcji)) {
    errors.push("Nieprawidłowy rodzaj akcji.");
  }

  if (errors.length > 0) {
    const client = await Client.findById(clientId).lean();
    return res.render("actions/add", {
      client,
      errors,
      dataKontakt,
      rodzajAkcji,
      opisAkcji
    });
  }

  try {
    const newAction = new Action({
      dataKontakt,
      rodzajAkcji,
      opisAkcji,
      klient: clientId
    });
    await newAction.save();
    const client = await Client.findById(clientId).lean();
    const actions = await Action.find({ klient: clientId }).sort({ dataKontakt: -1 }).lean();
    res.render("actions/index", { client, actions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas zapisu akcji." });
  }
});

// Wyświetlanie akcji przypisanych do klienta (POST – bez ID w URL)
router.post("/view", requireLogin, async (req, res) => {
  const { clientId } = req.body;
  try {
    const client = await Client.findById(clientId).lean();
    const actions = await Action.find({ klient: clientId }).sort({ dataKontakt: -1 }).lean();;
    res.render("actions/index", { client, actions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

module.exports = router;
