use ChatApp;

CREATE TABLE UserModel (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE UserData (
    Id INT PRIMARY KEY,
    FirstName VARCHAR(1024) NOT NULL,
    LastName VARCHAR(1024) NOT NULL,
    CONSTRAINT FK_UserData_User FOREIGN KEY (Id) REFERENCES UserModel(Id)
);


CREATE TABLE Password (
    userId INT PRIMARY KEY,
    PasswordHash VARCHAR(1024) NOT NULL,
    Salt VARCHAR(1024) NOT NULL,
    HashingRounds INT NOT NULL DEFAULT 12,
    PasswordSetDate DATETIME NOT NULL,
    CONSTRAINT FK_Password_User FOREIGN KEY (userId) REFERENCES UserModel(Id)
);


CREATE TABLE Friend (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    FriendId INT NOT NULL,
    Status VARCHAR(1024) NOT NULL DEFAULT 'pending',
    CONSTRAINT FK_Friend_User FOREIGN KEY (UserId) REFERENCES UserModel(Id),
    CONSTRAINT FK_Friend_FriendUser FOREIGN KEY (FriendId) REFERENCES UserModel(Id)
);

CREATE TABLE Chat (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ChatType VARCHAR(1024) NOT NULL DEFAULT 'private',
    ChatName VARCHAR(1024) NOT NULL
);


CREATE TABLE ChatParticipant (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ChatId INT NOT NULL,
    UserId INT NOT NULL,
    CONSTRAINT FK_ChatParticipant_Chat FOREIGN KEY (ChatId) REFERENCES Chat(Id),
    CONSTRAINT FK_ChatParticipant_User FOREIGN KEY (UserId) REFERENCES UserModel(Id)
);

CREATE TABLE Message (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ChatId INT NOT NULL,
    SenderId INT NOT NULL,
    SentTime DATETIME NOT NULL,
    Content VARCHAR(1024) NOT NULL,
    CONSTRAINT FK_Message_Chat FOREIGN KEY (ChatId) REFERENCES Chat(Id),
    CONSTRAINT FK_Message_Sender FOREIGN KEY (SenderId) REFERENCES UserModel(Id)
);







