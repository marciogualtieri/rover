-- CREATE A TABLE TO HOLD THE CSV DATA
CREATE TABLE reviews(
  rating INTEGER NOT NULL,
  sitter_image  TEXT NOT NULL,
  end_date  TEXT NOT NULL,
  text  TEXT NOT NULL,
  owner_image  TEXT NOT NULL,
  dogs  TEXT NOT NULL,
  sitter  TEXT NOT NULL,
  owner  TEXT NOT NULL,
  start_date  TEXT NOT NULL,
  sitter_phone_number  TEXT NOT NULL,
  sitter_email  TEXT NOT NULL,
  owner_phone_number  TEXT NOT NULL,
  owner_email  TEXT NOT NULL
);

-- IMPORT THE CSV DATA TO THE TABLE
COPY reviews
FROM '/tmp/reviews.csv'
DELIMITER ','
CSV HEADER;

-- INSERT SITTER USERS
INSERT INTO users_customuser(password, is_superuser, is_staff, is_active, name, phone, image, email)
SELECT MD5(random()::text),
       FALSE,
       FALSE,
       TRUE,
       sitter,
       sitter_phone_number,
       sitter_image,
       sitter_email
FROM reviews
ON CONFLICT DO NOTHING;

-- INSERT OWNER USERS
INSERT INTO users_customuser(password, is_superuser, is_staff, is_active, name, phone, image, email)
SELECT MD5(random()::text),
       FALSE,
       FALSE,
       TRUE,
       owner,
       owner_phone_number,
       owner_image,
       owner_email
FROM reviews
ON CONFLICT DO NOTHING;

-- INSERT STAYS
INSERT INTO reviews_stay(rating, review, start_date, end_date, dogs, owner_id, sitter_id)
SELECT rating,
       text,
       to_timestamp(start_date, 'YYYY-MM-DD'),
       to_timestamp(end_date, 'YYYY-MM-DD'),
       ARRAY_TO_JSON(STRING_TO_ARRAY(dogs, '|')),
       (SELECT id FROM users_customuser WHERE email = owner_email),
       (SELECT id FROM users_customuser WHERE email = sitter_email)
from reviews;

-- COMPUTE AND INSERT SCORES
INSERT INTO reviews_score(sitter_id, ratings, overall)
SELECT sitter_id, ratings,
       CASE WHEN reviews = 0 THEN (5 * distinct_character_count / 26)
            WHEN reviews >= 10 THEN ratings
            ELSE ((5 * distinct_character_count / 26) + (ratings * reviews)) / (reviews + 1)
       END AS overall
FROM (
        SELECT sitter_id,
               avg(rating)::decimal AS ratings,
               COUNT(*)::decimal AS reviews,
               ARRAY_LENGTH(ARRAY(
                                  SELECT DISTINCT character_in_string_name
                                  FROM REGEXP_SPLIT_TO_TABLE(LOWER(REGEXP_REPLACE(users_customuser.name,
                                                                                  '[\s\.]+', '', 'g')), '')
                                           AS string_name(character_in_string_name)),
                            1)::decimal AS distinct_character_count
        FROM reviews_stay, users_customuser
        WHERE reviews_stay.sitter_id = users_customuser.id
        GROUP BY sitter_id, users_customuser.name) score_parameters;

-- INSERT USERS INTO ACCOUNTS_EMAILADDRESS (REQUIRED BY DJANGO-REST-AUTH)
INSERT INTO account_emailaddress(email, verified, "primary", user_id)
SELECT email, TRUE, TRUE, id
FROM users_customuser
ON CONFLICT DO NOTHING;
