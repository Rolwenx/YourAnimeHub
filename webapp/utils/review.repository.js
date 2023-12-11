// anime.repository.js

pool = require("../utils/db.js");
const userRepo = require('../utils/users.repository.js');
const animeRepo = require('../utils/anime.repository.js');

module.exports = {


async addOneReview(reviewData,userId,animeId) {
        
  try {
      let conn = await pool.getConnection();
      // Check if a row exists for the given animeId and userId
      let checkSql = 'SELECT * FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
      let [rows] = await conn.execute(checkSql, [animeId, userId]);

  
      if (rows == null) {
      
        // If no row exists, insert a new row
        const keys = ['AnimeID', 'UserID', ...Object.keys(reviewData)];
        const values = [animeId, userId, ...Object.values(reviewData)]; 
    
        // Construct the SQL query with named placeholders
        const placeholders = keys.map(key => `${key} = ?`).join(', ');
        const sql = `INSERT INTO View_Anime SET ${placeholders}`;
    
        const result = await conn.execute(sql, values);
    
          conn.release();
          console.log(result);
    
          return result;
      } else {
          
          // Construct the SQL query with named placeholders for reviewData
          const placeholders = Object.keys(reviewData).map(key => `${key} = ?`).join(', ');
          const sql = `UPDATE View_Anime SET ${placeholders} WHERE AnimeID = ? AND UserID = ?`;
          
          
          // Combine values from animeData and animeId
          const values = [...Object.values(reviewData), animeId, userId];
    
          // Execute the query
          const result = await conn.execute(sql, values);
      
    
          conn.release();
    
          return result;
        
      }
  } catch (err) {
      console.error("Error:", err);
      throw err;
  }
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

    // Function that allow to the take information of the View_Anime Table according to the user and the anime
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
    
                rows.StartDate = await animeRepo.formatDate(rows.StartDate);
                rows.EndDate = await animeRepo.formatDate(rows.EndDate);
    
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

                const username = await animeRepo.GetUsernameById(userId); 
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
      
          const sql = 'SELECT ReviewID, ReviewText, ReviewSummary, LikesOnReview, DislikesOnReview, ReviewGrade FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
          const [rows] = await conn.execute(sql, [animeId, userId]);
      
          const updatedRowsList = Array.isArray(rows)
            ? await Promise.all(rows.map(async (row) => {
                const animeName = await animeRepo.getAnimeNameByID(animeId);
                const userName = await animeRepo.GetUsernameById(userId);
                const backgroundURL = await animeRepo.getAnimeURLByID(animeId);
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
              AnimeName: await animeRepo.getAnimeNameByID(animeId),
              Username: await animeRepo.GetUsernameById(userId),
              BackgroundImageURL: await animeRepo.getAnimeURLByID(animeId),
              TypeFormat: await animeRepo.getAnimeTypeByID(animeId),
              AnimeID: animeId,
            }]);
      
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
                const animeName = await animeRepo.getAnimeNameByID(review.AnimeID);
                const UserName = await animeRepo.GetUsernameById(review.UserID);
                const backgroundURL = await animeRepo.getAnimeURLByID(review.AnimeID);
    
                return {
                    ...review,
                    AnimeName: animeName,
                    Username: UserName,
                    BackgroundImageURL: backgroundURL,
                };
            }));
    
            return updatedReviewList;

      },

    
      
};
