const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contacto", (req, res) => {
    res.render("contacto");
});

module.exports = router;
