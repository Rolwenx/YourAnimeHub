// anime.repository.js

pool = require("../utils/db.js");

module.exports = {

    async getAllChaptersRead(userId) {
        const conn = await pool.getConnection();

        const sql = "SELECT SUM(ChaptersRead) AS TotalChaptersRead FROM View_Anime WHERE UserID = ? AND ChaptersRead IS NOT NULL";
      
        try {
          const chaptersListnbr = await conn.query(sql, [userId]);
      
          conn.release();
      
          if (chaptersListnbr[0].TotalChaptersRead == null) {
            return 0;
          }
          return chaptersListnbr[0].TotalChaptersRead;
        } catch (error) {
          console.error("Error retrieving anime:", error);
          // Handle the error appropriately
          return [];
        }
      },

    async getAllAnimeInWatchlist(userId,animeormanga) {
        const conn = await pool.getConnection();
        const sql = "SELECT va.*, a.AnimeFormat FROM View_Anime va JOIN Anime a ON va.AnimeID = a.AnimeID WHERE va.AnimeStatus IS NOT NULL AND va.UserID = ? AND a.AnimeFormat = ?";
      
        try {
          const animeList = await conn.query(sql, [userId, animeormanga]);
      
          conn.release();

      
          return animeList.length;
        } catch (error) {
          console.error("Error retrieving anime:", error);
          // Handle the error appropriately
          return [];
        }
      },

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
                console.log('Manga not found for mangaId:', mangaId);
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

    async getAnimeTypeByID(animeID) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT AnimeFormat FROM Anime WHERE AnimeID = ?";

        
            const [rows] = await conn.query(sql, [animeID]);

    
            
            conn.release();
            
            if (rows && rows.AnimeFormat != null) {

                return rows.AnimeFormat;
            } else {

                return null;
            }
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },
    async getAnimeURLByID(animeID) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT BackgroundImageURL FROM Anime WHERE AnimeID = ?";

        
            const [rows] = await conn.query(sql, [animeID]);

    
            
            conn.release();
            
            if (rows && rows.BackgroundImageURL != null) {

                return rows.BackgroundImageURL;
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
    
                rows.StartDate = await this.formatDate(rows.StartDate);
                rows.EndDate = await this.formatDate(rows.EndDate);
    
                if (rows != null) {
                    return rows;
                } else {
                    return false;
                }
            }


        } catch (err) {
            console.error('Error in getUserAnime:', err);
            throw err;
        }
    },

    async getAllStatusAnime(status,animeId) {
        let conn = await pool.getConnection();
    
        let sql = 'SELECT COUNT(*) AS statusCount FROM View_Anime WHERE AnimeStatus = ? AND AnimeID = ?';
        let number_of_rows = await conn.execute(sql, [status,animeId]);
    
        conn.release();
    
        return number_of_rows;
    },

    async GetUsernameById(userId) {
        try {
          let conn = await pool.getConnection();
          let sql = "SELECT Username FROM User_Profile WHERE UserID = ?";
          const [rows] = await conn.execute(sql, [userId]);
          conn.release();
    
          if (rows!=null) {
            return rows.Username;
          } else {
            return null; // No user found with the given userId
          }
        } catch (err) {
          console.error('Error in GetUsernameById:', err);
          throw err;
        }
      },
    async getAllReviewsByAnimeId(animeId) {
        try {
          const conn = await pool.getConnection();
      
          const sql = 'SELECT UserID FROM View_Anime WHERE AnimeID = ?';
          const [rows] = await conn.execute(sql, [animeId]);

          if(rows == null){
            return null;
          }
          else{
            const UsernamesWhoDidReviews = [];

            // Convert the object into an array
            const rowsArray = Object.values(rows);

            for (const row of rowsArray) {
                const userId = row;

                const username = await this.GetUsernameById(userId); 
                UsernamesWhoDidReviews.push({ ...row, UserName: username });
            }

            conn.release();
            return UsernamesWhoDidReviews;
          }
      

        } catch (error) {
          console.error('Error in getAllReviewsByAnimeId:', error);
          throw error;
        }
      },

      async getReviewID(animeId, userId) {
        try {
          const conn = await pool.getConnection();
      
          const sql = 'SELECT ReviewID FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
          const [rows] = await conn.execute(sql, [animeId,userId]);
      

            conn.release();

            return rows;
        } catch (error) {
          console.error('Error in getAllReviewsByAnimeId:', error);
          throw error;
        }
      },
      async getReviewInfo(animeId, userId) {
        try {
          const conn = await pool.getConnection();
      
          const sql = 'SELECT ReviewID, ReviewText, ReviewSummary, ReviewGrade FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
          const [rows] = await conn.execute(sql, [animeId, userId]);
      
          const updatedRowsList = Array.isArray(rows)
            ? await Promise.all(rows.map(async (row) => {
                const animeName = await this.getAnimeNameByID(animeId);
                const userName = await this.GetUsernameById(userId);
                const backgroundURL = await this.getAnimeURLByID(animeId);
                const anime = animeId;

      
                return {
                  ...row,
                  AnimeName: animeName,
                  AnimeID: anime,
                  Username: userName,
                  BackgroundImageURL: backgroundURL,
                };
              }))
            : await Promise.all([{
              ...rows,
              AnimeName: await this.getAnimeNameByID(animeId),
              Username: await this.GetUsernameById(userId),
              BackgroundImageURL: await this.getAnimeURLByID(animeId),
              TypeFormat: await this.getAnimeTypeByID(animeId),
              AnimeID: animeId,
            }]);

            conn.release();
      
          return updatedRowsList;
      
        } catch (error) {
          console.error('Error in getReviewInfo:', error);
          throw error;
        }
      },      


      async getAllReviews() {
        let conn = await pool.getConnection();
            let sql = "SELECT * FROM View_Anime";
    
            // Ensure rows is an array
            const reviewList = await conn.query(sql);

            conn.release();

            const updatedReviewList = await Promise.all(reviewList.map(async (review) => {
                const animeName = await this.getAnimeNameByID(review.AnimeID);
                const UserName = await this.GetUsernameById(review.UserID);
                const backgroundURL = await this.getAnimeURLByID(review.AnimeID);
    
                return {
                    ...review,
                    AnimeName: animeName,
                    Username: UserName,
                    BackgroundImageURL: backgroundURL,
                };
            }));
    
            return updatedReviewList;

      },

    
      async getAllAnimeWatchedByUser(userId, status,animeormanga) {
        const conn = await pool.getConnection();
        const sql = "SELECT va.*, a.AnimeFormat FROM View_Anime va JOIN Anime a ON va.AnimeID = a.AnimeID WHERE va.UserID = ? AND va.AnimeStatus = ? AND a.AnimeFormat = ?";

      
        try {
          const animeList = await conn.query(sql, [userId, status, animeormanga]);
      
          conn.release();
      
          if (!animeList.length) {
            // Handle the case where no anime completed were found
            return [];
          }
      
          return animeList;
        } catch (error) {
          console.error("Error retrieving anime:", error);
          // Handle the error appropriately
          return [];
        }
      },

      async getAllFavouriteAnime(userId,type){

        try {
            const conn = await pool.getConnection();
            // FA : UserID, AnimeID
            // A : TitleEnglish, CoverImageURL, BackgroundImageURL, EpisodeCount, TypeFormat, Likes
            const sql = "SELECT fa.*, a.TitleEnglish,a.CoverImageURL,a.BackgroundImageURL,a.EpisodeCount,a.TypeFormat,a.Likes, a.Chapters,a.Volumes FROM User_Favorite_Anime fa JOIN Anime a ON fa.AnimeID = a.AnimeID WHERE a.AnimeFormat = ? AND fa.UserID = ?";

            const animeList = await conn.query(sql, [type, userId]);
            conn.release();

            if (!animeList.length) {
                return [];
              }

              return animeList;
            
        } catch (error) {
            console.error('Error in addAnimeToFavourite:', error);
          throw error;
        }
      },

      async getHowMuchAnimeHasBeenFavourited(animeID){

        try {
            const conn = await pool.getConnection();
            const sql = "SELECT COUNT(AnimeID) AS FavoritesCount FROM User_Favorite_Anime WHERE AnimeID = ?";

            const number = await conn.query(sql, [ animeID]);
            conn.release();

            return number[0].FavoritesCount;
            
        } catch (error) {
            console.error('Error in getHowMuchAnimeHasBeenFavourited:', error);
          throw error;
        }
      },
      

      async AddAnimeAsFavourite(userId, animeId){

        try {
            const conn = await pool.getConnection();
            let insertSql = 'INSERT INTO User_Favorite_Anime (AnimeID, UserID) VALUES (?, ?)';
            await conn.execute(insertSql, [animeId, userId]);

            conn.release();

            
        } catch (error) {
            console.error('Error in addAnimeToFavourite:', error);
          throw error;
        }
      },

      async RemoveAnimeAsFavourite(userId, animeId){

        try {
            const conn = await pool.getConnection();
            let deleteSql = 'DELETE FROM User_Favorite_Anime WHERE AnimeID = ? AND UserID = ?';
            await conn.execute(deleteSql, [animeId, userId]);
        
            conn.release();

            
        } catch (error) {
            console.error('Error in RemoveAnimeAsFavourite:', error);
          throw error;
        }
      },

      async CheckIfAnimeInFavourite(userId, animeId){

        try {
            const conn = await pool.getConnection();
            let sql = 'SELECT * FROM User_Favorite_Anime WHERE AnimeID = ? AND UserID = ?';
            const allfavourite = await conn.query(sql, [animeId, userId]);

            conn.release();
            if(allfavourite.length == 0){
                return false;
            }else{
                return true
            }
        

            
        } catch (error) {
            console.error('Error in RemoveAnimeAsFavourite:', error);
          throw error;
        }
      },

      async RemoveAnimeFromWatchlist(userId, animeId){

        try {
            const conn = await pool.getConnection();

            let updateSql = 'UPDATE View_Anime SET AnimeStatus = NULL WHERE AnimeID = ? AND UserID = ?';
            await conn.execute(updateSql, [animeId, userId]);
        
            conn.release();

            
        } catch (error) {
            console.error('Error in RemoveAnimeFromWatchlist:', error);
          throw error;
        }
      },

      async LikeAnAnime(animeId,userId){

        try {
            const conn = await pool.getConnection();

            let updateSql = 'UPDATE Anime SET Likes = Likes + 1 WHERE AnimeID = ?';
            await conn.execute(updateSql, [animeId]);
        

            let updateSql2 = 'UPDATE View_Anime SET hasLiked = 1 WHERE AnimeID = ? AND UserID = ?';
            await conn.execute(updateSql2, [animeId, userId]);
            conn.release();


            
        } catch (error) {
            console.error('Error in LikeAnAnime:', error);
          throw error;
        }
      },
      

      async RemoveLikeAnAnime(animeId,userId){

        try {
            const conn = await pool.getConnection();

            let updateSql = 'UPDATE Anime SET Likes = Likes - 1 WHERE AnimeID = ?';
            await conn.execute(updateSql, [animeId]);
        

            let updateSql2 = 'UPDATE View_Anime SET hasLiked = 0 WHERE AnimeID = ? AND UserID = ?';
            await conn.execute(updateSql2, [animeId, userId]);
            conn.release();


            
        } catch (error) {
            console.error('Error in RemoveLikeAnAnime:', error);
          throw error;
        }
      },


      async CheckIfUserHasLikedAnime(userId, animeId) {

        let conn = await pool.getConnection();
      
        // Check if a row exists for the given animeId and userId
        let checkSql = 'SELECT * FROM View_Anime WHERE AnimeID = ? AND UserID = ? AND hasLiked = 1';
        let rows = await conn.execute(checkSql, [animeId, userId]);

        let checkSql2 = 'SELECT * FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
        let rows2 = await conn.execute(checkSql2, [animeId, userId]);
      
    
        // This means that the user doesn't even have a row created, so he can't have liked so we create it.
        if (rows.length == 0 && rows2.length == 0) {
            let insertSql = 'INSERT INTO View_Anime (AnimeID, UserID, hasLiked) VALUES (?, ?, ?)';
            await conn.execute(insertSql, [animeId, userId, 0]);
            conn.release();
            return false;
          
        } 
        conn.release();
        // This means that the user does has a row created, but hasn't liked
        if (rows.length == 0 && rows2.length != 0) {
            // we return false since user hasn't liked
            return false;
        }
        // This means that the user has a row created and has liked
        if (rows.length != 0 && rows2.length != 0) {
            return true;
          
        } 
      
      
      },
      async  getMostFavourited(limit) {
        try {
          let conn = await pool.getConnection();
      
          let Sql = `
          SELECT
            A.AnimeID,
            A.TitleEnglish,
            A.Genre,
            A.AnimeStatus,
            A.CoverImageURL,
            A.BackgroundImageURL,
            A.AnimeFormat,
            A.TypeFormat,
            A.EpisodeCount,
            A.Chapters,
            A.Volumes,
            A.Likes,
            COUNT(UFA.UserID) AS FavoritesCount
          FROM
            Anime A
          LEFT JOIN
            User_Favorite_Anime UFA ON A.AnimeID = UFA.AnimeID
          GROUP BY
            A.AnimeID
          ORDER BY
            FavoritesCount DESC
          LIMIT ?`;
        
        let list = await conn.execute(Sql, [limit]);
        
      
          conn.release();
      
          return list;
        } catch (error) {
          console.error('Error in getMostFavouritedAnime:', error);
          throw error;
        }
      },      

      async  getMostFavouritedType(type,limit) {
        try {
          let conn = await pool.getConnection();
      
          let Sql = `
          SELECT
            A.AnimeID,
            A.TitleEnglish,
            A.Genre,
            A.AnimeStatus,
            A.CoverImageURL,
            A.BackgroundImageURL,
            A.AnimeFormat,
            A.TypeFormat,
            A.EpisodeCount,
            A.Chapters,
            A.Volumes,
            A.Likes,
            COUNT(UFA.UserID) AS FavoritesCount
          FROM
            Anime A
          LEFT JOIN
            User_Favorite_Anime UFA ON A.AnimeID = UFA.AnimeID
          WHERE A.AnimeFormat = ?
          GROUP BY
            A.AnimeID
          ORDER BY
            FavoritesCount DESC
          LIMIT ?`;
        
        let list = await conn.execute(Sql, [type,limit]);
        
      
          conn.release();
      
          return list;
        } catch (error) {
          console.error('Error in getMostFavourited:', error);
          throw error;
        }
      },      

      async  getMostLiked(limit) {
        try {
          let conn = await pool.getConnection();
      
          let Sql = `SELECT AnimeID, TitleEnglish,Likes,Genre,AnimeStatus,CoverImageURL,BackgroundImageURL,AnimeFormat,TypeFormat,EpisodeCount,Chapters,Volumes FROM Anime ORDER BY Likes DESC LIMIT ?`;
        
        let list = await conn.execute(Sql, [limit]);
        
      
          conn.release();
      
          return list;
        } catch (error) {
          console.error('Error in getMostFavouritedAnime:', error);
          throw error;
        }
      },      

      async  getMostLikedType(type,limit) {
        try {
          let conn = await pool.getConnection();
      
          let Sql = `SELECT AnimeID, TitleEnglish,Likes,Genre,AnimeStatus,CoverImageURL,BackgroundImageURL,AnimeFormat,TypeFormat,EpisodeCount,Chapters,Volumes FROM Anime WHERE AnimeFormat = ? ORDER BY Likes DESC LIMIT ?`;
        
        let list = await conn.execute(Sql, [type,limit]);
        
      
          conn.release();
      
          return list;
        } catch (error) {
          console.error('Error in getMostFavouritedAnime:', error);
          throw error;
        }
      },      

      async  getAverageEpisodeProgress(animeId) {
        try {
          let conn = await pool.getConnection();

          let Sql = `SELECT AnimeID, AVG(EpisodeProgress) AS AverageEpisodeProgress FROM View_Anime WHERE AnimeID = ? GROUP BY AnimeID`;
      
        let rows = await conn.execute(Sql, [animeId]);

          conn.release();
          if (rows[0] != null ) {
            return rows[0].AverageEpisodeProgress;
          } else {
            return 0; 
          }
      
        } catch (error) {
          console.error('Error in getAverageEpisodeProgress:', error);
          throw error;
        }
      },      

      async  getAverageChapterProgress(mangaId) {
        try {
          let conn = await pool.getConnection();

          let Sql = `SELECT AnimeID, AVG(ChaptersRead) AS ChaptersRead FROM View_Anime WHERE AnimeID = ? GROUP BY AnimeID`;
      
        let rows = await conn.execute(Sql, [mangaId]);

          conn.release();
          if (rows[0] != null ) {
            return rows[0].ChaptersRead;
          } else {
            return 0; 
          }
      
        } catch (error) {
          console.error('Error in getAverageChapterProgress:', error);
          throw error;
        }
      },      

      async  getAverageVolumeProgress(mangaId) {
        try {
          let conn = await pool.getConnection();

          let Sql = `SELECT AnimeID, AVG(VolumeProgress) AS VolumeProgress FROM View_Anime WHERE AnimeID = ? GROUP BY AnimeID`;
      
        let rows = await conn.execute(Sql, [mangaId]);

          conn.release();
          if (rows[0] != null ) {
            return rows[0].VolumeProgress;
          } else {
            return 0; 
          }
      
        } catch (error) {
          console.error('Error in getAverageVolumeProgress:', error);
          throw error;
        }
      },      
      

      async searchAnimeManga(query) {
        try {
            let conn = await pool.getConnection();
    
            const sql = `
                SELECT
                    AnimeID,
                    TitleEnglish,
                    TitleRomaji,
                    TitleNative,
                    AnimeStatus,
                    TypeFormat,
                    Chapters,
                    EpisodeCount,
                    Volumes,
                    CoverImageURL,
                    Genre,
                    AnimeFormat
                FROM
                    Anime
                WHERE
                    TitleEnglish LIKE ? OR
                    TitleRomaji LIKE ? OR
                    TitleNative LIKE ? OR
                    AnimeStatus LIKE ? OR
                    TypeFormat LIKE ? OR
                    Genre LIKE ?
                ORDER BY TitleEnglish`;
    
            const searchTerm = `%${query}%`;
    
            const rows = await conn.execute(sql, [searchTerm, searchTerm, searchTerm,searchTerm,searchTerm,searchTerm, query]);
            conn.release();
            return rows;
        } catch (error) {
            console.error('Error in searchAnimeManga:', error);
            throw error;
        }
    },    

    async searchAnime(query,type) {
      try {
          let conn = await pool.getConnection();
  
          const sql = `
              SELECT
              AnimeID,
              TitleEnglish,
              Likes,
              Genre,
              AnimeStatus,
              AnimeFormat,
              TitleRomaji,
              Chapters,
              EpisodeCount,
              Volumes,
              TitleNative,
              TypeFormat,
              CoverImageURL
              FROM
                  Anime
              WHERE
              AnimeFormat = ?
              AND (TitleEnglish LIKE ? OR
                   TitleRomaji LIKE ? OR
                   TitleNative LIKE ? OR
                   AnimeStatus LIKE ? OR
                    TypeFormat LIKE ? OR
                   Genre LIKE ?)
              ORDER BY TitleEnglish`;
  
          const searchTerm = `%${query}%`;
  
          const rows = await conn.execute(sql, [type,searchTerm,searchTerm,searchTerm, searchTerm, searchTerm, searchTerm,searchTerm, query]);
          conn.release();
          return rows;
      } catch (error) {
          console.error('Error in searchAnimeManga:', error);
          throw error;
      }
  },    

    async searchAnimeByMostLiked(query,type) {
      try {

        // The LIKE ? Checks if the mentioned attributes contains a matching pattern with the query
          let conn = await pool.getConnection();
          const sql = `
              SELECT
                  AnimeID,
                  TitleEnglish,
                  Likes,
                  Genre,
                  AnimeStatus,
                  Chapters,
                  EpisodeCount,
                  Volumes,
                  AnimeFormat,
                  TitleRomaji,
                  TitleNative,
                  TypeFormat,
                  CoverImageURL
              FROM
                  Anime
              WHERE
                  AnimeFormat = ?
                  AND (TitleEnglish LIKE ? OR
                       TitleRomaji LIKE ? OR
                       TitleNative LIKE ? OR
                       AnimeStatus LIKE ? OR
                    TypeFormat LIKE ? OR
                       Genre LIKE ?)
              ORDER BY Likes DESC, TitleEnglish`;  
          // Added "ORDER BY Likes DESC" to rank by most liked
  
          const searchTerm = `%${query}%`;
  
          const rows = await conn.execute(sql, [type,searchTerm, searchTerm, searchTerm,searchTerm, searchTerm, searchTerm]);
          conn.release();
          return rows;
      } catch (error) {
          console.error('Error in searchAnimeManga:', error);
          throw error;
      }
  },  
      

  async searchAnimeByMostFavourited(query,type) {
    try {

      // The LIKE ? Checks if the mentioned attributes contains a matching pattern with the query
        let conn = await pool.getConnection();
        const sql = `
            SELECT
                A.AnimeID,
                A.TitleEnglish,
                A.Likes,
                A.Genre,
                A.AnimeStatus,
                A.EpisodeCount,
                A.Chapters,
                A.Volumes,
                A.AnimeFormat,
                A.TitleRomaji,
                A.TitleNative,
                A.TypeFormat,
                A.CoverImageURL,
                COUNT(UFA.UserID) AS FavoritesCount
              FROM
                Anime A
              LEFT JOIN
                User_Favorite_Anime UFA ON A.AnimeID = UFA.AnimeID
              WHERE A.AnimeFormat = ?
              AND (TitleEnglish LIKE ? OR
                TitleRomaji LIKE ? OR
                TitleNative LIKE ? OR
                AnimeStatus LIKE ? OR
                    TypeFormat LIKE ? OR
                Genre LIKE ?)
              GROUP BY
                A.AnimeID
              ORDER BY
                FavoritesCount DESC`;

        
        // Added "ORDER BY Likes DESC" to rank by most liked

        const searchTerm = `%${query}%`;

        const rows = await conn.execute(sql, [type,searchTerm, searchTerm, searchTerm,searchTerm,searchTerm,searchTerm, searchTerm]);
        conn.release();

        return rows;
    } catch (error) {
        console.error('Error in searchAnimeManga:', error);
        throw error;
    }
},  
      
};
