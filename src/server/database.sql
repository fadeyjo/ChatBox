-- CREATE TABLE users (
--     user_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     last_name VARCHAR(50) NOT NULL,
--     first_name VARCHAR(50) NOT NULL,
--     patronymic VARCHAR(50),
--     email TEXT NOT NULL UNIQUE,
--     nickname VARCHAR(50) NOT NULL UNIQUE,
--     hashed_password VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE activation_codes (
--     activation_code_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     activation_code INT NOT NULL,
--     user_id INT NOT NULL UNIQUE,
--     FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE refresh_tokens (
--     refresh_token_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     refresh_token VARCHAR(255) NOT NULL,
--     expires_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     user_id INT NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE posts (
--     post_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     content TEXT,
--     publication_date_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     post_author_id INT NOT NULL,
--     FOREIGN KEY (post_author_id) REFERENCES users (user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE friendships (
--     friendship_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     first_friend_id INT NOT NULL,
--     second_friend_id INT NOT NULL,
--     FOREIGN KEY (first_friend_id) REFERENCES users (user_id) ON DELETE CASCADE,
--     FOREIGN KEY (second_friend_id) REFERENCES users (user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE subscribers_page_owners (
--     subscriber_page_owner_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     subscriber_id INT NOT NULL,
--     page_owner_id INT NOT NULL,
--     FOREIGN KEY (subscriber_id) REFERENCES users (user_id) ON DELETE CASCADE,
--     FOREIGN KEY (page_owner_id) REFERENCES users (user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE reactions (
--     reaction_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     post_id INT NOT NULL,
--     reaction_author_id INT NOT NULL,
--     FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
--     FOREIGN KEY (reaction_author_id) REFERENCES users (user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE comments (
--     comment_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     content TEXT NOT NULL,
--     comment_date_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     post_id INT NOT NULL,
--     comment_author_id INT NOT NULL,
--     FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
--     FOREIGN KEY (comment_author_id) REFERENCES users (user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE reposts (
--     repost_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
--     repost_date_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     post_id INT NOT NULL,
--     repost_author_id INT NOT NULL,
--     FOREIGN KEY (post_id) REFERENCES posts (post_id),
--     FOREIGN KEY (repost_author_id) REFERENCES users (user_id) ON DELETE CASCADE
-- );

CREATE TABLE messages (
    message_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    content TEXT NOT NULL,
    dispatch_date_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    is_checked BOOL NOT NULL DEFAULT false,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE profile_images (
    profile_image_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    date_time_publication TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    image_data BYTEA NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE post_images (
    post_image_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    image_data BYTEA NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE
);