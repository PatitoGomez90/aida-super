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