import sqlite3

conn = sqlite3.connect('skincare.db')

cursor = conn.cursor()

print("Database connected successfully.")

create_table_query = '''
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_type TEXT,
    routine_step TEXT,
    usage_time TEXT,
    is_active BOOLEAN,
    key_actives TEXT,
    skin_types TEXT,
    region TEXT,
    size_in_ml INTEGER,
    price_in_usd REAL,
    image_url TEXT,
    description TEXT
);
'''

cursor.execute(create_table_query)

print("Table 'products' created successfully or already exists.")

conn.commit()

conn.close()

print("Database connection closed.")