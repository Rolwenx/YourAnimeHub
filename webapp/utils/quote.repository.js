// quote.repository.js

pool = require("../utils/db.js");
const animeRepo = require('../utils/anime.repository.js');
const characterRepo = require('../utils/characters.repository.js');

module.exports = {

    async getAllQuotes() {
        try {
            let conn = await pool.getConnection();
            let sql = `
                SELECT AnimeQuote.*, Anime.BackgroundImageURL
                FROM AnimeQuote
                JOIN Anime ON AnimeQuote.AnimeID = Anime.AnimeID
            `;
    
            // Ensure rows is an array
            const quoteList = await conn.query(sql);
            conn.release();

            const updatedQuoteList = await Promise.all(quoteList.map(async (quote) => {
                const animeName = await animeRepo.getAnimeNameByID(quote.AnimeID);
                const characterName = await characterRepo.getCharacterNameByID(quote.CharacterID);
    
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
            let sql = `
                SELECT quote.*, anime_char.CharName, anime.TitleEnglish, anime.BackgroundImageURL
                FROM AnimeQuote AS quote
                INNER JOIN Character_Card AS anime_char ON quote.CharacterID = anime_char.CharacterID
                INNER JOIN Anime AS anime ON quote.AnimeID = anime.AnimeID
                WHERE quote.QuoteID = ?;
            `;
            const [rows, fields] = await conn.execute(sql, [quoteId]);
            conn.release();
    
            if (rows!= null) {
                return rows; 
            } else {
                return null;
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
            await conn.execute(sql, [quoteId]);
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

    async getQuoteOfTheDay() {
        try {
            let conn = await pool.getConnection();
            // Step 1: Set isQuoteOfDay to false for all rows
            let updateSql = "UPDATE AnimeQuote SET isQuoteOfDay = 'False' WHERE isQuoteOfDay = 'True'";
            await conn.execute(updateSql);


            // Step 2: Select a random quote and update its isQuoteOfDay to true
            let selectSql = "SELECT * FROM AnimeQuote ORDER BY RAND() LIMIT 1";
            const [rows, fields] = await conn.execute(selectSql);
    
            if (rows != null) {
                const quote = rows;
                // We update the isQuoteOfDay attribute to "True"
                let updateSql = "UPDATE AnimeQuote SET isQuoteOfDay = 'True' WHERE QuoteID = ?";
                await conn.execute(updateSql, [quote.QuoteID]);
    
                conn.release();
            } else {
                conn.release();
                return null;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    // The quote of day currently is available thanks to its boolean, but only with AnimeID and CharacterID
    // This function will transform those ID into real names

    async transformQuoteOfDay() {
        try {
            let conn = await pool.getConnection();
            let selectSql = "SELECT * FROM AnimeQuote WHERE isQuoteOfDay = 'True'";
            const [rows, fields] = await conn.execute(selectSql);

            if (rows != null) {
                const quote = rows;
                const animeName = await animeRepo.getAnimeNameByID(quote.AnimeID);
                const characterName = await characterRepo.getCharacterNameByID(quote.CharacterID);

                // Add the corresponding names to the quote object
                const updatedQuote = {
                    ...quote,
                    AnimeName: animeName,
                    CharacterName: characterName,
                };
                conn.release();
                return updatedQuote;
            } else {
                conn.release();
                return null;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },    

    async getAllFavouriteQuote(userId){

        try {
            const conn = await pool.getConnection();
            // FA : UserID, AnimeID
            // A : TitleEnglish, CoverImageURL, BackgroundImageURL, EpisodeCount, TypeFormat, Likes
            const sql = "SELECT fq.*, a.TitleEnglish, a.AnimeID, a.AnimeFormat, a.CoverImageURL, aq.QuoteText, c.ImageURL, c.CharacterID, c.CharName FROM User_Favorite_Quote fq JOIN AnimeQuote aq ON fq.QuoteID = aq.QuoteID JOIN Anime a ON aq.AnimeID = a.AnimeID JOIN Character_Card c ON aq.CharacterID = c.CharacterID WHERE fq.UserID = ?";

            const quoteList = await conn.query(sql, [userId]);
            conn.release();

            if (!quoteList.length) {
                return [];
              }

              return quoteList;
            
        } catch (error) {
            console.error('Error in getAllFavouriteQuote:', error);
          throw error;
        }
      },

      async AddQuoteAsFavourite(userId, quoteId){

        try {
            const conn = await pool.getConnection();
            let insertSql = 'INSERT INTO User_Favorite_Quote (QuoteID, UserID) VALUES (?, ?)';
            await conn.execute(insertSql, [quoteId, userId]);

            conn.release();

            
        } catch (error) {
            console.error('Error in AddQuoteAsFavourite:', error);
          throw error;
        }
      },

      async RemoveQuoteAsFavourite(userId, quoteId){

        try {
            const conn = await pool.getConnection();
            let deleteSql = 'DELETE FROM User_Favorite_Quote WHERE QuoteID = ? AND UserID = ?';
            await conn.execute(deleteSql, [quoteId, userId]);
        
            conn.release();

            
        } catch (error) {
            console.error('Error in RemoveQuoteAsFavourite:', error);
          throw error;
        }
      },

      async CheckIfQuoteInFavourite(userId, quoteId){

        try {
            const conn = await pool.getConnection();
            let sql = 'SELECT * FROM User_Favorite_Quote WHERE QuoteID = ? AND UserID = ?';
            const allfavourite = await conn.query(sql, [quoteId, userId]);

            conn.release();
            if(allfavourite.length == 0){
                return false;
            }else{
                return true
            }
        

            
        } catch (error) {
            console.error('Error in CheckIfQuoteInFavourite:', error);
          throw error;
        }
      },

      async searchQuote(query) {
        try {
            let conn = await pool.getConnection();

            const sql = `
                SELECT
    
                aq.QuoteText,
                aq.QuoteID,
                aq.CharacterID,
                c.CharName,
                a.TitleEnglish,
                a.TitleRomaji,
                a.TitleNative
                FROM
                    AnimeQuote aq
                JOIN
                    Character_Card c
                ON
                    aq.CharacterID = c.CharacterID
                JOIN
                    Anime a
                ON 
                aq.AnimeID = a.AnimeID
                WHERE
                    QuoteText LIKE ? OR
                    TitleEnglish LIKE ? OR
                    CharName LIKE ? OR
                    TitleRomaji LIKE ? OR
                    TitleNative LIKE ?
                ORDER BY aq.QuoteText`;
    
            const searchTerm = `%${query}%`;
    
            const rows = await conn.execute(sql, [searchTerm, searchTerm,searchTerm,searchTerm,searchTerm, query]);
            conn.release();
            return rows;
        } catch (error) {
            console.error('Error in searchQuote:', error);
            throw error;
        }
    },    
    
};
