const path = require("path");
require("./db/mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const hbs = require("hbs");
const app = express();
app.use(express.json());
const userRoutes = require("./routes/user-routes");
const homeRoutes = require("./routes/home-routes");
const port = process.env.PORT || 3000
app.use(cookieParser());
app.use(cors());

const publicDirectory = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../Templates/views");
const partialsPath = path.join(__dirname, "../Templates/partials");
//Change default view engine to hbs
app.set("view engine", "hbs");
// Set view path
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectory));
app.use(userRoutes);
app.use(homeRoutes);
app.get("", (req, res) => {
  res.render("index");
});
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
