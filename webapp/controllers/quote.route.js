// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const quoteRepo = require('../utils/quote.repository');

router.get('/:quoteId', adminQuoteViewAction);


async function adminQuoteViewAction(request, response) {
    var quoteId = request.params.quoteId;
    try {
        // Fetch the quote data
        var quote = await quoteRepo.getOneQuote(quoteId);

        response.render("single_view/single_quote", { "quote": quote, user: request.user, activePage: 'browse'});
    } catch (error) {
        console.error('Error in adminQuoteViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;