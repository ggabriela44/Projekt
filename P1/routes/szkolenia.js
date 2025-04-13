const express = require("express");
const router = express.Router();
const Szkolenie = require("../models/Szkolenie");

router.get("/", async (req, res) => {
    const szkolenia = await Szkolenie.find().lean();
    res.render("index", {szkolenia});
});

// Add
router.post("/add", async (req, res) => {
    // console.log(req.body); 
    const { name, event, city } = req.body;
    if (!name || !event || !city) {
        const szkolenia = await Szkolenie.find().lean();
        let errorMessage = [];
    
        if (!name) errorMessage.push("Imię i nazwisko jest wymagane.");
        if (!event) errorMessage.push("Wybór wydarzenia jest wymagany.");
        if (!city) errorMessage.push("Wybór miasta jest wymagany.");
    
        return res.render("index", {
            szkolenia,
            errorMessage,
            formData: { name, event, city } // <-- to przekaże dane z formularza
        });
    }

    try {
        await Szkolenie.create({ name, event, city });
        res.redirect("/");
    } catch (err) {
        console.error("Błąd serwera", err);
        res.status(500).json({ message: "Błąd serwera" });
    }
});

// Delete
router.post("/delete/:id", async (req, res) => {
    await Szkolenie.findByIdAndDelete(req.params.id);
    res.redirect("/");
});


module.exports = router;