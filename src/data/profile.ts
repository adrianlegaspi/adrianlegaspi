import cvVersion from './cvVersion.json'

/**
 * Public contact channels, confirmed against the live site (spec §38). They are
 * published as machine-readable fact in the prerendered JSON-LD, so nothing
 * unverified belongs here.
 *
 * The CV is versioned: `cvVersion.json` is the manifest written by
 * `pnpm cv:generate`, so the link always points at the newest build without
 * anything being renamed by hand.
 */
export const profile = {
  email: 'contacto@legaspi.dev',
  linkedin: 'https://www.linkedin.com/in/adrian-legaspi/',
  github: 'https://github.com/adrianlegaspi',
  x: 'https://x.com/adrianlegaspi_',
  cv: `/cv/${cvVersion.pdf}`,
  cvSizeBytes: cvVersion.pdfSizeBytes,
  site: 'https://legaspi.dev',
} as const
