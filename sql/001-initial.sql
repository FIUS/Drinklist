--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE flags
(
  key   TEXT    NOT NULL PRIMARY KEY,
  value INTEGER NOT NULL
);
INSERT INTO flags (key, value)
VALUES ('noTriggers', 0);

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
INSERT INTO users (id, name, balance, hidden)
VALUES (0, 'Drinklist', 0, 1);

CREATE TABLE beverage_transactions
(
  id        INTEGER NOT NULL,
  beverage  INTEGER NOT NULL,
  units     INTEGER NOT NULL, -- units transferred
  money     INTEGER NOT NULL, -- money paid
  user      INTEGER NOT NULL,
  cash_txn  INTEGER,
  timestamp INTEGER NOT NULL,
  CONSTRAINT beverage_txn_pk PRIMARY KEY (id),
  CONSTRAINT beverage_txn_fk_user FOREIGN KEY (user) REFERENCES users,
  CONSTRAINT beverage_txn_fk_beverage FOREIGN KEY (beverage) REFERENCES beverages,
  CONSTRAINT beverage_txn_fk_cash_txn FOREIGN KEY (cash_txn) REFERENCES cash_transactions ON DELETE CASCADE
);

CREATE VIEW topBeverages AS
SELECT b.id AS id, b.name AS name, b.stock AS stock, COUNT(*) AS count, b.deleted AS deleted
FROM beverage_transactions txn
       INNER JOIN beverages b ON txn.beverage = b.id
WHERE txn.units < 0
GROUP BY b.id;

CREATE TRIGGER beverage_txn_trg_on_insert
  AFTER INSERT
  ON beverage_transactions
  FOR EACH ROW
  WHEN (SELECT value
        FROM flags
        WHERE key = 'noTriggers') = 0
BEGIN
  -- Create cash transaction
  INSERT INTO cash_transactions (user_from, amount, user_to, reason, timestamp, beverage_txn)
  VALUES (new.user, new.money, 0, 'BTXN #' || new.id, new.timestamp, new.id);
  UPDATE beverage_transactions SET cash_txn = LAST_INSERT_ROWID() WHERE id = new.id;

  -- Adjust stock
  UPDATE beverages SET stock = stock + new.units WHERE id = new.beverage;
END;

CREATE TRIGGER beverage_txn_trg_on_delete
  AFTER DELETE
  ON beverage_transactions
  FOR EACH ROW
  WHEN (SELECT value
        FROM flags
        WHERE key = 'noTriggers') = 0
BEGIN
  -- Delete cash transaction
  DELETE FROM cash_transactions WHERE id = old.cash_txn;

  -- Adjust stock
  UPDATE beverages SET stock = stock - old.units WHERE id = old.beverage;
END;

CREATE INDEX beverage_txn_ix_user ON beverage_transactions (user);

CREATE TABLE cash_transactions
(
  id           INTEGER NOT NULL,
  user_from    INTEGER NOT NULL,
  amount       INTEGER NOT NULL,
  user_to      INTEGER NOT NULL,
  reason       TEXT    NOT NULL,
  timestamp    INTEGER NOT NULL,
  beverage_txn INTEGER,
  reverted     INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT cash_txn_pk PRIMARY KEY (id),
  CONSTRAINT cash_txn_fk_userFrom FOREIGN KEY (user_from) REFERENCES users,
  CONSTRAINT cash_txn_fk_userTo FOREIGN KEY (user_to) REFERENCES users,
  CONSTRAINT cash_txn_fk_beverage_txn FOREIGN KEY (beverage_txn) REFERENCES beverage_transactions ON DELETE CASCADE,
  CONSTRAINT cash_txn_ck_reverted CHECK ( reverted IN (0, 1) )
);

CREATE INDEX cash_txn_ix_userTo ON cash_transactions (user_to);
CREATE INDEX cash_txn_ix_userFrom ON cash_transactions (user_from);

CREATE TRIGGER cash_txn_trg_update_balances_on_insert
  AFTER INSERT
  ON cash_transactions
  FOR EACH ROW
  WHEN (SELECT value
        FROM flags
        WHERE key = 'noTriggers') = 0
BEGIN
  UPDATE users SET balance = balance - new.amount WHERE users.id = new.user_from;
  UPDATE users SET balance = balance + new.amount WHERE users.id = new.user_to;
END;

CREATE TRIGGER cash_txn_trg_update_balances_on_delete
  AFTER DELETE
  ON cash_transactions
  FOR EACH ROW
  WHEN (SELECT value
        FROM flags
        WHERE key = 'noTriggers') = 0
BEGIN
  UPDATE users SET balance = balance + old.amount WHERE users.id = old.user_from;
  UPDATE users SET balance = balance - old.amount WHERE users.id = old.user_to;
END;

CREATE TRIGGER cash_txn_trg_create_reversion
  AFTER UPDATE OF reverted
  ON cash_transactions
  FOR EACH ROW
  WHEN reverted = 1 AND (SELECT value
                         FROM flags
                         WHERE key = 'noTriggers') = 0
BEGIN
  INSERT INTO cash_transactions (user_from, amount, user_to, reason, timestamp, beverage_txn)
  VALUES (old.user_to, -old.amount, old.user_from, 'CTXN #' || old.id, STRFTIME('%s', 'now') * 1000, old.beverage_txn);
END;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE beverage_transactions;
DROP TABLE cash_transactions;
DROP TABLE beverages;
DROP TABLE users;
DROP TABLE flags;
DROP VIEW topBeverages;
