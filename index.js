const pidusage = require('pidusage');
// const monitor = require('event-loop-monitor');
const EventLoopMonitor = require('evloop-monitor');
// const monitor = new EventLoopMonitor(200);

const sampleEveryMs = 1000;
const postDataEveryN = 5;

const store = {
  prevStats: [],
  stats: [],
};

let count = 0;
let init = false;
let interval = null;
const startTracing = ({ debug = false } = {}) => {
  interval = setInterval(() => {
    // console.log(process.pid);

    pidusage(process.pid, function(err, stats) {
      stats.memoryBytes = stats.memory / (1024 * 1024);
      if (init) {
        const s = {
          m: (stats.memory / (1024 * 1024)).toFixed(2),
          c: stats.cpu.toFixed(2),
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
      } else {
        init = true;
      }

      // => {
      //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
      //   memory: 357306368,    // bytes
      //   ppid: 312,            // PPID
      //   pid: 727,             // PID
      //   ctime: 867000,        // ms user + system time
      //   elapsed: 6650000,     // ms since the start of the process
      //   timestamp: 864000000  // ms since epoch
      // }
    });

    // const memory = process.memoryUsage().rss / (1024*1024);
    // console.log(memory);
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
