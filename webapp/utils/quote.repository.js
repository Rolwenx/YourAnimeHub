// quote.repository.js

pool = require("../utils/db.js");

module.exports = {
    getBlankQuote() {
        // Return a template object representing a quote with default values
        return {
            "QuoteID": 0,
            "QuoteText": "",
            "CharacterID": 0,
            "AnimeID": 0,
            "QuoteLikes": 0
        };
    },

    async getAllQuotes() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM AnimeQuote";
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getOneQuote(quoteId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM AnimeQuote WHERE QuoteID = ?";
            const [rows, fields] = await conn.execute(sql, [quoteId]);
            conn.release();
            if (rows.length === 1) {
                return rows[0];
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async delOneQuote(quoteId) {
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM AnimeQuote WHERE QuoteID = ?";
            const [okPacket, fields] = await conn.execute(sql, [quoteId]);
            conn.release();
            console.log("DELETE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async addOneQuote(quoteData) {
        try {
            let conn = await pool.getConnection();
            let sql = "INSERT INTO AnimeQuote SET ?";
            const [okPacket, fields] = await conn.execute(sql, [quoteData]);
            conn.release();
            console.log("INSERT " + JSON.stringify(okPacket));
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async editOneQuote(quoteId, quoteData) {
        try {
            let conn = await pool.getConnection();
            let sql = "UPDATE AnimeQuote SET ? WHERE QuoteID = ?";
            const [okPacket, fields] = await conn.execute(sql, [quoteData, quoteId]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getQuotesByAnime(animeId) {
        try {
            let conn = await pool.getConnection();
            let sql = `
                SELECT quote.*, character.CharName, anime.TitleEnglish
                FROM AnimeQuote AS quote
                INNER JOIN Character_Card AS character ON quote.CharacterID = character.CharacterID
                INNER JOIN Anime AS anime ON quote.AnimeID = anime.AnimeID
                WHERE quote.AnimeID = ?
            `;
            const [rows, fields] = await conn.execute(sql, [animeId]);
            conn.release();
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getQuotesByCharacter(characterId) {
        try {
            let conn = await pool.getConnection();
            let sql = `
            SELECT quote.*, character.CharName, anime.TitleEnglish
            FROM AnimeQuote AS quote
            INNER JOIN Character_Card AS character ON quote.CharacterID = character.CharacterID
            INNER JOIN Anime AS anime ON quote.AnimeID = anime.AnimeID
            WHERE quote.CharacterID = ?;            
            `;
            const [rows, fields] = await conn.execute(sql, [characterId]);
            conn.release();
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};
