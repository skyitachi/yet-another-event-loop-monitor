### introduction
- Nodejs Event Loop Monitor
- unit is `millisecond(ms)`
#### Example
```javascript
const { EventLoopMonitor } = require('./index')

const monitor = new EventLoopMonitor({
  sampleInterval: 5000
})

monitor.start()


monitor.on('data', function (stats) {
  console.log(stats)
  monitor.stop()
})

```
