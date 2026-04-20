import { useAzureMonitor } from "@azure/monitor-opentelemetry";
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  trace,
} from "@opentelemetry/api";
import dotenv from "dotenv";
import http from "node:http";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

if (process.env.OTEL_DIAG === "1") {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  useAzureMonitor({
    azureMonitorExporterOptions: {
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    },
    enableLiveMetrics: true,
  });
  console.log("Azure Monitor OpenTelemetry enabled");
} else {
  console.log(
    "APPLICATIONINSIGHTS_CONNECTION_STRING not set; skipping Azure Monitor",
  );
}

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);

  // inside handler, before res.end:
  trace.getTracer("manual").startSpan("manual-test").end();

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
