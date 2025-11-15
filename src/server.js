import { app, sequelize, setupDatabase } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

(async () => {
  try {
    await setupDatabase();
    await sequelize.authenticate();
    logger.info("✅ Connected to MySQL.");

    // Drop and recreate all tables (for dev only)
    logger.warn("⚠️  Forcing database sync (all tables will be dropped and recreated)...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    logger.info("✅ Database synced successfully!");

    // Global error fallback (optional, but okay here)
    app.use((err, req, res, next) => {
      console.error("🔥 Global Error Handler:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    });

    app.listen(config.port || 3000, () => {
      logger.info(`🚀 Server running on http://localhost:${config.port || 3000}`);
    });

  } catch (err) {
  console.error("❌ App startup failed:");
  console.error(err); // full object
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  process.exit(1);
}

})();
