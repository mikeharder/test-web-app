import { useAzureMonitor } from "@azure/monitor-opentelemetry";

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  useAzureMonitor();
  console.log("Azure Monitor OpenTelemetry enabled");
} else {
  console.log(
    "APPLICATIONINSIGHTS_CONNECTION_STRING not set; skipping Azure Monitor",
  );
}
