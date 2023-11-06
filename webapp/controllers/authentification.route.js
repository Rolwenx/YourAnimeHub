// controllers/hello.route.js
const express = require('express');
const router = express.Router();

router.get('/my/:name', mynameAction);
router.get('/myy', mynameAction);
async function mynameAction(request, response) {
    response.send("MYNAME ACTION "+request.params.name);
}

// http://localhost:9000/signup
router.get('/signup', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('authentification_signup', { favourites: [] });
});

// http://localhost:9000/login
router.get('/login', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('authentification_login', { favourites: [] });
});

// http://localhost:9000/terms
router.get('/terms', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('terms_conditions', { favourites: [] });
});
module.exports = router;