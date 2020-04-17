const db = require("../../config/database").db;

exports.getCategorias = () => {
    return db(`
        select DISTINCT(st.st_depar) as codigo, RTRIM(LTRIM(d.de_deno)) as nombre
        from STOCK as st
        left join Depar d on st.st_depar = d.de_nume
        where st.st_depar < 30 and st.st_depar <> 13
        order by 1
    `, []);
}

exports.getProductos = () => {
    return db("select top 24 s.*, m.ma_nombre as marca from stock s left join MARCAS m on m.ma_codigo = s.st_marc", []);
}

exports.getRubros = codigo => {
    params = [{ name: "codigo", value: codigo }];
    return db(`
        select distinct(rtrim(ltrim(r.ru_deno))) as rubro, r.ru_nume as codigoRubro 
        from stock s
        left join rubros r on r.ru_nume = s.st_rubr
        left join depar d on d.de_nume = s.st_depar
        where s.st_depar = @codigo
        order by rubro
    `, params);
}

exports.getProductosByCategoriaYRubro = (categoria, rubro) => {
    params = [
        { name: "categoria", value: categoria },
        { name: "rubro", value: rubro }
    ];
    return db(`
        select s.*, m.ma_nombre as marca 
        from stock s 
        left join MARCAS m on m.ma_codigo = s.st_marc
        left join rubros r on r.ru_nume = s.st_rubr
        left join depar d on d.de_nume = s.st_depar
        where s.st_depar = @categoria and s.st_rubr = @rubro
    `, params);
}

exports.getProductosByCategoria = categoria => {
    params = [{ name: "categoria", value: categoria }];
    return db(`
        select * from stock where st_depar = @categoria
    `, params);
}

exports.getProductosByNombre = valor => {
    return db(`select * from stock where st_nombre like '%${valor}%'`, []);
}