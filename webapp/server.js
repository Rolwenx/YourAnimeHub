const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MariaDBStore = require('express-mysql-session')(session);
const auth = require("./utils/users.auth");

// Set up session store using MariaDB
const sessionStore = new MariaDBStore({
  host: process.env.MARIADB_HOST || 'localhost',
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || 'janelena17',
  database: process.env.MARIADB_DATABASE || 'animeDb',
  connectionLimit: 140, 
});


// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'SecretRandomStringDskghadslkghdlkghdghaksdghdksh',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day in msec
    resave: false,
    store: sessionStore,
  })
);

app.set("view engine", "ejs");
app.set("views", "views");

app.listen(process.env.WEB_PORT || 3000, '0.0.0.0', () => {
  console.log(`Listening on ${process.env.WEB_PORT || 3000}`);
});

// Initialize Passport
auth.initialization(app);

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

// Catch-all route for any undefined routes
app.get('/404', (req, res) => {
  res.render('404_error', { user: req.user, activePage: true });
});

app.get('*', (req, res) => {
  res.render('404_error', { user: req.user,activePage: true });
});