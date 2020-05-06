const mUsuarios = require("../models/mUsuarios");

exports.getMiCuenta = async (req, res) => {
    const pedidos = await mUsuarios.getPedidos(req.session.user[0].cl_nume);
    const datos = await mUsuarios.getDatosUsuario(req.session.user[0].cl_nume);
    res.render("mi-cuenta", { pedidos, datos });
}

exports.postModificarDatos = async (req, res) => {
    let {
        nombres,
        email,
        documento,
        localidad,
        direccion,
        codigopostal,
        celular,
        telefono
    } = req.body;

    if (!nombres.trim().length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un nombre"
        });
    }

    if (!email.trim().length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un correo electronico"
        });
    }

    if (!validateEmail(email.trim())) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un correo electronico valido"
        });
    }

    const checkEmail = await mUsuarios.getMailByCliente(email, req.session.user[0].cl_nume);
    if (checkEmail.length) {
        return res.json({
            type: "error",
            title: "Error",
            text: "El email ingresado ya corresponde a un usuario registrado"
        });
    }

    if (!documento.trim().length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar su numero de dni"
        });
    }

    if (documento.trim().length < 7) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un numero de dni valido"
        });
    }

    const checkDni = await mUsuarios.getClienteByDni(documento, req.session.user[0].cl_nume);
    if (checkDni.length) {
        return res.json({
            type: "error",
            title: "Error",
            text: "El DNI ingresado ya corresponde a un usuario registrado"
        });
    }

    if (!localidad.trim().length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar una ciudad"
        });
    }

    if (!direccion.trim().length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar una direccion"
        });
    }

    if (!codigopostal.trim().length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar un codigo postal"
        });
    }

    if (!celular.trim().length && !telefono.trim().length) {
        return res.json({
            type: "warning",
            title: "Alerta",
            text: "Debe ingresar al menos un numero de contacto"
        });
    }

    req.body.numero = req.session.user[0].cl_nume;

    const result = await mUsuarios.updateCliente(req.body);
    if (!result[0].rows) {
        return res.json({
            type: "error",
            title: "Error",
            text: "Hubo un error al procesar la solicitud (1)"
        });
    }

    res.send({
        type: "success",
        title: "Exito",
        text: "Datos modificados correctamente"
    });
}

exports.getPedido = async (req, res) => {
    const pedido = await mUsuarios.getPedidoByNumero(req.params.numero);
    res.send(pedido);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}