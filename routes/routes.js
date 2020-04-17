const routes = require("express").Router();
const cIndex = require("../modules/index/cIndex");

// Inicio
routes.get("/", cIndex.getInicio);
routes.get("/inicio", cIndex.getInicioAjax);
routes.get("/contacto", (req, res) => {
    res.render("contacto");
});
routes.get("/check-out", (req, res) => {
    res.render("check-out")
});
routes.get("/login", (req, res) => {
    res.render("login");
})


module.exports = routes;