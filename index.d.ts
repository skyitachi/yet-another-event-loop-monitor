declare module 'yet-another-event-loop-monitor' {
  
  export interface Option {
    sampleInterval: number
  }

  export class EventloopMonitor {
    constructor(option: Option)
  }

}

