import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const exporter = new OTLPTraceExporter({
  url: `${process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
  headers: {"api-key": process.env.NEXT_PUBLIC_NR_LICENSE_KEY}
});
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "fruit-app",
});

const provider = new WebTracerProvider({resource: resource});
provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Registering instrumentations
registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations()
  ],
});

