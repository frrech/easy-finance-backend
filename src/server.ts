import express, { Request, Response, NextFunction } from "express";
import { app, sequelize, setupDatabase } from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";

(async () => {
  try {
    await setupDatabase();
    await sequelize.authenticate();
    logger.info("✅ Connected to MySQL.");

    if (process.env.NODE_ENV !== "production") {
      logger.warn("⚠️  Forcing database sync (all tables dropped!)");
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await sequelize.sync({ force: true });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      logger.info("✅ Database synced successfully!");
    }

    // GLOBAL ERROR HANDLER (Express 5)
    app.use(
      (err: unknown, req: Request, res: Response, next: NextFunction): void => {
        if (err instanceof Error) {
          logger.error(`🔥 Global Error: ${err}`);

          res.status(500).json({
            message: err.message,
            stack: err.stack,
          });

          return; // ✔ MUST return void
        }

        logger.error(`🔥 Unknown Error: ${err}`);

        res.status(500).json({
          message: "Unknown server error",
        });

        return; // ✔ MUST return void
      }
    );

    const port = config.port || 3000;

    app.listen(port, () => {
      logger.info(`🚀 Server running at http://localhost:${port}`);
    });

  } catch (err: unknown) {
    console.error("❌ App startup failed");

    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
    } else {
      console.error(err);
    }

    process.exit(1);
  }
})();
