pool = require("../utils/db.js");
const util = require('util');
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

}; 