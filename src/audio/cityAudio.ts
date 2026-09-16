const AUDIO = {
  city: '/audio/city-hum.mp3',
  train: '/audio/train-passing.mp3',
  horn1: '/audio/train-horn-1.mp3',
  horn2: '/audio/train-horn-2.mp3',
  horn3: '/audio/train-horn-3.mp3',
} as const

const SOUND_MUTED_STORAGE_KEY = 'legaspi.sound-muted'
const MASTER_GAIN = 10 ** (-2 / 20)

export function initialSoundEnabled() {
  try {
    return localStorage.getItem(SOUND_MUTED_STORAGE_KEY) === 'false'
  } catch {
    return false
  }
}

export function storeSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(SOUND_MUTED_STORAGE_KEY, String(!enabled))
  } catch {
    // Preference is a convenience.
  }
}

type AudioName = keyof typeof AUDIO

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

class CityAudio {
  private context: AudioContext | null = null
  private buffers: Partial<Record<AudioName, AudioBuffer>> = {}
  private loading: Promise<boolean> | null = null
  private enabled = false
  private master: GainNode | null = null
  private cityGain: GainNode | null = null
  private trainGain: GainNode | null = null
  private trainFilter: BiquadFilterNode | null = null
  private trainPan: StereoPannerNode | null = null
  private hornGain: GainNode | null = null
  private hornFilter: BiquadFilterNode | null = null
  private hornPan: StereoPannerNode | null = null
  private citySource: AudioBufferSourceNode | null = null
  private trainSource: AudioBufferSourceNode | null = null
  private activeHorns = new Set<AudioBufferSourceNode>()
  private hornUntil = 0

  async setEnabled(enabled: boolean) {
    this.enabled = enabled

    if (!enabled) {
      this.fadeMaster(0)
      this.stopHorns()
      return true
    }

    try {
      const context = this.ensureContext()
      await context.resume()
      if (!(await this.load()) || !this.enabled) return false

      this.startLoops()
      this.fadeMaster(MASTER_GAIN)
      return context.state === 'running'
    } catch {
      this.enabled = false
      this.fadeMaster(0)
      return false
    }
  }

  updateTrain(pan: number, proximity: number, running: boolean) {
    if (
      !this.context ||
      !this.trainGain ||
      !this.trainFilter ||
      !this.trainPan ||
      !this.hornGain ||
      !this.hornFilter ||
      !this.hornPan
    )
      return

    const now = this.context.currentTime
    const stereo = clamp(pan, -1, 1)
    const distanceMix = clamp(proximity, 0, 1)
    const cutoff = 650 + distanceMix ** 2 * 10_000
    this.trainPan.pan.setTargetAtTime(stereo, now, 0.06)
    this.hornPan.pan.setTargetAtTime(stereo, now, 0.06)
    this.trainFilter.frequency.setTargetAtTime(cutoff, now, 0.08)
    this.hornFilter.frequency.setTargetAtTime(cutoff, now, 0.08)
    this.trainGain.gain.setTargetAtTime(running ? distanceMix * 0.34 : 0, now, 0.18)
    this.hornGain.gain.setTargetAtTime(running ? distanceMix * 0.46 : 0, now, 0.18)
  }

  playCrossingHorn(seed: number) {
    if (!this.enabled || !this.context || !this.hornGain) return false
    if (this.context.currentTime < this.hornUntil) return false

    const firstLong = seed < 0.5 ? this.buffers.horn1 : this.buffers.horn3
    const secondLong = seed < 0.5 ? this.buffers.horn3 : this.buffers.horn1
    const short = this.buffers.horn2
    if (!firstLong || !secondLong || !short) return false

    let startAt = this.context.currentTime
    // Standard crossing signal: long, long, short, long.
    for (const buffer of [firstLong, secondLong, short, firstLong]) {
      const source = this.context.createBufferSource()
      source.buffer = buffer
      source.connect(this.hornGain)
      source.onended = () => this.activeHorns.delete(source)
      this.activeHorns.add(source)
      source.start(startAt)
      startAt += buffer.duration + 0.14
    }
    this.hornUntil = startAt
    return true
  }

  private ensureContext() {
    if (this.context) return this.context

    const context = new AudioContext()
    const master = context.createGain()
    const cityGain = context.createGain()
    const trainGain = context.createGain()
    const trainFilter = context.createBiquadFilter()
    const trainPan = context.createStereoPanner()
    const hornGain = context.createGain()
    const hornFilter = context.createBiquadFilter()
    const hornPan = context.createStereoPanner()

    master.gain.value = 0
    cityGain.gain.value = 0.11
    trainGain.gain.value = 0
    hornGain.gain.value = 0
    trainFilter.type = 'lowpass'
    trainFilter.frequency.value = 650
    trainFilter.Q.value = 0.7
    hornFilter.type = 'lowpass'
    hornFilter.frequency.value = 650
    hornFilter.Q.value = 0.7

    cityGain.connect(master)
    trainGain.connect(trainFilter).connect(trainPan).connect(master)
    hornGain.connect(hornFilter).connect(hornPan).connect(master)
    master.connect(context.destination)

    this.context = context
    this.master = master
    this.cityGain = cityGain
    this.trainGain = trainGain
    this.trainFilter = trainFilter
    this.trainPan = trainPan
    this.hornGain = hornGain
    this.hornFilter = hornFilter
    this.hornPan = hornPan
    return context
  }

  private load() {
    if (this.loading) return this.loading
    const context = this.ensureContext()
    this.loading = Promise.all(
      Object.entries(AUDIO).map(async ([name, url]) => {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Unable to load ${url}`)
        const buffer = await context.decodeAudioData(await response.arrayBuffer())
        this.buffers[name as AudioName] = buffer
      }),
    )
      .then(() => true)
      .catch(() => {
        this.loading = null
        return false
      })
    return this.loading
  }

  private startLoops() {
    if (!this.context || !this.cityGain || !this.trainGain) return

    if (!this.citySource && this.buffers.city) {
      this.citySource = this.context.createBufferSource()
      this.citySource.buffer = this.buffers.city
      this.citySource.loop = true
      this.citySource.connect(this.cityGain)
      this.citySource.start()
    }

    if (!this.trainSource && this.buffers.train) {
      this.trainSource = this.context.createBufferSource()
      this.trainSource.buffer = this.buffers.train
      this.trainSource.loop = true
      this.trainSource.connect(this.trainGain)
      this.trainSource.start()
    }
  }

  private fadeMaster(volume: number) {
    if (!this.context || !this.master) return
    const now = this.context.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setTargetAtTime(volume, now, 0.04)
  }

  private stopHorns() {
    for (const source of this.activeHorns) {
      try {
        source.stop()
      } catch {
        // A source may already have finished between the set iteration and stop.
      }
    }
    this.activeHorns.clear()
    this.hornUntil = 0
  }
}

const cityAudio = new CityAudio()

export const setCityAudioEnabled = (enabled: boolean) => cityAudio.setEnabled(enabled)

export const updateTrainAudio = (pan: number, proximity: number, running: boolean) =>
  cityAudio.updateTrain(pan, proximity, running)

export const playCrossingHorn = (seed: number) => cityAudio.playCrossingHorn(seed)
