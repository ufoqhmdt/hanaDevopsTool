var express = require('express');
var router = express.Router();
// var hanaClient = require('../tools/hanacon');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var sqliteDBPath = path.join(__dirname, '/ghost.db');
var hdb = require('hdb');

/* GET home page. */
router.get('/', function(req, res) {
    var db = new sqlite3.Database(sqliteDBPath);

    db.serialize(function() {
        db.run("select * from configs");
        var i = 0;
        var datas = [];
        db.each("SELECT rowid AS id, host,port,account,password,schema,sql FROM configs", function(err, row) {
            datas.push({
                "row": row.id,
                "host": row.host,
                "port": row.port,
                "account": row.account,
                "password": row.password,
                "schema": row.schema,
                "sql": row.sql
            });
        }, function() {
            res.render('index', {
                ufo: datas
            });
        });
    });
    db.close();
});

router.get('/saveSettings', function(req, res) {
    var db = new sqlite3.Database(sqliteDBPath);
    var host = req.query.host;
    var port = req.query.port;
    var account = req.query.account;
    var password = req.query.password;
    var schema = req.query.schema;
    var sql = req.query.sql;
    db.serialize(function() {
        db.run("CREATE TABLE if not exists configs (host TEXT,port TEXT,account TEXT, password TEXT, schema TEXT,sql TEXT)");

        var stmt = db.prepare("INSERT INTO configs (host,port,account,password,schema,sql) VALUES ($host,$port,$account,$password,$schema,$sql)");
        stmt.run({
            $host: host,
            $port: port,
            $account: account,
            $password: password,
            $schema: schema,
            $sql: sql
        });
        stmt.finalize();
        var datas = [];
        db.each("SELECT rowid AS id, host,port,account,password,schema,sql FROM configs", function(err, row) {
            datas.push({
                "row": row.id,
                "host": row.host,
                "port": row.port,
                "account": row.account,
                "password": row.password,
                "schema": row.schema,
                "sql": row.sql
            });
        }, function() {
            res.send(datas);
        });
    });
    db.close();
});

router.get('/sqliteSel', function(req, res) {
    var db = new sqlite3.Database(sqliteDBPath);

    db.serialize(function() {
        // db.run("select * from configs");
        var i = 0;
        var datas = [];
        db.each("SELECT rowid AS id, host,port,account,password,schema,sql FROM configs", function(err, row) {
            datas.push({
                "row": row.id,
                "host": row.host,
                "port": row.port,
                "account": row.account,
                "password": row.password,
                "schema": row.schema,
                "sql": row.sql
            });
        }, function() {
            res.send(datas);
        });
    });
    db.close();
});


router.get('/sqliteDelTable', function(req, res) {
    var db = new sqlite3.cached.Database(sqliteDBPath);

    // db.serialize(function() {
    //     db.run("INSERT INTO configs VALUES ($host,$account,$password,$schema,$sql)", {$host:"hostlllll"}, function(err, row) {
    //         console.log(err)
    //         console.log(row);
    //         res.send(row);
    //     });
    // });

    db.serialize(function() {
        db.run("delete from configs", function(err, row, aa) {
            console.log(err);
            console.log(row);
            console.log(this);
            res.send(row);
        });
    });
    db.close();
});


router.get('/sqliteDelDB', function(req, res) {
    var db = new sqlite3.cached.Database(sqliteDBPath);
    db.serialize(function() {
        db.run("drop table if exists configs", function(err, row, aa) {
            console.log(err);
            console.log(row);
            console.log(this);
            res.send(row);
        });
    });
    db.close();
});

router.get('/getTenentsInfotest', function(req, res) {
    res.type('application/json');
    console.log(req.query);

    var schema = req.query.schema;
    var sql = req.query.sql;

    var client = hdb.createClient({
        host: req.query.host,
        port: req.query.port,
        user: req.query.account,
        password: req.query.password
    });


    client.connect(function(err) {
        if (err) {
            return console.error('Connect error', err);
        }
        var schema = "SLDDATATA";

        var sql = 'set schema "' + schema + '"';
        client.exec(sql, function(err, rows) {
            client.end();
            if (err) {
                return console.error('Execute error:', err);
            }
            console.log('Results:', rows);

            var sql = 'select * from "USERS"';
            console.log(sql);
            client.exec(sql, function(err, rows) {
                client.end();
                if (err) {
                    return console.error('Execute error:', err);
                }
                console.log('Results:', rows);
                res.send(rows);
            });
            console.log("---end");
        });
    });
});


