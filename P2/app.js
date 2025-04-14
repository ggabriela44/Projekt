const express = require("express");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");
const session = require("express-session");
const app = express();

mongoose.connect("mongodb://localhost:27017/crm");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: true }));

const handlebars = hbs.create({
  extname: "hbs",
  helpers: {
    eq: (a, b) => a === b,
    ifEquals: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  }
});

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

// Routes
const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const actionRoutes = require("./routes/actions");

app.use("/", authRoutes);
app.use("/clients", clientRoutes);
app.use("/actions", actionRoutes);

const PORT = 3100;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
