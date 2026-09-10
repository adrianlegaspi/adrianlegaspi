import cvVersion from './cvVersion.json'

/**
 * Public contact channels. The email, handles and location are still
 * placeholders (spec §38) — Adrian has to confirm them before publication.
 *
 * The CV is real: `cvVersion.json` is the manifest written by
 * `pnpm cv:generate`, so the link always points at the newest build without
 * anything being renamed by hand.
 */
export const profile = {
  placeholder: true,
  email: 'hello@legaspi.dev',
  linkedin: 'https://www.linkedin.com/in/adrian-legaspi/',
  github: 'https://github.com/adrianlegaspi',
  cv: `/cv/${cvVersion.pdf}`,
  site: 'https://legaspi.dev',
} as const
