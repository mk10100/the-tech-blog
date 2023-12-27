const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const allRoutes = require("./controllers/allRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main", // Assuming main.handlebars is your main layout
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use("/", allRoutes);

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
