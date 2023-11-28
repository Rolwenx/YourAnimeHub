// controllers/hello.route.js
const express = require('express');
const router = express.Router();

// http://localhost:9000/quote/quoteid
router.get('/quoteid', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('single_view/single_quote', { user: req.user });
});

module.exports = router;