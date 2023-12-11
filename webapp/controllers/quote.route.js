const express = require('express');
const router = express.Router();
const quoteRepo = require('../utils/quote.repository');

router.get('/:quoteId', QuoteViewAction);

async function QuoteViewAction(request, response) {
    var quoteId = request.params.quoteId;
    try {
        // Fetch the quote data
        var quote = await quoteRepo.getOneQuote(quoteId);
        var totalLikes = quote ? quote.QuoteLikes + quote.QuoteDislikes : 0;
        var Likes = quote ? quote.QuoteLikes : 0;
        var Dislikes = quote ? quote.QuoteDislikes : 0;
        var likeArray = [totalLikes, Likes, Dislikes];

        response.render("single_view/single_quote", { "likeArray": likeArray, "quote": quote, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in QuoteViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;
