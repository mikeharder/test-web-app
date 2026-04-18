import dotenv from "dotenv";
import http from "node:http";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);

  if (req.url === "/health") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "ok" }) + "\n");
    return;
  }

  const info = {
    serverTime: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV ?? "development",
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    uptimeSeconds: process.uptime(),
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    websiteHostname: process.env.WEBSITE_HOSTNAME,
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(info, null, 2) + "\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
