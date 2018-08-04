const tracing = require('./index');

tracing.startTracing({ debug: true });

setTimeout(() => {
  tracing.stopTracing();
}, 60000);
