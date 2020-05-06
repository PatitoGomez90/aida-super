const db = require("../config/database").db;

exports.getDatosUsuario = usuario => {
    params = [{ name: "usuario", value: usuario }];
    return db(`
        select 
        RTRIM(LTRIM(cl_apel)) as cl_apel,
        RTRIM(LTRIM(cl_docu)) as cl_docu,
        RTRIM(LTRIM(cl_mail)) as cl_mail,
        RTRIM(LTRIM(cl_local)) as cl_local,
        RTRIM(LTRIM(cl_direc)) as cl_direc,
        RTRIM(LTRIM(cl_cp)) as cl_cp,
        RTRIM(LTRIM(cl_celu)) as cl_celu,
        RTRIM(LTRIM(cl_tele)) as cl_tele
        from clientes
        where cl_nume = @usuario
    `, params);
}

exports.getPedidos = usuario => {
    params = [{ name: "usuario", value: usuario }];
    return db(`
        SELECT top 30 fa_nume, 
        CONVERT(VARCHAR(10), fa_fecha, 103) + ' ' + LTRIM(RIGHT(CONVERT(CHAR(20), fa_fecha, 22), 11)) as fechahora, 
        fa_fecha,fa_total,fa_vence, fa_uss, CASE 
        WHEN fa_uss = 'N' THEN 'Pendiente' 
        when fa_uss = 'P' then 'Preparado' 
        else 'Enviado' end as estado, fa_remito as facturado, left(fa_remito, 1) as letra, 
        right(fa_remito, 12) as numero 
        FROM FACT WHERE fa_tipo='N' AND fa_clie = @usuario
        ORDER BY fa_nume DESC
    `, params);
}

exports.getPedidoByNumero = numero => {
    params = [{ name: "numero", value: numero }];
    return db(`
        SELECT rtrim(ltrim(F2_NOMBRE)) as nombre,F2_CANTI,F2_PTOT,F2_PUNI,F2_PUNICOM 
        FROM FAC2 WHERE F2_TIPO='N' AND F2_NUME = @numero
    `, params);
}

exports.getMailByCliente = (email, usuario) => {
    params = [{ name: "email", value: email }, { name: "usuario", value: usuario }];
    return db(`
        select * from clientes where cl_mail = @email and cl_nume <> @usuario
    `, params);
}

exports.getClienteByDni = (documento, usuario) => {
    params = [{ name: "documento", value: documento }, { name: "usuario", value: usuario }];
    return db(`
        select * from clientes where cl_docu = @documento and cl_nume <> @usuario
    `, params);
}

exports.updateCliente = obj => {
    params = [
        { name: "numero", value: obj.numero },
        { name: "nombres", value: obj.nombres },
        { name: "direccion", value: obj.direccion },
        { name: "localidad", value: obj.localidad },
        { name: "codigopostal", value: obj.codigopostal },
        { name: "telefono", value: obj.telefono },
        { name: "email", value: obj.email },
        { name: "celular", value: obj.celular },
        { name: "documento", value: obj.documento },
    ];

    return db(`
        update clientes set cl_apel = @nombres, cl_direc = @direccion, cl_local = @localidad,
        cl_cp = @codigopostal, cl_tele = @telefono, cl_mail = @email, cl_celu = @celular, cl_docu = @documento
        where cl_nume = @numero; SELECT @@ROWCOUNT AS rows
    `, params);
}