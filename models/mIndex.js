const db = require("../config/database").db;

exports.getTopProductos = () => {
    return db("select top 12 s.*, m.ma_nombre as marca from stock s left join MARCAS m on m.ma_codigo = s.st_marc", []);
}

exports.get100Productos = () => {
    return db("select top 24 s.*, m.ma_nombre as marca from stock s left join MARCAS m on m.ma_codigo = s.st_marc", []);
}

exports.searchProducto = obj => {
    return db("select * from stock where st_nombre like '%" + obj.producto + "%'", []);
}

exports.getCliente = (email, dni) => {
    params = [
        { name: "email", value: email },
        { name: "dni", value: dni }
    ];
    return db("select * from clientes where cl_docu = @dni and cl_mail = @email", params);
}

exports.getClienteByMail = email => {
    params = [{ name: "email", value: email }];
    return db("select * from clientes where cl_mail = @email", params);
}

exports.getClienteByDni = dni => {
    params = [{ name: "dni", value: dni }];
    return db("select * from clientes where cl_docu = @dni", params);
}

exports.getMaxNroCliente = () => {
    return db("select max(isnull(cl_nume, 0)) + 1 as numero from clientes", []);
}

exports.insertCliente = obj => {
    params = [
        { name: "numero", value: obj.numero },
        { name: "nombres", value: obj.nombres },
        { name: "direccion", value: obj.direccion },
        { name: "ciudad", value: obj.ciudad },
        { name: "codigopostal", value: obj.codigopostal },
        { name: "telefono", value: obj.telefono },
        { name: "email", value: obj.email },
        { name: "celular", value: obj.celular },
        { name: "dni", value: obj.dni },
    ];

    return db(`
        insert into clientes (cl_nume, cl_apel, cl_direc, cl_local, cl_cp, cl_tele,
        cl_mail, cl_celu, cl_docu)
        values (@numero, @nombres, @direccion, @ciudad, @codigopostal, @telefono,
        @email, @celular, @dni); SELECT @@ROWCOUNT AS rows
    `, params)
}