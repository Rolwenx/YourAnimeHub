const express = require('express');
const router = express.Router();
const quoteRepo = require('../utils/quote.repository');

router.get('/:quoteId', QuoteViewAction);

async function QuoteViewAction(request, response) {
    var quoteId = request.params.quoteId;
    const userId = request.user ? request.user.UserID : null;
    try {
        // Fetch the quote data
        var quote = await quoteRepo.getOneQuote(quoteId);
        const is_quote_favourited = await quoteRepo.CheckIfQuoteInFavourite(userId,quoteId);

        response.render("single_view/single_quote", { is_quote_favourited,"quote": quote, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in QuoteViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;
