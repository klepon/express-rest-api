# hasil install
==> postgresql@14  
This formula has created a default database cluster with:  
  `initdb --locale=C -E UTF-8 /usr/local/var/postgresql@14`  
For more details, read:  
  https://www.postgresql.org/docs/14/app-initdb.html  

To start postgresql@14 now and restart at login:  
  `brew services start postgresql@14`  
Or, if you don't want/need a background service you can just run:  
  `/usr/local/opt/postgresql@14/bin/postgres -D /usr/local/var/postgresql@14`  

## akses db
dengan user/pass jika telah membuat  
`$ psql -U username -d database_name`

tanpa user/pass  
`$ psql -U an*****di** -d postgres`

### perintah dalam server/postgres (#)
pastikan sudha melakukan akses terlebih dahulu  
`# \q` keluar dari server
`# \l` list database  
`# CREATE DATABASE database_name` buat database  
`# \c db_name` masuk ke db  
`# \dt` list table  
`# CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);` buat table  
`# DROP TABLE IF EXISTS table _name;` hapus table

## extension
perlu aktivate uuid jika dipake  
`# CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
