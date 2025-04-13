const express = require("express");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");

const app = express();

mongoose.connect("mongodb://localhost:27017/szkoleniaDB");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rejestracja silnika szablonów z helperami
const handlebars = hbs.create({
    extname: "hbs",
    helpers: {
        eq: (a, b) => a === b
    }
});

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

const szkoleniaRoutes = require("./routes/szkolenia");
app.use("/", szkoleniaRoutes);

const PORT = 3100;
app.listen(PORT, () => console.log(`Server working at http://localhost:${PORT}`));
