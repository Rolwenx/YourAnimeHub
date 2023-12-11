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


    
            const charactersDetails = [];
            
            for (const row of charactersIdsResult) {
                const characterId = row.CharacterID;
    
                const [characterResult] = await conn.query(
                    'SELECT CharacterID, CharName, ImageURL FROM Character_Card WHERE CharacterID = ?',
                    [characterId]
                );

    
                charactersDetails.push(characterResult);
            }

    
            conn.release();
    
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
            

            
            // Combine values from mangaData and mangaData
            const values = [...Object.values(mangaData), mangaId];
    
            // Execute the query
            const result = await conn.execute(sql, values);
            
    
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



            conn.release();

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
    
            const quoteCount = result.count;
      
    
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

    async getAllAnimeInfoByID(animeID,type) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeID = ? AND AnimeFormat = ?";
            const rows = await conn.query(sql, [animeID, type]);

            conn.release();

            
            if (rows.length == 0) {

                return 'Nothing';
            } else {

                return rows
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
    

    async updateAnimeStatus(userId, animeId, status) {

        let conn = await pool.getConnection();

      
        // Check if a row exists for the given animeId and userId
        let checkSql = 'SELECT * FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
        let [rows] = await conn.execute(checkSql, [animeId, userId]);
      
        if (rows == null) {
          // If no row exists, insert a new row
          let insertSql = 'INSERT INTO View_Anime (AnimeID, UserID, AnimeStatus) VALUES (?, ?, ?)';
          await conn.execute(insertSql, [animeId, userId, status]);
        } else {
          // If a row exists, update the status
          let updateSql = 'UPDATE View_Anime SET AnimeStatus = ? WHERE AnimeID = ? AND UserID = ?';
          await conn.execute(updateSql, [status, animeId, userId]);
        }
      
        conn.release();
      
        return true;
      },

      async getAnimeStatus(userId, animeId) {
        let conn = await pool.getConnection();
    
        let sql = 'SELECT AnimeStatus FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
        let rows = await conn.execute(sql, [animeId, userId]);
    
        conn.release();
    
        return rows.length > 0 ? rows[0].AnimeStatus : null;
    },
    
    async editAnimeFromList(animeId, userId, animeData) {
        try {
            let conn = await pool.getConnection();
            
            // Check if a row exists for the given animeId and userId
        let checkSql = 'SELECT * FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
        let [rows] = await conn.execute(checkSql, [animeId, userId]);
      
        if (rows == null) {
            
          // If no row exists, insert a new row
          const keys = ['AnimeID', 'UserID', ...Object.keys(animeData)];
          const values = [animeId, userId, ...Object.values(animeData)]; 

          // Construct the SQL query with named placeholders
          const placeholders = keys.map(key => `${key} = ?`).join(', ');
          const sql = `INSERT INTO View_Anime SET ${placeholders}`;

          const result = await conn.execute(sql, values);

            conn.release();
            console.log(result);
    
            return result;
        } else {
            
            // Construct the SQL query with named placeholders for animeData
            const placeholders = Object.keys(animeData).map(key => `${key} = ?`).join(', ');
            const sql = `UPDATE View_Anime SET ${placeholders} WHERE AnimeID = ? AND UserID = ?`;
            
            
            // Combine values from animeData and animeId
            const values = [...Object.values(animeData), animeId, userId];
    
            // Execute the query
            const result = await conn.execute(sql, values);
        
    
            conn.release();
    
            return result;
          
        }
        } catch (err) {
            console.error('Error in editAnimeFromList:', err);
            throw err;
        }
    },

    async getUserAnime(animeId,userId) {
        try {

            let conn = await pool.getConnection();

                // Check if a row exists for the given animeId and userId
            let checkSql = 'SELECT * FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
            let [rows] = await conn.execute(checkSql, [animeId, userId]);
      

            let newList = [];
            if (rows == null) {
                return null;
            }else{
                let sql = "SELECT * FROM View_Anime WHERE AnimeID = ? AND UserID = ?";
                const [rows, fields] = await conn.execute(sql, [animeId,userId]);
                conn.release();
                console.log(rows);
    
                rows.StartDate = await this.formatDate(rows.StartDate);
                rows.EndDate = await this.formatDate(rows.EndDate);
    
                if (rows != null) {
                    return rows;
                } else {
                    return false;
                }
            }


        } catch (err) {
            console.error('Error in getOneAnime:', err);
            throw err;
        }
    },

    async getAllStatusAnime(status) {
        let conn = await pool.getConnection();
    
        let sql = 'SELECT COUNT(*) AS statusCount FROM View_Anime WHERE AnimeStatus = ?';
        let number_of_rows = await conn.execute(sql, [status]);
    
        conn.release();
    
        return number_of_rows;
    },

};
