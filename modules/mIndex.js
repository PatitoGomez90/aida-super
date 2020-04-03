const db = require("../config/database").db;

exports.getTopProductos = () => {
    return db("select top 12 * from stock", []);
}

exports.get100Productos = () => {
    return db("select top 24 * from stock", []);
}

exports.searchProducto = obj => {
    return db("select * from stock where st_nombre like '%" + obj.producto + "%'", []);
}