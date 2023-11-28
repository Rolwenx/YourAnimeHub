pool = require("../utils/db.js");
const util = require('util');
const bcrypt = require('bcrypt');
// Promisify the bcrypt.compare function
const compareAsync = util.promisify(bcrypt.compare);

module.exports = {

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

  
  async areValidCredentials(username, userEnteredPassword) {
    try {
        let conn = await pool.getConnection();
        console.log("Entering areValidCredentials");
        console.log(username);
        console.log(userEnteredPassword);

        let sql = "SELECT * FROM User_Profile WHERE Username = ?";
        const [rows, fields] = await conn.execute(sql, [username]);
        conn.release();
        console.log(rows);

        if (rows != null) {
            console.log("Entering");
            // Hashed password retrieved from the database
            const hashedPasswordFromDatabase = rows.UserPassword;

            // Use the promisified bcrypt.compare function
            const isMatch = await compareAsync(userEnteredPassword, hashedPasswordFromDatabase);

            if (isMatch) {
                console.log('Password match! hey');
                return true;
            } else {
                console.log('Password does not match!');
                return false;
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
  }

}; 