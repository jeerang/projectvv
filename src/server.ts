// src/server.ts
import { createApp } from "./app";

const app = createApp();
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`\nServer is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
