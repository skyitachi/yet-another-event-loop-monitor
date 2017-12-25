const EventEmitter = require('events')
const monitorInterval = 10

class EventLoopMonitor extends EventEmitter {
  /**
   * @constructor
   * @param {Object} option - init options
   * @param {number} option.sampleInterval - sample interval
   */
  constructor(option) {
    super()
    this.option = Object.assign(
      {
        sampleInterval: 5000
      },
      option
    )
    if (this.option.sampleInterval > 10000) {
      throw new Error(`sampleInterval cannot greater than 10000`)
    }
    this._monitorTimer = null
    this._sampleTimer = null
    this._ticks = [[0, 0]]
    this._lags = []
  }
  /**
   * start the monitor
   */
  start() {
    if (this._monitorTimer) return
    let start = process.hrtime()
    this._monitorTimer = setInterval(
      () => {
        const ticks = this._ticks
        ticks.push(process.hrtime(start))
      },
      monitorInterval
    )
    this._sampleTimer = setInterval(
      () => {
        const total = this._ticks.length - 1
        const ticks = this._ticks
        const reducedTicks = {}
        this._lags.length = 0
        for(let i = 1; i < total + 1; i++) {
          const lag = (ticks[i][0] - ticks[i - 1][0]) * 1e6 - monitorInterval * 1e3 + Math.floor((ticks[i][1] - ticks[i - 1][1]) / 1e3 )
          if (typeof reducedTicks[lag] === 'undefined') {
            this._lags.push(+lag)
          }
          reducedTicks[lag] = reducedTicks[lag] || 0;
          reducedTicks[lag]++;

        }
        const sortedLag = this._lags.sort(function (a, b) {
          if (a < b) return -1
          else if (a > b) return 1
          return 0
        })
        let counter = 0
        const stats = {}
        for(let i = 0, len = sortedLag.length; i < len; i++) {
          const lag = sortedLag[i]
          const count = reducedTicks[lag]
          const nextCount = counter + count
          // 50%
          if (!stats.p50 && nextCount >= total * 0.5) {
            stats.p50 = lag
          }
          // 90%
          if (!stats.p90 && nextCount >= total * 0.9) {
            stats.p90 = lag
          }
          // 95%
          if (!stats.p95 && nextCount >= total * 0.95) {
            stats.p95 = lag
          }
          // 99%
          if (!stats.p99 && nextCount >= total * 0.99) {
            stats.p99 = lag
          }
          counter = nextCount
        }
        stats.p100 = sortedLag[sortedLag.length - 1]
        this.emit('data', stats)

        this._ticks[0] = this._ticks.pop()
        this._ticks.length = 1
      },
      this.option.sampleInterval
    )
  }

  /**
   * stop the monitor
   */
  stop() {
    if (!this._monitorTimer) return
    clearInterval(this._monitorTimer)
    clearInterval(this._sampleTimer)
  }
}

exports.EventLoopMonitor = EventLoopMonitor
