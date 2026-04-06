const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    res.render("AI_Call_Agent"); // also rename the file to remove the space
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/signup", function(req, res) {
    res.render("signup");
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});