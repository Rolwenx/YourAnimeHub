// character.repository.js

pool = require("../utils/db.js");

module.exports = {
    getBlankCharacter() {
        // Return a template object representing a character with default values
        return {
            "CharacterID": 0,
            "CharName": "",
            "Birthday": "",
            "Age": "",
            "Gender": "",
            "BloodType": "",
            "Height": "",
            "Description": "",
            "ImageURL": "",
            "isMainCharacter": false,
            "Likes": 0,
            "Family": "",
            "NamesGiven": "",
            //  Hidden Spoiler Surnames field (can be hidden by the user)
            "HiddenSurnames": "",
            //some character cards need more info than others. 
            // this will allow to store the
            // if needed
            "SpecificField1": ""
        
        };
    },


    async getAllCharacters() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Character_Card";
    
            // Ensure rows is an array
            const characterList = await conn.query(sql);
            conn.release();
    
    
            return characterList;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },


    async getOneCharacter(characterId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Character_Card WHERE CharacterID = ?";
            const [rows, fields] = await conn.execute(sql, [characterId]);
            conn.release();


            if (rows != null) {
                return rows;
            } else {
                console.log('character not found for characterId:', characterId);
                return false;
            }
        } catch (err) {
            console.error('Error in getOneCharacter:', err);
            throw err;
        }
    },

    async delOneCharacter(characterId) {
        try {
            let conn = await pool.getConnection();
    
            // Check if there are dependencies in the quotes table
            const [result] = await conn.execute("SELECT COUNT(*) AS count FROM AnimeQuote WHERE CharacterID = ?", [characterId]);
            const quoteCount = result.count;
    
            if (quoteCount > 0) {
                console.log("Character has dependencies in the quotes table. Cannot delete.");

                return;
            }
    
            let sql = "DELETE FROM Character_Card WHERE CharacterID = ?";
            const [okPacket, fields] = await conn.execute(sql, [characterId]);
            conn.release();
            console.log("DELETE " + JSON.stringify(okPacket));
    
        } catch (err) {
            console.log(err);
            throw err;
        }
    },    

    

    async addOneCharacter(characterData) {
        
        try {
            let conn = await pool.getConnection();

            // Check if an character with the same Name already exists
            const existingCharacter = await conn.query(
                'SELECT * FROM Character_Card WHERE CharName = ?',
                [characterData.CharName]
            );
        

            if (existingCharacter.length > 0) {
                // Character with the same Name  already exists
                return null; 
            }
    
            // Extract keys and values from characterData
            const keys = Object.keys(characterData);
            const values = Object.values(characterData);
    
            // Construct the SQL query with named placeholders
            const placeholders = keys.map(key => `${key} = ?`).join(', ');
            const sql = `INSERT INTO Character_Card SET ${placeholders}`;

            // Execute the query
            const result = await conn.execute(sql, values);


            const okPacket = result; 


            conn.release();
            return okPacket.insertId;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    },

    async editOneCharacter(characterId, characterData) {
        try {
            let conn = await pool.getConnection();
            let sql = "UPDATE Character_Card SET ? WHERE CharacterID = ?";
            const [okPacket, fields] = await conn.execute(sql, [characterData, characterId]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async editOneCharacter(characterId, characterData) {
        try {
            let conn = await pool.getConnection();
            
            // Construct the SQL query with named placeholders for animeData
            const placeholders = Object.keys(characterData).map(key => `${key} = ?`).join(', ');
            const sql = `UPDATE Character_Card SET ${placeholders} WHERE characterId = ?`;
            
            // Combine values from characterData and characterId
            const values = [...Object.values(characterData), characterId];
    
            // Execute the query
            const result = await conn.execute(sql, values);
            
    
            conn.release();
    
            return result;
        } catch (err) {
            console.error('Error in editOneCharacter:', err);
            throw err;
        }
    },

    async getCharacterIdByName(CharName) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT CharacterID FROM Character_Card WHERE CharName = ?";
        
            const [rows] = await conn.query(sql, [CharName]);
            
            conn.release();
            
            if (rows && rows.CharacterID != null) {
                return rows.CharacterID;
            } else {
                return null;
            }
            
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    async getCharacterNameByID(characterID) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT CharName FROM Character_Card WHERE CharacterID = ?";

        
            const [rows] = await conn.query(sql, [characterID]);

            
            conn.release();
            
            if (rows && rows.CharName != null) {

                return rows.CharName;
            } else {

                return null;
            }
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },
    

};
