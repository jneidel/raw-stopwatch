#!/usr/bin/env node

'use strict'
const path = require('path')
const clivas = require('clivas')

// Hide cursor.
clivas.cursor(false)

// Avoid enter key from generating new lines
// and allows capturing key events.
const readline = require('readline')
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const Stopwatch = require('./stopwatch')
const stopwatch = new Stopwatch({render: true})
stopwatch.start()

process.stdin.on('keypress', (str, key) => {
  // Lap.
  if (key && key.name === 'return') {
    stopwatch.lap()
  }

  // Pause.
  if (key.name === 'space') {
    clivas.line(`{yellow:Paused}`)
    stopwatch.pause()
  }

  // Exit.
  if (key.name === 'q' || key.sequence === '\u0003') {
    process.exit()
  }
})
