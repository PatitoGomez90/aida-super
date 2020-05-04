const mUsuarios = require("../models/mUsuarios");

router.post("/registro", async (req, res) => {
    console.log(req.body);
    let { nombres, email, telefono, clave } = req.body;

    if (!nombres || !email || !telefono || !clave) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Debe completar todos los campos"
        });
    }

    if (!validateEmail(email)) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Ingrese un email valido"
        });
    }

    // let checkUser = await mUsuarios.getUsuarioByEmail(email);
    // if (checkUser.length) {
    //     return res.json({
    //         type: "error",
    //         title: "Error",
    //         text: "El email ingresado ya esta registrado"
    //     });
    // }

    res.send({
        type: "success",
        title: "Exito",
        text: "Usuario registrado correctamente"
    })
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = router;