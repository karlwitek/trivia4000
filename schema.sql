CREATE TABLE users (
  id serial PRIMARY KEY,
  username text NOT NULL,
  userPassword text NOT NULL,
  totalGuesses integer DEFAULT 0,
  correct integer DEFAULT 0,
  incorrect integer DEFAULT 0,
  numGamesPlayed integer DEFAULT 0,
  active boolean DEFAULT false
);

