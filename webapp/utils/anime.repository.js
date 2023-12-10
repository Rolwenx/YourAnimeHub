// anime.repository.js

pool = require("../utils/db.js");

module.exports = {
    async getCharactersByAnimeID(animeId) {
        try {
            let conn = await pool.getConnection();
    
            // We get character IDs related to the current Anime 
            const charactersIdsResult = await conn.query(
                'SELECT CharacterID FROM Appear_In WHERE AnimeID = ?',
                [animeId]
            );

            console.log(charactersIdsResult);

    
            const charactersDetails = [];
            
            for (const row of charactersIdsResult) {
                const characterId = row.CharacterID;
                console.log(characterId);
    
                const [characterResult] = await conn.query(
                    'SELECT CharacterID, CharName, ImageURL FROM Character_Card WHERE CharacterID = ?',
                    [characterId]
                );

    
                charactersDetails.push(characterResult); // Assuming there's only one character for each ID
                console.log(charactersDetails);
            }

    
            conn.release();
            console.log(charactersDetails);
    
            return charactersDetails;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },    
    
    async getAllAnime() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeFormat = 'Anime'";
    
            // Ensure rows is an array
            const animeList = await conn.query(sql);
            conn.release();
    
    
            return animeList;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getAllAnimeManga() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime";
    
            // Ensure rows is an array
            const animeMangaList = await conn.query(sql);
            conn.release();
    
    
            return animeMangaList;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    
    async getAllMangas() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeFormat = 'Manga'";
    
            // Ensure rows is an array
            const mangaList = await conn.query(sql);
            conn.release();
    
    
            return mangaList;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },


    async editOneAnime(animeId, animeData) {
        try {
            let conn = await pool.getConnection();
            
            // Construct the SQL query with named placeholders for animeData
            const placeholders = Object.keys(animeData).map(key => `${key} = ?`).join(', ');
            const sql = `UPDATE Anime SET ${placeholders} WHERE AnimeID = ? AND AnimeFormat = 'Anime'`;
            
            
            // Combine values from animeData and animeId
            const values = [...Object.values(animeData), animeId];
    
            // Execute the query
            const result = await conn.execute(sql, values);
        
    
            conn.release();
    
            return result;
        } catch (err) {
            console.error('Error in editOneAnime:', err);
            throw err;
        }
    },
    

    async editOneManga(mangaId, mangaData) {
        try {
            let conn = await pool.getConnection();
            
            // Construct the SQL query with named placeholders for mangaData
            const placeholders = Object.keys(mangaData).map(key => `${key} = ?`).join(', ');
            const sql = `UPDATE Anime SET ${placeholders} WHERE AnimeID = ? AND AnimeFormat = 'Manga'`;
            
            // Log the SQL query and values
            console.log("SQL Query:", sql);
            
            // Combine values from mangaData and mangaData
            const values = [...Object.values(mangaData), mangaId];
            console.log("SQL Values:", values);
    
            // Execute the query
            const result = await conn.execute(sql, values);
            
            // Log the result
            console.log("Result:", result);
    
            conn.release();
    
            return result;
        } catch (err) {
            console.error('Error in editOneAnime:', err);
            throw err;
        }
    },


    async addOneAnime(animeData) {
        
        try {
            let conn = await pool.getConnection();

        
            // Check if an anime with the same Name and AnimeFormat already exists
            const existingAnime = await conn.query(
                'SELECT * FROM Anime WHERE TitleEnglish = ? AND AnimeFormat = ?',
                [animeData.TitleEnglish, animeData.AnimeFormat]
            );
        

            if (existingAnime.length > 0) {
                // Anime with the same Name and AnimeFormat already exists
        
                return null; 
            }
        
            
            const keys = Object.keys(animeData);
            const values = Object.values(animeData);
    
            // Construct the SQL query with named placeholders
            const placeholders = keys.map(key => `${key} = ?`).join(', ');
            const sql = `INSERT INTO Anime SET ${placeholders}`;
    
            // Execute the query
            const result = await conn.execute(sql, values);

            const okPacket = result; // No need for destructuring

            // Log the okPacket
            console.log("OkPacket:", okPacket);

            conn.release();
            console.log("INSERT " + okPacket.insertId.toString()); // or +okPacket.insertId to convert to a regular number

            return okPacket.insertId;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    },
    


    async delOneAnime(animeId) {
        try {
            let conn = await pool.getConnection();
    
            // Check if there are dependencies in the quotes table
            const [result] = await conn.execute("SELECT COUNT(*) AS count FROM AnimeQuote WHERE AnimeId = ?", [animeId]);
            console.log("result:",result);
            const quoteCount = result.count;
            console.log("quoteCount:",quoteCount);
    
            if (quoteCount > 0) {
                console.log("Anime has dependencies in the quotes table. Cannot delete.");
                return false;
            }
    
            let sql = "DELETE FROM Anime WHERE AnimeId = ?";
            const [okPacket, fields] = await conn.execute(sql, [animeId]);
            conn.release();
            return true;
    
        } catch (err) {
            console.log(err);
            throw err;
        }
    },    
    
    

    async formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    async getOneAnime(animeId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeID = ? AND AnimeFormat = 'Anime'";
            const [rows, fields] = await conn.execute(sql, [animeId]);
            conn.release();



            rows.ReleaseDate = await this.formatDate(rows.ReleaseDate);
            rows.EndDate = await this.formatDate(rows.EndDate);

            if (rows != null) {
                return rows;
            } else {
                console.log('Anime not found for animeId:', animeId);
                return false;
            }
        } catch (err) {
            console.error('Error in getOneAnime:', err);
            throw err;
        }
    },
    

    async getOneManga(mangaId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeID = ? AND AnimeFormat = 'Manga'";
            const [rows, fields] = await conn.execute(sql, [mangaId]);
            conn.release();
            console.log("mangaID",mangaId);
            console.log("rows",rows);
            console.log("end date",rows.EndDate);
            console.log("release date",rows.ReleaseDate);



            rows.ReleaseDate = await this.formatDate(rows.ReleaseDate);
            rows.EndDate = await this.formatDate(rows.EndDate);

            if (rows != null) {
                return rows;
            } else {
                console.log('Manga not found for animeId:', mangaId);
                return false;
            }
        } catch (err) {
            console.error('Error in getOneManga:', err);
            throw err;
        }
    },

    // FUNCTIONAL
    async getAnimeIdByName(titleEnglish) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT AnimeID FROM Anime WHERE TitleEnglish = ?";

        
            const [rows] = await conn.query(sql, [titleEnglish]);

            conn.release();
            
            if (rows && rows.AnimeID != null) {

                return rows.AnimeID;
            } else {

                return null;
            }
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },
    
    async getAnimeNameByID(animeID) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT TitleEnglish FROM Anime WHERE AnimeID = ?";

        
            const [rows] = await conn.query(sql, [animeID]);

    
            
            conn.release();
            
            if (rows && rows.TitleEnglish != null) {

                return rows.TitleEnglish;
            } else {

                return null;
            }
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },
    
    //nOT FUNCTIONAL
    async searchAnimeByTitle(searchTerm) {
        const query = `
            SELECT * 
            FROM Anime 
            WHERE TitleEnglish LIKE ? 
            LIMIT 10;`;
    
        const searchResults = await pool.query(query, [`%${searchTerm}%`]);
    
        return searchResults;
    },
    


};
