const db = require("../config/database").db;

exports.getTopProductos = () => {
    return db(`
        select top 12 s.*,
        RTRIM(LTRIM(s.st_larga)) as larga,
        RTRIM(LTRIM(s.st_codigo1)) as codigo1,
        RTRIM(LTRIM(m.ma_nombre)) as marca 
        from stock s 
        left join MARCAS m on m.ma_codigo = s.st_marc
    `, []);
}

exports.get100Productos = () => {
    return db(`
        select top 24 s.*, 
        RTRIM(LTRIM(s.st_larga)) as larga,
        RTRIM(LTRIM(s.st_codigo1)) as codigo1,
        RTRIM(LTRIM(m.ma_nombre)) as marca 
        from stock s
        left join MARCAS m on m.ma_codigo = s.st_marc
    `, []);
}

exports.searchProducto = obj => {
    return db("select * from stock where st_nombre like '%" + obj.producto + "%'", []);
}

exports.getCliente = (email, dni) => {
    params = [
        { name: "email", value: email },
        { name: "dni", value: dni }
    ];
    return db(`
        select *, 
        RTRIM(LTRIM(cl_direc)) as direccion,
        RTRIM(LTRIM(cl_tele)) as telefono,
        RTRIM(LTRIM(cl_celu)) as celular
        from clientes
        where cl_docu = @dni and cl_mail = @email
    `, params);
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

exports.getNroFact = () => {
    return db("SELECT MAX(fa_nume) as nroFactura from fact where fa_tipo = 'N'", []);
}

exports.Sp_Sele_Movi = () => {
    var fecha = new Date();
    var year = fecha.getFullYear();
    var mes = fecha.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;
    var dia = fecha.getDate();
    if (dia < 10) dia = "0" + dia;
    fecha = year + "/" + mes + "/" + dia
    return db(`
      EXEC Sp_Sele_Movi 0, '${fecha}', 'PAGINA WEB'
    `, []);
}

exports.insertFact = obj => {
    params = [
        { name: "nrofact", value: obj.nrofact },
        { name: "idusuario", value: obj.idusuario },
        { name: "metodopago", value: obj.metodopago },
        { name: "total", value: obj.total },
        { name: "numovi", value: obj.numovi },
        { name: "usuario", value: obj.usuario },
        { name: "metodoenvio", value: obj.metodoenvio },
        { name: "observaciones", value: obj.observaciones },
        { name: "direccion", value: obj.direccion },
    ]
    return db(`
      INSERT INTO FACT 
      (FA_TIPO, FA_NUME, FA_CLIE, FA_FECHA, FA_CONDI,
      FA_SUBTO, FA_IMPU, FA_SUBTO2, FA_IVAI, FA_IVAN,
      FA_TOTAL, FA_CUIT, FA_RAZON, FA_IVA, FA_MOVI,
      FA_TICO, FA_TOPA, FA_DET1, FA_DET2, FA_DET3,
      FA_NETO, FA_NOGRA, FA_EMPE, FA_HORA, FA_PORRET, FA_IMPRET,
      FA_VENCE, FA_USS, FA_CAMBIO, FA_REMITO, FA_MEDIOS, FA_REMI2, FA_RETI) VALUES 
      ('N', @nrofact, @idusuario, GETDATE(), @metodopago, 
      @total, 0, @total, 0, 0, 
      @total, '', @usuario, 0, @numovi, 6, 0,
      @metodoenvio, @observaciones, @direccion, 0, @total, 0, space(0), 0, 0, GETDATE(), 'N', 0, 
      '', '', '', '')
    `, params);
}

exports.insertFac2 = (nrofactura, idusuario, idproducto, cantidad, nombre_producto, precio_producto, total) => {
    params = [
        { name: "idusuario", value: idusuario },
        { name: "nrofactura", value: nrofactura },
        { name: "idproducto", value: idproducto },
        { name: "cantidad", value: cantidad },
        { name: "nombre_producto", value: nombre_producto },
        { name: "precio_producto", value: precio_producto },
        { name: "total", value: total },
    ];
    return db(`
      INSERT INTO FAC2 (F2_TIPO,F2_CLIE,F2_NUME,F2_FECHA,F2_CODIGO,F2_CANTI,F2_NOMBRE,F2_PUNI,F2_PTOT,F2_IMPUE,
        F2_IVAI,F2_IVAN,F2_DEPO,F2_BONIPO,F2_BONIPE,F2_LISTA,F2_COSTOP,F2_COSTOPA,F2_PUNICOM, F2_REMI, F2_UNID, F2_CONTA,
        F2_HORA) VALUES ('N', @idusuario, @nrofactura, GETDATE(), @idproducto, @cantidad, @nombre_producto,
        @precio_producto, @total, 0, 0, 0, '0', 0, 0, 1, 0, 0, 0, '', '', 0, '')
    `, params);
}