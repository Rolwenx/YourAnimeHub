// controllers/hello.route.js
const express = require('express');
const router = express.Router();

router.get('/my/:name', mynameAction);
router.get('/myy', mynameAction);
async function mynameAction(request, response) {
    response.send("MYNAME ACTION "+request.params.name);
}

// http://localhost:9000/manga/mangaid/manganame
router.get('/mangaid/manganame', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('single_view/single_manga', { favourites: [] });
});

module.exports = router;