

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.set("view engine", "ejs");
app.set("views", "views");

app.listen(process.env.WEB_PORT, '0.0.0.0',
    function() { console.log("Listening on "+process.env.WEB_PORT); }
);

app.get('/', (request, response) => {
    response.render('home', {  });
});

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/css", express.static(__dirname + '/css'));
app.use("/img", express.static(__dirname + '/img'));

app.use("/", require("./controllers/home.route"));

app.use("/browse", require("./controllers/browse.route"));
app.use("/browse", express.static(__dirname + '/browse'));

app.use("/", require("./controllers/admin.route"));
app.use("/admin", express.static(__dirname + '/admin'));

app.use("/user", require("./controllers/user.route"));
app.use("/user", express.static(__dirname + '/user'));

app.use("/", require("./controllers/authentification.route"));


app.use("/anime", require("./controllers/anime.route"));
app.use("/manga", require("./controllers/manga.route"));
app.use("/quote", require("./controllers/quote.route"));
app.use("/review", require("./controllers/review.route"));
app.use("/character", require("./controllers/character.route"));





