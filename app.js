const express = require("express");
const app = express();
const cons = require("consolidate");
const swig = require("swig");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");

app.use(bodyParser.json({ limit: "40000MB" }));
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 1000000
    })
);

app.use(session({
    secret: "algodificil",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    ephemeral: true,
    resave: false,
    saveUninitialized: false
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(morgan("dev"));
app.engine("html", cons.swig);
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("*", (req, res, next) => {
    req.session.cart = req.session.cart || [];
    res.locals.cart = req.session.cart || [];
    next();
});

app.use(function (req, res, next) {
    if (req.session.user != null) {
        res.locals.user = req.session.user;
    }
    next();
});

app.use("/", require("./routes"));

app.listen(5000, error => {
    if (error) throw error;
    console.log("Server listen on port 5000");
});
