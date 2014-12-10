var express = require('express');
var router = express.Router();
// var hanaClient = require('../tools/hanacon');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var sqliteDBPath = path.join(__dirname, '/ghost.db');
var hdb = require('hdb');


router.get('/', function(req, res) {
    var db = new sqlite3.Database(sqliteDBPath);

    db.serialize(function() {
        var i = 0;
        var datas = [];
        db.each("SELECT rowid AS id,host,port,pwd FROM hostschemapwdmappings", function(err, row) {
            console.log("-------");
            console.log(row);
            datas.push({
                "host": row.host,
                "port": row.port,
                "pwd": row.pwd
            });
        }, function() {
            res.render('hostschemapwdmappings', {
                ufo: datas
            });
        });
    });
    db.close();
});

router.get('/addHostSchemaPwdMapping', function(req, res) {
    var db = new sqlite3.Database(sqliteDBPath);
    var host = req.query.host;
    var port = req.query.port;
    var pwd = req.query.pwd;
    console.log("-------1");
    console.log(req.query);
    db.serialize(function() {
        db.run("CREATE TABLE if not exists hostschemapwdmappings (host TEXT,port TEXT,pwd TEXT)");

        var stmt = db.prepare("INSERT INTO hostschemapwdmappings (host,port,pwd) VALUES ($host,$port,$pwd)");
        stmt.run({
            $host: host,
            $port: port,
            $pwd: pwd
        });
        console.log("-------2");
        stmt.finalize();
        var datas = [];
        db.each("SELECT rowid AS id, host,port,pwd FROM hostschemapwdmappings", function(err, row) {
            console.log("-------3");
            datas.push({
                "host": row.host,
                "port": row.port,
                "pwd": row.pwd
            });
        }, function() {
            res.send(datas);
        });
    });
    db.close();
});

router.get('/selHostSchemaPwdMapping', function(req, res) {
    var db = new sqlite3.Database(sqliteDBPath);

    db.serialize(function() {
        var i = 0;
        var datas = [];
        db.each("SELECT rowid AS id,host,port,pwd FROM hostschemapwdmappings", function(err, row) {
            datas.push({
                "host": row.host,
                "port": row.port,
                "pwd": row.pwd
            });
        }, function() {
            res.send(datas);
        });
    });
    db.close();
});

router.get('/delHostSchemaPwdMapping', function(req, res) {
    var db = new sqlite3.cached.Database(sqliteDBPath);
    db.serialize(function() {
        db.run("delete from HostSchemaPwdMapping", function(err, row, aa) {
            console.log(err);
            console.log(row);
            console.log(this);
            res.send(row);
        });
    });
    db.close();
});


module.exports = router;