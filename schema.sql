create table if not exists users(
    chat_id text unique,
    username text unique
);
