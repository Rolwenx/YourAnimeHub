// quote.repository.js

pool = require("../utils/db.js");
const animeRepo = require('../utils/anime.repository.js');
const characterRepo = require('../utils/characters.repository.js');

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
    
            // Ensure rows is an array
            const quoteList = await conn.query(sql);
            conn.release();

            // Map through each quote and replace AnimeID and CharacterID with names
            const updatedQuoteList = await Promise.all(quoteList.map(async (quote) => {
                const animeName = await animeRepo.getAnimeNameByID(quote.AnimeID);
                const characterName = await characterRepo.getCharacterNameByID(quote.CharacterID);

                // Add the corresponding names to the quote object
                return {
                    ...quote,
                    AnimeName: animeName,
                    CharacterName: characterName,
                };
            }));

        
    
            return updatedQuoteList;
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

            if (rows != null) {
                return rows;
            } else {
                return false;
            }
        } catch (err) {
            console.error('Error in getOneQuote:', err);
            throw err;
        }
    },

    async delOneQuote(quoteId) {
        try {
            let conn = await pool.getConnection();
    
    
            let sql = "DELETE FROM AnimeQuote WHERE QuoteID = ?";
            const [okPacket, fields] = await conn.execute(sql, [quoteId]);
            conn.release();
    
        } catch (err) {
            console.log(err);
            throw err;
        }
    },    


    async addOneQuote(quoteData) {
        
        try {
            let conn = await pool.getConnection();

            const existingQuote = await conn.query(
                'SELECT * FROM AnimeQuote WHERE QuoteText = ?',
                [quoteData.QuoteText]
            );
        

            if (existingQuote.length > 0) {
                // Same quote already exist
                return null; 
            }
    
            const keys = Object.keys(quoteData);
            const values = Object.values(quoteData);
    
            // Construct the SQL query with named placeholders
            const placeholders = keys.map(key => `${key} = ?`).join(', ');
            const sql = `INSERT INTO AnimeQuote SET ${placeholders}`;
    

            // Execute the query
            const result = await conn.execute(sql, values);

            const okPacket = result; 
            conn.release();
            return okPacket.insertId;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    },

    async editOneQuote(quoteId, quoteData) {
        try {
            let conn = await pool.getConnection();
            
            // Construct the SQL query with named placeholders for quoteData
            const placeholders = Object.keys(quoteData).map(key => `${key} = ?`).join(', ');
            const sql = `UPDATE AnimeQuote SET ${placeholders} WHERE QuoteID = ?`;
            
            
            // Combine values from animeData and quoteId
            const values = [...Object.values(quoteData), quoteId];
    
            // Execute the query
            const result = await conn.execute(sql, values);
        
    
            conn.release();
    
            return result;
        } catch (err) {
            console.error('Error in editOneQuote:', err);
            throw err;
        }
    },


    // NOT FUNCTIONAL
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
