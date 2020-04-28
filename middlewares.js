const fs = require("fs");

exports.auth = (req, res, next) => {
    if (req.session.auth) return next();
    else {
        if (req.xhr) res.sendStatus(401);
        else res.redirect("/");
    }
};

exports.ifFileExist = archivo => {
    let bandera = false;
    let path = __dirname + "/public/img/products_images/" + archivo;
    if (fs.existsSync(path)) bandera = true;
    return bandera;
};
