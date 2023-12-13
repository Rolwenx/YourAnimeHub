CREATE DATABASE if not exists animeDb;
USE animeDb;

DROP TABLE if exists Character_Card;
DROP TABLE if exists AnimeQuote;
DROP TABLE if exists Anime;
DROP TABLE if exists Appear_In;
DROP TABLE if exists User_Profile;
DROP TABLE if exists User_Favorite_Quote;
DROP TABLE if exists User_Favorite_Anime;
DROP TABLE if exists View_Anime;


CREATE TABLE User_Profile(
   UserID INT AUTO_INCREMENT PRIMARY KEY,
   Username VARCHAR(50) NOT NULL,
   Email VARCHAR(100) NOT NULL,
   FirstName VARCHAR(50),
   LastName VARCHAR(50),
   UserPassword VARCHAR(50) NOT NULL,
   ProfilePictureURL VARCHAR(100),
   TitleDisplayLanguage VARCHAR(20),  -- English, Japanese, Romaji
   UserRole VARCHAR(50),
   Birthday DATE,
	Bio TEXT,
   -- Active, suspended, banned
   AccountStatus VARCHAR(50),
	UNIQUE(Username),
   UNIQUE(Email)
);

CREATE TABLE Anime(
   AnimeID INT AUTO_INCREMENT PRIMARY KEY,
   TitleEnglish VARCHAR(100) NOT NULL,
   TitleRomaji VARCHAR(100),
   TitleNative VARCHAR(100),
   Genre VARCHAR(250) NOT NULL,
   ReleaseDate DATE,
   EndDate DATE,
   AnimeStatus VARCHAR(20),
   Synopsis TEXT,
   PopularityPosition INT DEFAULT 0,
   CoverImageURL VARCHAR(255),
   BackgroundImageURL VARCHAR(100),
   StreamingPlatformURL VARCHAR(100),
   -- Is it Anime or Manga
   AnimeFormat VARCHAR(50),
    -- Is it TV SHOW or MOVIE
   TypeFormat  VARCHAR(50),
   EpisodeDuration INT,
   EpisodeCount INT,
   Chapters INT,
   Volumes INT
);

CREATE TABLE Character_Card(
	 CharacterID INT AUTO_INCREMENT PRIMARY KEY,
	 CharName VARCHAR(100) NOT NULL,
	 Birthday VARCHAR(25),
	 Age VARCHAR(150),
	 Gender VARCHAR(15),
	 BloodType VARCHAR(8),
	 Height VARCHAR(25),
	 CharSynopsis TEXT,
   ImageURL VARCHAR(100),
   isMainCharacter BOOLEAN NOT NULL,
	 Likes INT DEFAULT 0,
   Family TEXT, 
   NamesGiven TEXT,
    -- Hidden Spoiler Surnames field (can be hidden by the user)
   HiddenSurnames TEXT,
-- some character cards need more info than others. this will allow to store the
-- if needed
	 SpecificField1 TEXT
);


CREATE TABLE AnimeQuote(
	 QuoteID INT AUTO_INCREMENT PRIMARY KEY,
   QuoteText TEXT,
   CharacterID INT NOT NULL,
   AnimeID INT NOT NULL,
	QuoteLikes INT DEFAULT 0,
   QuoteDislikes INT DEFAULT 0,
   isQuoteOfDay VARCHAR(5),
   FOREIGN KEY(CharacterID) REFERENCES Character_Card(CharacterID),
   FOREIGN KEY(AnimeID) REFERENCES Anime(AnimeID)
);


CREATE TABLE Appear_In(
   AnimeID INT,
   CharacterID INT,
   PRIMARY KEY(AnimeID, CharacterID),
   FOREIGN KEY(AnimeID) REFERENCES Anime(AnimeID),
   FOREIGN KEY(CharacterID) REFERENCES Character_Card(CharacterID)
);

-- Because there's a favourite quote category in the user profile
CREATE TABLE User_Favorite_Character(
   CharacterID INT,
   UserID INT,
   PRIMARY KEY(CharacterID, UserID),
   FOREIGN KEY(CharacterID) REFERENCES Character_Card(CharacterID),
   FOREIGN KEY(UserID) REFERENCES User_Profile(UserID)
);

-- Because there's a favourite anime category in the user profile
CREATE TABLE User_Favorite_Anime (
   UserID INT,
   AnimeID INT,
   PRIMARY KEY (UserID, AnimeID),
   FOREIGN KEY (UserID) REFERENCES User_Profile(UserID),
   FOREIGN KEY (AnimeID) REFERENCES Anime(AnimeID)
);

CREATE TABLE View_Anime(
   AnimeID INT,
   UserID INT,
   ReviewID VARCHAR(40),
   ReviewText TEXT,
	ReviewDate TIMESTAMP, -- Date and time of the review
   ReviewSummary VARCHAR(200),
   ReviewGrade INT,
   RateGrade SMALLINT,
   LikesOnReview INT,
   DislikesOnReview INT,
	EpisodeProgress INT, -- to track episodes watched
	AnimeStatus VARCHAR(50), -- Watching, Planning, Completed, Rewatching, Paused, Dropped
	TotalRewatch INT,   -- how many times the user watched anime
	ChaptersRead INT,   -- to track chapters read
	StartDate DATE,
   EndDate DATE,
   Notes TEXT,
   -- 0 = hasn't liked / 1 = has liked
   hasLiked INT,
   PRIMARY KEY(AnimeID, UserID),
   FOREIGN KEY(AnimeID) REFERENCES Anime(AnimeID),
   FOREIGN KEY(UserID) REFERENCES User_Profile(UserID)
);
