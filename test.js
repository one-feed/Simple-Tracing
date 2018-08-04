const tracing = require('./index');

tracing.startTracing();

setTimeout(() => {
  tracing.stopTracing();
}, 60000);
