const { execSync } = require("child_process");
require("dotenv").config();

try {
  console.log("Running migrations...");
  execSync("npx sequelize-cli db:migrate", { stdio: "inherit" });
  console.log("Migrations completed");
  
  console.log("Running seeds...");
  execSync("npx sequelize-cli db:seed:all", { stdio: "inherit" });
  console.log("Seeds completed");
} catch (error) {
  console.error("Migration/seed error:", error);
  process.exit(1);
}

