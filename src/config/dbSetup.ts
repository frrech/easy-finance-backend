// src/config/dbSetup.ts
import mysql from "mysql2/promise";

export async function setupDatabase() {
  const rootUser = process.env.DB_ROOT_USER || "root";
  const rootPass = process.env.DB_ROOT_PASSWORD || "MyRoot123!";
  const host = process.env.DB_HOST || "localhost";
  const portNumber = Number(process.env.DB_PORT || 3306); // <-- number

  const dbName = process.env.DB_NAME || "easyfinancedb";
  const appUser = process.env.DB_USER || "easyfinance_user";
  const appPass = process.env.DB_PASSWORD || "easyfinance_pass";

  const connection = await mysql.createConnection({
    host,
    port: portNumber,
    user: rootUser,
    password: rootPass,
  });

  console.log("🔍 Checking MySQL database and user...");

  // Check if DB exists
  const [databases] = await connection.query<any>("SHOW DATABASES LIKE ?", [dbName]);
  if ((databases as any).length === 0) { // cast to any
    await connection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Database "${dbName}" created.`);
  } else {
    console.log(`ℹ️ Database "${dbName}" already exists.`);
  }

  // Check if user exists
  const [users] = await connection.query<any>("SELECT user FROM mysql.user WHERE user = ?", [appUser]);
  if ((users as any).length === 0) {
    await connection.query(`CREATE USER '${appUser}'@'localhost' IDENTIFIED BY '${appPass}';`);
    await connection.query(`GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO '${appUser}'@'localhost';`);
    await connection.query("FLUSH PRIVILEGES;");
    console.log(`✅ MySQL user "${appUser}" created and granted privileges.`);
  } else {
    console.log(`ℹ️ MySQL user "${appUser}" already exists.`);
  }

  await connection.end();
  console.log("✅ Database setup complete.");
}
