// anime.repository.js

pool = require("../utils/db.js");

module.exports = {
    getBlankAnime() {
        // Return a template object representing an anime/manga with default values
        return {
            "AnimeID": 0,
            "TitleEnglish": "",
            "TitleRomaji": "",
            "TitleNative": "",
            "Genre": "",
            "ReleaseDate": null,
            "EndDate": null,
            // status (e.g., Finished, Ongoing, Paused, Dropped)
            "AnimeStatus": "",
            "Synopsis": "",
            "PopularityPosition": 0,
            // URL for the cover image
            "CoverImageURL": "",
            // URL for the background image
            "BackgroundImageURL": "",
            "StreamingPlatformURL": "",
            "AnimeFormat": "", // TV, Manga, Movies
            "EpisodeDuration": 0,
            "EpisodeCount": 0, // For anime
            "Chapters": 0, // For manga
            "Volumes": 0, // For manga
        };
    },

    async getAllAnime() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeFormat = 'Anime'";
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            console.log("ANIME FETCHED: " + (rows ? rows.length : 0));
            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getAllMangas() {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeFormat = 'Manga'";
            const [rows, fields] = await conn.execute(sql);
            conn.release();
            console.log("MANGA FETCHED: " + (rows ? rows.length : 0));

            return rows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },


    async editOneAnime(animeId, animeData) {
        try {
            let conn = await pool.getConnection();
            let sql = "UPDATE Anime SET ? WHERE AnimeID = ? AND AnimeFormat = 'Anime'";
            const [okPacket, fields] = await conn.execute(sql, [animeData, animeId]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async editOneManga(animeId, animeData) {
        try {
            let conn = await pool.getConnection();
            let sql = "UPDATE Anime SET ? WHERE AnimeID = ? AND AnimeFormat = 'Manga'";
            const [okPacket, fields] = await conn.execute(sql, [animeData, animeId]);
            conn.release();
            console.log("UPDATE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async addOneAnime(animeData) {
        try {
            let conn = await pool.getConnection();
            let sql = "INSERT INTO Anime SET ?";
            const [okPacket, fields] = await conn.execute(sql, [animeData]);
            conn.release();
            console.log("INSERT " + JSON.stringify(okPacket));
            return okPacket.insertId;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async delOneAnime(animeId) {
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM Anime WHERE AnimeID = ? AND AnimeFormat = 'Anime'";
            const [okPacket, fields] = await conn.execute(sql, [animeId]);
            conn.release();
            console.log("DELETE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async delOneManga(animeId) {
        try {
            let conn = await pool.getConnection();
            let sql = "DELETE FROM Anime WHERE AnimeID = ? AND AnimeFormat = 'Manga'";
            const [okPacket, fields] = await conn.execute(sql, [animeId]);
            conn.release();
            console.log("DELETE " + JSON.stringify(okPacket));
            return okPacket.affectedRows;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async getOneAnime(animeId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeID = ? AND AnimeFormat = 'Anime'";
            const [rows, fields] = await conn.execute(sql, [animeId]);
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

    async getOneManga(animeId) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT * FROM Anime WHERE AnimeID = ? AND AnimeFormat = 'Manga'";
            const [rows, fields] = await conn.execute(sql, [animeId]);
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

    async getAnimeIdByName(titleEnglish) {
        try {
            let conn = await pool.getConnection();
            let sql = "SELECT AnimeID FROM Anime WHERE TitleEnglish = ?";
            const [rows, fields] = await conn.execute(sql, [titleEnglish]);
            conn.release();
            if (rows.length === 1) {
                return rows[0].AnimeID;
            } else {
                return null; // Anime not found
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },


};
