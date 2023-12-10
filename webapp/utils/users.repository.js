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
        let sql = "SELECT UserID,Username,Email,FirstName, LastName, ProfilePictureURL, TitleDisplayLanguage, UserRole, Birthday, Bio,AccountStatus FROM User_Profile";

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
      let sql = "SELECT UserID,Username,Email,FirstName, LastName, ProfilePictureURL, TitleDisplayLanguage, UserRole, Birthday, Bio,AccountStatus FROM User_Profile WHERE Username = ? "; 
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

  async getOneUserByID(userId) {
    try {
      
      console.log(userId);
      let conn = await pool.getConnection();
      let sql = "SELECT Username,Email,FirstName, LastName, ProfilePictureURL, TitleDisplayLanguage, UserRole, Birthday, Bio,AccountStatus FROM User_Profile WHERE UserID = ? "; 
      // must leave out the password+hash
      const [rows, fields] = await conn.execute(sql, [ userId ]);
      console.log(rows);
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

            // Use the promisified bcrypt.compare function
            const isMatch = await compareAsync(userEnteredPassword, hashedPasswordFromDatabase);

            if (isMatch) {
                console.log('Password match! hey');
                return "True";
            } else {
                console.log('Password does not match!');
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

async getAllAnimeForWatchlist(userId, action,type) {
  try {
    let conn = await pool.getConnection();
    let sql = "SELECT * FROM View_Anime WHERE UserID = ? AND AnimeStatus = ?";
    let rows = await conn.execute(sql, [userId, action]);


    let newList = [];
    for (let i = 0; i < rows.length; i++) {
      const animeInfo = await animeRepo.getAllAnimeInfoByID(rows[i].AnimeID,type);
      if(animeInfo == 'Nothing'){
        break;
      }
      // Combine the information from rows and animeInfo
      const combinedInfo = { ...rows[i], ...animeInfo };

      // Push the combinedInfo into the newList array
      newList.push(combinedInfo);
    }

    conn.release();
    return newList;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


}; 