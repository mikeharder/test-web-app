import { useAzureMonitor } from "@azure/monitor-opentelemetry";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

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