router.get('/getTenentsInfo', function(req, res) {
    res.type('application/json');
    console.log(req.query);

    var schema = req.query.schema;
    var sql = req.query.sql;

    var client = hdb.createClient({
        host: req.query.host,
        port: req.query.port,
        user: req.query.account,
        password: req.query.password
    });


    client.connect(function(err) {
        if (err) {
            return console.error('Connect error', err);
        }
        var schema = "SLDDATATA";

        var sql = 'set schema "' + schema + '"';
        client.exec(sql, function(err, rows) {
            client.end();
            if (err) {
                return console.error('Execute error:', err);
            }
            console.log('Results:', rows);


            function getSUHana() {
                var sql = 'select a.id, a.name as hostname, a.username, a.password, b.name as schemaname from dbserverinstances a, companydbs b where a.id = b.dbsvrinstance_id and b.status is NULL';
                console.log(sql);
                client.exec(sql, function(err, rows) {
                    client.end();
                    if (err) {
                        return console.error('Execute error:', err);
                    }
                    console.log('Results:', rows);
                    res.send(rows);
                });
                console.log("---end");
            }

            getSUHana();

        });
    });
});



router.get('/saveTenentDBinfo', function(req, res) {
    console.log("--------1");
    var hostname = req.query.hostname;
    var schemaname = req.query.schemaname;
    var username = req.query.username;
    var password = req.query.password;

    saveTenentDBinfo(hostname,schemaname,username,password,res);

    /*var db = new sqlite3.Database(sqliteDBPath);
    console.log("--------4");
    db.serialize(function() {
        console.log("--------5");
        db.run("CREATE TABLE if not exists tenentDBinfo (hostname TEXT,schemaname TEXT,username TEXT, password TEXT)");

        var stmt = db.prepare("INSERT INTO tenentDBinfo (hostname,schemaname,username,password) VALUES ($hostname,$schemaname,$username,$password)");
        stmt.run({
            $hostname: hostname,
            $schemaname: schemaname,
            $username: username,
            $password: password
        });
        stmt.finalize();
        var datas = [];
        console.log("--------55");
        db.each("SELECT rowid AS id,hostname,schemaname,username,password FROM tenentDBinfo", function(err, row) {
            console.log(err);
            datas.push({
                "hostname": row.hostname,
                "schemaname": row.schemaname,
                "username": row.username,
                "password": row.password
            });
            console.log("--------6");
        }, function() {
            res.send(datas);
            console.log("--------7");
        });
    });
    db.close();*/
    console.log("--------89");
});

router.get('/selTenentDBinfo', function(req, res) {
    var db = new sqlite3.Database(sqliteDBPath);

    db.serialize(function() {
        var i = 0;
        var datas = [];

        db.each("SELECT rowid AS id,hostname,schemaname,username,password FROM tenentDBinfo", function(err, row) {

            datas.push({
                "row": row.id,
                "hostname": row.hostname,
                "schemaname": row.schemaname,
                "username": row.username,
                "password": row.password
            });
        }, function() {
            res.send(datas);
        });
    });

    db.close();
});


function saveTenentDBinfo(hostname, schemaname, username, password,res) {
    var db = new sqlite3.Database(sqliteDBPath);
    console.log("--------4");
    var rtn = [];
    db.serialize(function() {
        console.log("--------5");
        db.run("CREATE TABLE if not exists tenentDBinfo (hostname TEXT,schemaname TEXT,username TEXT, password TEXT)");

        var stmt = db.prepare("INSERT INTO tenentDBinfo (hostname,schemaname,username,password) VALUES ($host,$port,$account,$password,$schema,$sql)");
        stmt.run({
            $hostname: hostname,
            $schemaname: schemaname,
            $username: username,
            $password: password
        });
        stmt.finalize();
        var datas = [];
        db.each("SELECT rowid AS id,hostname,schemaname,username,password FROM tenentDBinfo", function(err, row) {
            datas.push({
                "hostname": row.hostname,
                "schemaname": row.schemaname,
                "username": row.username,
                "password": row.password
            });
            console.log("--------6");
        }, function() {
            rtn.put(datas);
            res.send(rtn);
            console.log("--------7");
        });
    });
    db.close();
    console.log("--------8");
}



module.exports = router;