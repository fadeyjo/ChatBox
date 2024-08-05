CREATE TABLE IF NOT EXISTS customer (
	id SERIAL PRIMARY KEY,
	surname VARCHAR(20) NOT NULL,
	name VARCHAR(20) NOT NULL,
	patronymic VARCHAR(20) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	birthday DATE NOT NULL,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriber (
	id SERIAL PRIMARY KEY,
	subscriber_customer_id INTEGER NOT NULL,
	subscribe_on_customer_id INTEGER NOT NULL,
	FOREIGN KEY (subscriber_customer_id) REFERENCES customer(id),
	FOREIGN KEY (subscribe_on_customer_id) REFERENCES customer(id)
);

CREATE TABLE IF NOT EXISTS post (
	id SERIAL PRIMARY KEY,
	content TEXT,
	publication_time TIME,
	publication_date DATE,
	customer_id INTEGER,
	FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE IF NOT EXISTS friendship (
	id SERIAL PRIMARY KEY,
	first_customer_id INTEGER NOT NULL,
	second_customer_id INTEGER NOT NULL,
	FOREIGN KEY (first_customer_id) REFERENCES customer(id),
	FOREIGN KEY (second_customer_id) REFERENCES customer(id)
);

CREATE TABLE IF NOT EXISTS dialog (
	id SERIAL PRIMARY KEY,
	friendship_id INTEGER NOT NULL,
	FOREIGN KEY (friendship_id) REFERENCES friendship(id)
);

CREATE TABLE IF NOT EXISTS message (
	id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	is_first_customer BOOL NOT NULL,
	sending_time TIME NOT NULL,
	sending_date DATE NOT NULL,
	dialog_id INTEGER NOT NULL,
	FOREIGN KEY (dialog_id) REFERENCES dialog(id)
);