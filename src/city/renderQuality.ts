/** Small screens and touch devices keep the city readable without continuous GPU work. */
export const renderQuality = {
  standard: {
    dpr: [1, 2] as [number, number],
    shadows: true,
    antialias: true,
    localLights: true,
    animate: true,
    frameloop: 'always' as const,
  },
  low: {
    dpr: 1,
    shadows: false,
    antialias: false,
    localLights: false,
    animate: false,
    frameloop: 'demand' as const,
  },
}

export type RenderQuality = (typeof renderQuality)[keyof typeof renderQuality]
