// anime.repository.js

pool = require("../utils/db.js");
const userRepo = require('../utils/users.repository.js');
const animeRepo = require('../utils/anime.repository.js');

module.exports = {

  async editOneReview(reviewData, userId, animeId) {
    try {
        let conn = await pool.getConnection();
        
        const placeholders = Object.keys(reviewData).map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE View_Anime SET ${placeholders} WHERE AnimeID = ? AND UserID = ? `;
        
        
        const values = [...Object.values(reviewData), animeId,userId];

        // Execute the query
        const result = await conn.execute(sql, values);
    

        conn.release();

        return result;
    } catch (err) {
        console.error('Error in editOneReview:', err);
        throw err;
    }
},

  // This function is used when adding a review
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


// This function is used to update the status of the anime whenever the user changes it
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


      // This function is used to get the animeStatus of an anime
      async getAnimeStatus(userId, animeId) {
        let conn = await pool.getConnection();
    
        let sql = 'SELECT AnimeStatus FROM View_Anime WHERE AnimeID = ? AND UserID = ?';
        let rows = await conn.execute(sql, [animeId, userId]);
    
        conn.release();
    
        return rows.length > 0 ? rows[0].AnimeStatus : null;
    },
    

    // This function is used when the user edits information about an anime (information of him)
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

    // This function gets the information about who did a review on the anime whose animeId is given in parameter
    async getInformationOfUserWhoDidAReview(animeId) {
      try {
        let conn = await pool.getConnection();
    
        // Check if a row exists for the given animeId and userId
        let sql = 'SELECT * FROM View_Anime WHERE AnimeID = ? AND ReviewID IS NOT NULL';
        const rows = await conn.execute(sql, [animeId]);
        conn.release();


         if (rows.length > 0) {
          return rows;
        } else {
          return null;
        }
      } catch (err) {
        console.error('Error in getInformationOfUserWhoDidAReview:', err);
        throw err;
      }
    },
    
    // This function is used to check if a user did a review
    async CheckIfUserDidAReview(animeId,userId) {
      try {
        let conn = await pool.getConnection();
    
        // Check if a row exists for the given animeId and userId
        let sql = 'SELECT * FROM View_Anime WHERE AnimeID = ? AND ReviewID IS NOT NULL and UserID = ?';
        const rows = await conn.execute(sql, [animeId,userId]);
        conn.release();



         if (rows.length > 0) {
          return rows;
        } else {
          return null;
        }
      } catch (err) {
        console.error('Error in CheckIfUserDidAReview:', err);
        throw err;
      }
    },
    
    // This function is used to get the information of all users who did a review about an anime
    async getUserIdOfPeopleWhoDidAReview(animeId) {
      try {
        const conn = await pool.getConnection();
    
        const sql = 'SELECT UserID FROM View_Anime WHERE ReviewID IS NOT NULL AND AnimeID = ?';
        const rows = await conn.query(sql, [animeId]);
    
        if (rows && rows.length === 0) {
    
          conn.release();
          return null;
        } else {
          const UsernamesWhoDidReviews = [];
    
          // Convert the object into an array
          const rowsArray = Object.values(rows);
          for (const row of rowsArray) {
            const userId = row.UserID;
            const username = await userRepo.GetUsernameById(userId);
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
    

    // Function that allow to the take information of the View_Anime Table according to the user and the anime
    async getUserViewAnimeInfo(animeId,userId) {
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

    // This function is used to get the number of people who have a specific anime status in their watchlist
    async getAllStatusAnime(status) {
        let conn = await pool.getConnection();
    
        let sql = 'SELECT COUNT(*) AS statusCount FROM View_Anime WHERE AnimeStatus = ?';
        let number_of_rows = await conn.execute(sql, [status]);
    
        conn.release();
    
        return number_of_rows;
    },


    
      async getAnimeIDFromReviewID(reviewId) {
        try {
          const conn = await pool.getConnection();
      
          const sql = 'SELECT AnimeID,UserID FROM View_Anime WHERE ReviewID = ?';
          const [rows] = await conn.execute(sql, [reviewId]);
          console.log(rows);
      

            conn.release();

            return rows;
        } catch (error) {
          console.error('Error in getAnimeIDFromReviewID:', error);
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
                const userName = await userRepo.GetUsernameById(userId);
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
              Username: await userRepo.GetUsernameById(userId),
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
        const conn = await pool.getConnection();
        const sql = "SELECT * FROM View_Anime WHERE ReviewID IS NOT NULL";
    
        try {
            const reviewList = await conn.query(sql);
    
            conn.release();
    
            if (!reviewList.length) {
                // Handle the case where no reviews were found
                return [];
            }
    
            const updatedReviewList = await Promise.all(reviewList.map(async (review) => {
                const animeName = await animeRepo.getAnimeNameByID(review.AnimeID);
                const UserName = await userRepo.GetUsernameById(review.UserID);
                const backgroundURL = await animeRepo.getAnimeURLByID(review.AnimeID);
    
                return {
                    ...review,
                    AnimeName: animeName,
                    Username: UserName,
                    BackgroundImageURL: backgroundURL,
                };
            }));
    
            return updatedReviewList;
        } catch (error) {
            console.error("Error retrieving reviews:", error);
            // Handle the error appropriately
            return [];
        }
    },

    async getAllReviewsOfUser(userId) {
      const conn = await pool.getConnection();
      const sql = "SELECT * FROM View_Anime WHERE ReviewID IS NOT NULL AND UserId = ?";
    
      try {
        const reviewList = await conn.query(sql, [userId]);
        console.log(reviewList)
    
        conn.release();
    
        if (!reviewList.length) {
          // Handle the case where no reviews were found
          return [];
        }
    
        const updatedReviewList = await Promise.all(reviewList.map(async (review) => {
          const animeName = await animeRepo.getAnimeNameByID(review.AnimeID);
          const UserName = await userRepo.GetUsernameById(review.UserID);
          const backgroundURL = await animeRepo.getAnimeURLByID(review.AnimeID);
    
          return {
            ...review,
            AnimeName: animeName,
            Username: UserName,
            BackgroundImageURL: backgroundURL,
          };
        }));
    
        return updatedReviewList;
      } catch (error) {
        console.error("Error retrieving reviews:", error);
        // Handle the error appropriately
        return [];
      }
    },
    

    async delOneReview(animeId, userId) {
      try {
          let conn = await pool.getConnection();

          
  
          let updateSql = 'UPDATE View_Anime SET ReviewID = NULL, ReviewDate = NULL,ReviewText = NULL,ReviewSummary = NULL,ReviewGrade = NULL,LikesOnReview = NULL,DislikesOnReview = NULL WHERE AnimeID = ? AND UserID = ?;';
          await conn.execute(updateSql, [ animeId, userId]);

          conn.release();
          return true;
  
      } catch (err) {
          console.log(err);
          throw err;
      }
  },    
    

    
      
};
