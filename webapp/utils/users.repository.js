pool = require("../utils/db.js");
const util = require('util');
const animeRepo = require('../utils/anime.repository.js');
const bcrypt = require('bcrypt');
// Promisify the bcrypt.compare function
const compareAsync = util.promisify(bcrypt.compare);

module.exports = {

  async getAllUsers() {
    try {
        let conn = await pool.getConnection();
        let sql = "SELECT UserID,Username,Email,FirstName, LastName, ProfilePictureURL, UserRole, Birthday, Bio FROM User_Profile";

        // Ensure rows is an array
        const userList = await conn.query(sql);
        conn.release();


        return userList;
    } catch (err) {
        console.log(err);
        throw err;
    }
},


  async getOneUser(username) {
    try {
      let conn = await pool.getConnection();
      let sql = "SELECT UserID,Username,Email,FirstName, LastName, ProfilePictureURL, UserRole, Birthday, Bio FROM User_Profile WHERE Username = ? "; 
      // must leave out the password+hash
      const [rows, fields] = await conn.execute(sql, [ username ]);
      conn.release();
      if (rows && rows.Birthday !== undefined) {
        rows.Birthday = await this.formatDate(rows.Birthday);
      }
      
    

      if (rows != null) {
        return rows; 
      } else {
        return false;
      }
    } catch (err) {
      console.error('Error in getOneUser:', err);
      throw err;
    }
  },

  async delOneUser(userId) {
    try {
        let conn = await pool.getConnection();

       // Delete rows related to the userId in User_Favorite_Character
       await conn.execute('DELETE FROM User_Favorite_Character WHERE UserID = ?', [userId]);

       // Delete rows related to the userId in User_Favorite_Anime
       await conn.execute('DELETE FROM User_Favorite_Anime WHERE UserID = ?', [userId]);

       // Delete rows related to the userId in User_Favorite_Quote
       await conn.execute('DELETE FROM User_Favorite_Quote WHERE UserID = ?', [userId]);

        // Set all attributes related to the userId to null in View_Anime except specific ones
        await conn.execute(`
            UPDATE View_Anime
            SET
                RateGrade = NULL,
                EpisodeProgress = NULL,
                AnimeStatus = NULL,
                TotalRewatch = NULL,
                ChaptersRead = NULL,
                VolumeProgress = NULL,
                StartDate = NULL,
                EndDate = NULL,
                Notes = NULL,
                hasLiked = NULL
            WHERE UserID = ?`,
            [userId]
        );

        // Delete the row of the user in User_Profile
        await conn.execute('DELETE FROM User_Profile WHERE UserID = ?', [userId]);

        conn.release();
        console.log(`User with ID ${userId} and associated data deleted successfully.`);

    } catch (err) {
        console.log(err);
        throw err;
    }
},    

  async getOneUserByID(userId) {
    try {
      
      let conn = await pool.getConnection();
      let sql = "SELECT Username,Email,FirstName, LastName, ProfilePictureURL, UserRole, Birthday, Bio FROM User_Profile WHERE UserID = ? "; 
      // must leave out the password+hash
      const [rows, fields] = await conn.execute(sql, [ userId ]);
      conn.release();

      if (rows && rows.Birthday !== undefined) {
        rows.Birthday = await this.formatDate(rows.Birthday);
      }
      
    

      if (rows != null) {
        return rows; 
      } else {
        return false;
      }
    } catch (err) {
      console.error('Error in getOneUserByID:', err);
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

  async isUsernameValid(username) {
    try {
      let conn = await pool.getConnection();
  
      let sql = "SELECT * FROM User_Profile WHERE Username = ?";
      const [rows, fields] = await conn.execute(sql, [username]);
      conn.release();
  
      // Check if the query returned any rows
      return rows != null;
    } catch (err) {
      console.error('Error in isUsernameValid:', err);
      throw err;
    }
  },
  
  
  async areValidCredentials(username, userEnteredPassword) {
    try {
        let conn = await pool.getConnection();

        let sql = "SELECT * FROM User_Profile WHERE Username = ?";
        const [rows, fields] = await conn.execute(sql, [username]);
        conn.release();

        if (rows != null) {
            const hashedPasswordFromDatabase = rows.UserPassword;

            const isMatch = await compareAsync(userEnteredPassword, hashedPasswordFromDatabase);

            if (isMatch) {
                return "True";
            } else {
                return "False";
            }
        }
    } catch (err) {
        console.error('Error in areValidCredentials:', err);
        throw err;
    }
},

  async updatePassword(userId, newPassword) {
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the hashed password in the database
      let conn = await pool.getConnection();
      let sql = 'UPDATE User_Profile SET UserPassword = ? WHERE UserID = ?';
      await conn.execute(sql, [hashedPassword, userId]);
      conn.release();

      return true; 
    } catch (error) {
      console.error('Error in updatePassword:', error);
      throw error;
    }
  },

   async createUser(userData) {
    try {

      let conn = await pool.getConnection();
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.UserPassword, 10);
      // Check if a user has same username
      const existingUsername = await conn.query(
        'SELECT * FROM User_Profile WHERE Username = ?',
        [userData.username]
      );

      if (existingUsername.length > 0) {
          // User with same username already exists
          return null; 
      }

      // Check if a user has same email
      const existingEmail = await conn.query(
        'SELECT * FROM User_Profile WHERE Email = ?',
        [userData.Email]
      );

      if (existingEmail.length > 0) {
          // User with same email already exists
          return null; 
      }

      userData.UserPassword = hashedPassword;
      const keys = Object.keys(userData);
      const values = Object.values(userData);

  
      // Construct the SQL query with named placeholders
      const placeholders = keys.map(key => `${key} = ?`).join(', ');
      const sql = `INSERT INTO User_Profile SET ${placeholders}`;

      // Execute the query
      const result = await conn.execute(sql, values);
      const okPacket = result; // No need for destructuring
      conn.release();
      return okPacket.insertId;
  
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async editOneUser(userId, userData) {
    try {
        let conn = await pool.getConnection();
        
        const placeholders = Object.keys(userData).map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE User_Profile SET ${placeholders} WHERE UserID = ?`;
        
        
        const values = [...Object.values(userData), userId];

        const result = await conn.execute(sql, values);
    

        conn.release();

        return result;
    } catch (err) {
        console.error('Error in editOneAnime:', err);
        throw err;
    }
},


async getAllAnimeForWatchlist(userId, action) {
  try {
    let conn = await pool.getConnection();
    let sql = "SELECT * FROM View_Anime WHERE UserID = ? AND AnimeStatus = ?";
    let rows = await conn.execute(sql, [userId, action]);

    if (rows && rows.length === 0) {
      conn.release();
      return null;
    } else {
      let MangaList = [];

      for (let i = 0; i < rows.length; i++) {
        const animeInfo = await animeRepo.getOneAnime(rows[i].AnimeID);

        if (animeInfo === false) {
          continue;
        }
        const combinedInfo = {
          ...rows[i],
          ...animeInfo,
        };
        MangaList.push(combinedInfo);
      }

      conn.release();
      return MangaList;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
},


async getAllMangaForWatchlist(userId, action) {
  try {
    let conn = await pool.getConnection();
    let sql = "SELECT * FROM View_Anime WHERE UserID = ? AND AnimeStatus = ?";
    let rows = await conn.execute(sql, [userId, action]);

    if (rows && rows.length === 0) {
      conn.release();
      return null;
    } else {
      let MangaList = [];

      for (let i = 0; i < rows.length; i++) {
        const animeInfo = await animeRepo.getOneManga(rows[i].AnimeID);

        if (animeInfo === false) {
          continue;
        }

        const combinedInfo = {
          ...rows[i],
          ...animeInfo,
        };

        MangaList.push(combinedInfo);
      }

      conn.release();
      return MangaList;
    }
  } catch (err) {
    console.error(err);
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

// This function is used to get the username of a user based on its id
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

}; 