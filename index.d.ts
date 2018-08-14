/// <reference types="node" />

import * as EventEmitter from 'events'

declare module 'yet-another-event-loop-monitor' {
  
  export interface Option {

    /**
     * 采样间隔，默认5000ms
     */
    sampleInterval: number

    /**
     * 采样点数，默认100
     */
    samplePoints: number
  }

  export class EventLoopMonitor extends EventEmitter {
    constructor(option: Option)
    start(): void
    stop(): void
  }

}

