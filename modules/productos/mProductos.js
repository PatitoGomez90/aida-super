const db = require("../../config/database").db;

exports.getCategorias = () => {
    return db(`
        select DISTINCT(st.st_depar) as codigo, d.de_deno as nombre
        from STOCK as st
        left join Depar d on st.st_depar = d.de_nume
        where st.st_depar < 30 and st.st_depar <> 13
        order by 1
    `, []);
}

exports.getProductos = () => {
    return db("select top 24 * from stock", []);
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