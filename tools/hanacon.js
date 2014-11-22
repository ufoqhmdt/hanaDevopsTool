var hdb = require('hdb');
var client = hdb.createClient({
    host: '10.58.120.178',
    port: 30415,
    user: 'SYSTEM',
    password: 'manager'
});

client.connect(function(err) {
    if (err) {
        return console.error('Connect error', err);
    }
    console.log("---start");
    var schema = "SLDDATATA";

    var sql = 'set schema "' + schema + '"';
    client.exec(sql, function(err, rows) {
        client.end();
        if (err) {
            return console.error('Execute error:', err);
        }
        console.log('Results:', rows);

        var sql = 'select a.id, a.name as hostname, a.username, a.password, b.name as schemaname from dbserverinstances a, companydbs b where a.id = b.dbsvrinstance_id and b.status is NULL';
        console.log(sql);
        client.exec(sql, function(err, rows) {
            client.end();
            if (err) {
                return console.error('Execute error:', err);
            }
            console.log('Results:', rows);
        });
        console.log("---end");
    });


});

module.exports = client;