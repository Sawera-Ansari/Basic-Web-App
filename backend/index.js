const mysql = require('mysql');
const express = require('express');
var app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const { json } = require('body-parser');

app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
app.use(express.urlencoded());

var mysqlConnection = mysql.createConnection({
    host    :'127.0.0.1',
    user    :'root',
    password:'',
    port    :'3307',
    database:'test'
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error :' + JSON.stringify (err, undefined, 2));
});

app.listen(8080, () => console.log('Express server is runnig at port no: 8080'));

app.post("/user/add", (req, res) => {
    let details = {
        user_name: req.body.user_name,
        password: req.body.password,
        view_permission: req.body.view_permission
    };
    let sql = "INSERT INTO users SET ?";
    mysqlConnection.query(sql, details, (error) => {

        if (error) {
            res.send({ status: false, message: "User creation Failed", err: error, body: req.body});
        } else {
            res.send({ status: true, message: "User created successfully" });
        }
    });
});

app.get('/users', (req, res) => {

    let qr = 'select * from users';
    mysqlConnection.query(qr, (err, result) => {
    if (err) {
        console.log(err, 'errs');
    }
        if (result.length > 0) {
            res.send({
                message: 'all user data',
                data: result
            });
        }
    });
});

app.get('/user/:userID', (req, res) => {
    let gID = req.params.userID;
    let qr = `select * from users where userID = ${gID}`;
    mysqlConnection.query(qr, (err, result) => {
        if (err) { console.log(err) };
        if (result.length > 0) {
            res.send({
                message: 'get single data',
                data: result
            });
        }
        else {
            res.send({
                message: 'data not found'
            });
        }
    });
});

app.get('/user/access/:userID', (req, res) => {
    let gID = req.params.userID;
    let qr = `select * from users join access on users.userID = access.userID join reports on access.reportID = reports.reportID where users.userID = ${gID}`;
    mysqlConnection.query(qr, (err, result) => {
        if (err) { console.log(err) };
        if (result.length > 0) {
            res.send({
                message: 'get single data',
                data: result
            });
        }
        else {
            res.send({
                message: 'data not found'
            });
        }
    });
});
    
app.put("/user/:id", (req, res) => {
    let details = {
        user_name: req.body.user_name,
        password: req.body.password,
        view_permission: req.body.view_permission,
        edit_permission: req.body.edit_permission,
        delete_permission: req.body.delete_permission
    };
    let sql = `UPDATE users SET ? WHERE userID = ${req.params.id}`;
    mysqlConnection.query(sql, details, (error) => {

        if (error) {
            res.send({ status: false, message: "User update Failed", err: error, body: req.body });
        } else {
            res.send({ status: true, message: "User updated successfully" });
        }
    });
});

app.delete('/user/:userID', (req, res) => {
    let gID = req.params.userID;
    let qr = `delete from users where userID = ${gID}`;
    mysqlConnection.query(qr, (err, result) => {
        if (err) { console.log(err) }
        else{
            res.send({
                message: 'user deleted',
                data: result
            });
        }
    });
});