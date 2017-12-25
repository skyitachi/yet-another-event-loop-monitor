/// <reference types="node" />

import * as EventEmitter from 'events'

declare module 'yet-another-event-loop-monitor' {
  
  export interface Option {
    sampleInterval: number
  }

  export class EventloopMonitor extends EventEmitter {
    constructor(option: Option)
    start(): void
    stop(): void
  }

}

