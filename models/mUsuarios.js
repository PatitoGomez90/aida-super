const db = require("../config/database").db;

exports.getUsuarioByEmail = email => {
    params = [{ name: "email", value: email }];
    return db("select * from usuariosweb where email = @email", params);
}