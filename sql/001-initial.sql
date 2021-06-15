--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE beverages
(
    id      INTEGER NOT NULL,
    name    TEXT    NOT NULL,
    price   INTEGER NOT NULL,
    stock   INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT beverages_pk PRIMARY KEY (id),
    CONSTRAINT beverages_ck_deleted CHECK ( deleted IN (0, 1) )
);

CREATE TABLE users
(
    id      INTEGER NOT NULL,
    name    TEXT    NOT NULL,
    balance INTEGER NOT NULL DEFAULT 0,
    hidden  INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT users_pk PRIMARY KEY (id),
    CONSTRAINT users_ck_hidden CHECK ( hidden IN (0, 1) )
);
INSERT INTO users
VALUES (0, 'Drinklist', 0, 1);

CREATE TABLE transactions
(
    id        INTEGER NOT NULL,
    userFrom  INTEGER NOT NULL,
    amount    TEXT    NOT NULL,
    userTo    INTEGER NOT NULL,
    reason    TEXT    NOT NULL,
    timestamp INTEGER NOT NULL,
    beverage  INTEGER,
    reverted  INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT transactions_pk PRIMARY KEY (id),
    CONSTRAINT transactions_fk_userFrom FOREIGN KEY (userFrom) REFERENCES users,
    CONSTRAINT transactions_fk_userTo FOREIGN KEY (userTo) REFERENCES users,
    CONSTRAINT transactions_fk_beverage FOREIGN KEY (beverage) REFERENCES beverages,
    CONSTRAINT transactions_ck_reverted CHECK ( reverted IN (0, 1) )
);

CREATE VIEW topBeverages AS
SELECT b.id AS id, b.name AS name, b.stock AS stock, COUNT(*) AS count, b.deleted AS deleted
FROM transactions t
         INNER JOIN beverages b ON t.beverage = b.id
GROUP BY b.id;
--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE beverages;
DROP TABLE users;
DROP TABLE transactions;
DROP VIEW topBeverages;
