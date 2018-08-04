const pidusage = require('pidusage');
// const monitor = require('event-loop-monitor');
const EventLoopMonitor = require('evloop-monitor');
// const monitor = new EventLoopMonitor(200);

const sampleEveryMs = 5000;
const postDataEveryN = 4;

function getCpuPercent(startTime, startUsage) {
  var elapTimeMS = hrtimeToMS(process.hrtime(startTime));
  var elapUsageMS = usageToTotalUsageMS(process.cpuUsage(startUsage));
  return ((100.0 * elapUsageMS) / elapTimeMS).toFixed(1);
}

function usageToTotalUsageMS(elapUsage) {
  var elapUserMS = elapUsage.user / 1000.0; // microseconds to milliseconds
  var elapSystemMS = elapUsage.system / 1000.0;
  return elapUserMS + elapSystemMS;
}

function hrtimeToMS(hrtime) {
  return hrtime[0] * 1000.0 + hrtime[1] / 1000000.0;
}

const store = {
  statsTest: [],
  stats: [],
};

let count = 0;
let init = false;
let interval = null;
const startTracing = ({ debug = false } = {}) => {
  var startTime = process.hrtime();
  var startUsage = process.cpuUsage();

  interval = setInterval(() => {
    // console.log(process.pid);

    pidusage(process.pid, function(err, stats) {
      stats.memoryBytes = stats.memory / (1024 * 1024);
      // if (init) {
      const s = {
        p: process.pid,
        c: stats.cpu.toFixed(2),
        m: (stats.memory / (1024 * 1024)).toFixed(2),
        t: Math.round(new Date().getTime() / 1000),
      };
      store.stats.push(s);
      count++;

      if (count === postDataEveryN) {
        if (debug) {
          console.log(store.stats);
        }
        store.prevStats = store.stats;
        store.stats = [];

        count = 0;
      }
    });

    const s = {
      p: process.pid,
      c: getCpuPercent(startTime, startUsage),
      m: process.memoryUsage().rss / (1024 * 1024),
      t: Math.round(new Date().getTime() / 1000),
    };

    console.log(s);

    // console.log(getCpuPercent(startTime, startUsage));
    // const memory = process.memoryUsage().rss / (1024 * 1024);
    // console.log(memory);
    // console.log(process.pid);
    startTime = process.hrtime();
    startUsage = process.cpuUsage();
  }, sampleEveryMs);
};

const stopTracing = () => {
  if (interval) {
    clearInterval(interval);
    console.log(interval);
  }
};

module.exports = {
  startTracing,
  stopTracing,
};

// monitor.start();
// setInterval(function() {
//   console.log(monitor.status());
//   // output an object like:
//   //  {pctBlock: 40.87, elapsedTime: 2031, totalLag: 830.06}
// }, 5000);

// monitor.on('data', function(latency) {
//   console.log(latency); // { p50: 1026, p90: 1059, p95: 1076, p99: 1110, p100: 1260 }
// });

// monitor.resume(5000);
