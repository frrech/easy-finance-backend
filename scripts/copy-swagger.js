import { copyFileSync } from "fs";
import { mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });
copyFileSync("src/swagger.json", "dist/swagger.json");

console.log("Swagger copied to dist/swagger.json");