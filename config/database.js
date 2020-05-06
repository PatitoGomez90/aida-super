const sql = require('mssql');
const config = {
    user: 'sa',
    server: "170.80.173.67",
    // server: "pcleandro.dyndns.info",
    password: "pumitas",
    // password: "pumas",
    database: 'ASUPER',
    port: 1433,
    // port: 14333,
    requestTimeout: 80000,
    options: {
        tdsVersion: "7_1"
    },
};

exports.db = async (query, params) => {
    await sql.connect(config);
    let request = await new sql.Request();
    for (var i = 0; i < params.length; i++) request.input(params[i].name, sql.VarChar, params[i].value);

    console.log("");
    console.log("--------- DEBUG ---------");
    console.log("");
    console.log(query);
    console.log("");
    let result = await request.query(query);
    return result;
};
