const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const { requireLogin } = require("../middleware/auth");

router.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/clients");
  }

  res.render("login");
});

router.get("/login", (req, res) => {
  const successMessage = req.session.successMessage;
  req.session.successMessage = null; // wyczyść po pokazaniu
  res.render("login", { successMessage });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/dashboard", requireLogin, (req, res) => {
  res.render("dashboard");
});
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !password || !confirmPassword) {
    return res.render("register", {
      error: "Wszystkie pola są wymagane.",
      name, email
    });
  }

  if (!emailRegex.test(email)) {
    return res.render("register", {
      error: "Nieprawidłowy adres e-mail.",
      name, email
    });
  }

  if (password !== confirmPassword) {
    return res.render("register", {
      error: "Hasła nie są takie same.",
      name, email
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render("register", {
      error: "Użytkownik o tym adresie email już istnieje.",
      name, email
    });
  }

  try {
    const user = new User({ name, email, password });
    await user.save();

    req.session.successMessage = "Rejestracja zakończona sukcesem. Zaloguj się.";
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.render("register", {
      error: "Wystąpił błąd przy rejestracji.",
      name, email
    });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.render("login", { error: "Nieprawidłowy email lub hasło." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render("login", { error: "Nieprawidłowy email lub hasło." });
      }
  
      // Logowanie OK – zapis sesji
      req.session.userId = user._id;
      res.redirect("/clients");
    } catch (err) {
      console.error(err);
      res.status(500).send("Błąd logowania");
    }
  });

  
  // Wylogowanie
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Błąd przy wylogowywaniu" });
      }
      res.redirect("/login");
    });
  });

  module.exports = router;