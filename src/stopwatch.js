'use strict'
const format = require('format-duration')
const clivas = require('clivas')

class Stopwatch {
  constructor ({title = '', render = false} = {}) {
    this.title = title
    this.render = render
    this.timeStart
    this.timeEnd
    this.currentTime
    this.laps = []
    this.running = false
    this.callback
  }

  onTick (callback) {
    this.callback = callback
    return this
  }

  start () {
    this.running = true
    this.timeStart = new Date()
    this.loop()
  }

  loop () {
    this.currentTime = new Date()
    if (typeof this.callback === 'function') {
      this.callback({
        timeStart: this.timeStart,
        currentTime: this.currentTime,
        elapsedTime: this.getElapsedTime(),
        laps: this.laps,
        running: this.running
      })
    }

    if (this.render) this.show()

    this.timeoutRef = setTimeout(() => {
      this.loop()
    }, 1000)
  }

  pause () {
    if (!this.running) {
      this.running = true
      this.timeStart = new Date(new Date() - this.getElapsedTime())
      clivas.clear()
      this.loop()
      return
    }

    clearTimeout(this.timeoutRef)
    this.running = false
  }

  lap () {
    const elapsedTime = this.getElapsedTime()
    const time = format(elapsedTime)
    this.laps.push(time)
  }

  getElapsedTime () {
    return this.currentTime - this.timeStart
  }

  show () {
    const elapsedTime = this.getElapsedTime()
    const time = format(elapsedTime)

    clivas.clear()
    clivas.line(`${this.title}${time}`)
    this.showLaps()
  }

  showLaps () {
    this.laps.forEach((lapTime, i) => {
      const lapNumber = i + 1
      const lapInfo = ` - LAP ${lapNumber}: ${lapTime}`
      clivas.line(lapInfo)
    })
  }
}

module.exports = Stopwatch
