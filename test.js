/*const mysql = require('mysql')
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "dispense"
});*/
/* create table
con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    let sqlCreate = "INSERT INTO admin (username, password) VALUES ('admin', 'admin')"
    con.query(sqlCreate , (err, result) =>{
        if (err) throw err;
        console.log("insert complete");
    });
});*/

/* insert data
con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    let sqlSearch = "SELECT * FROM admin"
    con.query(sqlSearch , (err, result) =>{
        if (err) throw err;
        result.map((row) => {
            console.log(row.username, row.password)
        });
    });
}); */

const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dispense'
})
pool.getConnection()
    .then(conn => {
        conn.query("SELECT * FROM admin")
            .then(row => {
                row.forEach(data => {
                    console.log(data)
                })
            })
            .catch(err => {
                console.log(err)
                conn.release()
            })
    }).catch(err => console.log(err))