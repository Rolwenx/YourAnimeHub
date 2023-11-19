
const pool = require('./db');

module.exports = {
  async getOneUser(username) {
    try {
      let conn = await pool.getConnection();
      let sql = "SELECT user_id, user_name, user_email, user_role FROM users WHERE user_name = ? ";
      const [rows, fields] = await conn.execute(sql, [username]);
      conn.release();

      if (rows.length === 1) {
        return rows[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  getUserById(id) {
    // Implement getting a user by ID from the database
  }
  // ... other user-related functions
};