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
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            return rows;
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

    async delOneCharacter(characterId) {
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM Character_Card WHERE CharacterID = ?";
            const [okPacket, fields] = await conn.execute(sql, [characterId]);
            conn.release();
            console.log("DELETE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async addOneCharacter(characterData) {
        try {
            let conn = await pool.getConnection();
            let sql = "INSERT INTO Character_Card SET ?";
            const [okPacket, fields] = await conn.execute(sql, [characterData]);
            conn.release();
            console.log("INSERT " + JSON.stringify(okPacket));
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
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

    async getCharactersByAnime(animeId) {
        try {
            let conn = await pool.getConnection();
            let sql = `
                SELECT character.*
                FROM Character_Card AS character
                INNER JOIN AnimeQuote AS quote ON character.CharacterID = quote.CharacterID
                WHERE quote.AnimeID = ?;
            `;
            const [rows, fields] = await conn.execute(sql, [animeId]);
            conn.release();
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getCharacterIdByName(charName) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT CharacterID FROM Character_Card WHERE CharName = ?";
            const [rows, fields] = await conn.execute(sql, [charName]);
            conn.release();
            if (rows.length === 1) {
                return rows[0].CharacterID;
            } else {
                return null; // Character not found
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

};
