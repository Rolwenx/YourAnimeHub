// controllers/hello.route.js
const express = require('express');
const router = express.Router();



// http://localhost:9000/quote/quoteid
router.get('/reviewid', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('single_view/single_review', { user: req.user });
});

module.exports = router;