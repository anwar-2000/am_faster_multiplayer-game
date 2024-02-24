const mainTables = `
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE,
        email    VARCHAR(100) UNIQUE,
        password VARCHAR(150),
        max_score INTEGER DEFAULT 0,
        games_played INTEGER DEFAULT 0,
        last_game_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        theme VARCHAR(50),
        sound_enabled BOOLEAN,
        notifications_enabled BOOLEAN
    );

    CREATE TABLE user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        session_end TIMESTAMP
    );

    CREATE TABLE played_games (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_score INTEGER,
        game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE online_played_games (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        opponent_username VARCHAR(30),
        opponent_score INTEGER,
        user_score INTEGER,
        game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE text_samples (
        id SERIAL PRIMARY KEY,
        text_content TEXT,
        difficulty VARCHAR(10),
        category VARCHAR(10)
    );
`;
module.exports = mainTables