/* verifies if theres database connection or not
const mysql = require('mysql2/promise');
const conn = mysql.createConnection({
    host:'localhost', user: 'root', database: 'carsdb', password: 'janelena17', debug: false
});
conn.then(function(conn) {
    conn.execute('SELECT * FROM users').then(function(result){ const [rows, fields]=result; console.log(rows); });
    conn.execute('SELECT * FROM cars').then(function(result){ const [rows, fields]=result; console.log(rows); process.exit(); });
});    
return;*/

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.listen(process.env.WEB_PORT, '0.0.0.0',
    function() { console.log("Listening on "+process.env.WEB_PORT); }
);

app.get('/', (request, response) => {
    // Render the hello_views.ejs file for the root URL
    response.render('home', { /* pass any data if needed */ });
});
// MIDDLEWARE REGISTRATIONS
// app.use(callback1, callback2, callback3)

// app.use(routeBase, callback);
app.use("/css", express.static(__dirname + '/css'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/", require("./controllers/home.route"));
app.use("/browse", require("./controllers/browse.route"));
app.use("/profile", require("./controllers/profile.route"));
app.use("/", require("./controllers/authentification.route"));




  
