CREATE TABLE IF NOT EXISTS users (
    visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at DEFAULT current_timestamp,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    displayname TEXT,
    description TEXT
);

CREATE TRIGGER update_users_updated_at
AFTER UPDATE ON users
WHEN old.updated_at <> current_timestamp
BEGIN
    UPDATE users
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;
