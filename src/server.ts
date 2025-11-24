import dotenv from "dotenv";
dotenv.config();
import app, { sequelize } from "./app.js";
import { initModels } from "./models/index.js";

(async () => {
  try {
    console.log("🔧 Loaded ENV:", {
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      NODE_ENV: process.env.NODE_ENV,
    });

    await sequelize.authenticate();
    initModels(sequelize);
    
    if (process.env.DB_SYNC_FORCE === "true") {
      console.warn("⚠️ Running sequelize.sync({ force: true }) — ALL TABLES WILL BE DROPPED!");
      await sequelize.sync({ force: true });
    }

    const port = process.env.PORT || 3000;

    app.listen(port, () =>
      console.log(`🚀 Server running at http://localhost:${port}`)
    );

  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();
