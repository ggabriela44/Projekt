const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const { requireLogin } = require("../middleware/auth");

// Strona główna z listą klientów
router.get("/", requireLogin, async (req, res) => {
  try {
    const clients = await Client.find().lean();
    res.render("clients/index", { clients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});



// Formularz dodawania klienta
router.get("/add", requireLogin, (req, res) => {
    res.render("clients/add");
});
  
// Dodawanie klienta do bazy
router.post("/add", requireLogin, async (req, res) => {
  const { name, adres, nip, companyOrPerson } = req.body;
  let errors = [];

  // Walidacja
  if (!name || !adres) {
    errors.push("Nazwa i adres są wymagane.");
  }

  // Walidacja NIP (w tym przykładzie po prostu sprawdzamy, czy ma długość 10 znaków)
  if (nip && nip.length !== 10) {
    errors.push("NIP musi mieć dokładnie 10 znaków.");
  }

  // Sprawdzanie, czy klient o podanym NIPie już istnieje
  const existingClient = await Client.findOne({ nip });
  if (existingClient) {
    errors.push("Klient z tym NIP-em już istnieje.");
  }

  // Jeśli wystąpiły błędy, renderujemy ponownie formularz z odpowiednimi komunikatami
  if (errors.length > 0) {
    return res.render("clients/add", { errors, name, adres, nip, companyOrPerson  });
  }

  try {
    const newClient = new Client({ name, address: adres, nip, companyOrPerson  });
    await newClient.save();
    res.redirect("/clients");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas zapisu klienta." });
  }
});



  // Formularz edytowania klienta
router.post("/edit-form", requireLogin, async (req, res) => {
  const { clientId } = req.body;
  try {
    const client = await Client.findById(clientId).lean();
    if (!client) {
      return res.status(404).render("404", { message: "Klient nie znaleziony" });
    }
    res.render("clients/edit", { client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});
  
// Zaktualizowanie danych klienta
router.post("/edit/:id", requireLogin, async (req, res) => {
    const { id } = req.params;
    const { name, address, nip, companyOrPerson } = req.body;
    try {
        await Client.findByIdAndUpdate(id, {
        name,
        address,
        nip,
        companyOrPerson
        });
        res.redirect("/clients");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd serwera" });
    }
});



// Usuwanie klienta
router.post("/delete/:id", requireLogin, async (req, res) => {
    const { id } = req.params;
    try {
      await Client.findByIdAndDelete(id);
      res.redirect("/clients");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Błąd serwera" });
    }
  });
  

  
module.exports = router;