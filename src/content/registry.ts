import { z } from 'zod'
import { isBuildingAssetId, type BuildingAssetId } from '@/city/assets'
import { parseFrontmatter } from './frontmatter'
import { locales, type Locale } from '@/i18n'

/** A building placed on the city grid. Shared by projects, landmarks and decoration. */
export const placementSchema = z.object({
  model: z.string().refine(isBuildingAssetId, 'unknown building asset id'),
  grid: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
  footprint: z.tuple([z.number().int().positive(), z.number().int().positive()]).default([1, 1]),
  rotation: z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]).default(0),
  scale: z.number().positive().default(1),
})

export type Placement = z.output<typeof placementSchema> & { model: BuildingAssetId }

const link = z.union([z.url(), z.null()]).default(null)

const mediaItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
})

const projectConfigSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'id must be kebab-case'),
  status: z.enum(['published', 'draft']),
  type: z.enum(['professional', 'personal', 'client', 'unreleased']),
  featured: z.boolean().default(false),
  // Confidentiality is never inferred. Every project states it (spec §39).
  confidential: z.boolean(),
  dates: z.object({ start: z.string(), end: z.string().nullable() }),
  building: placementSchema,
  technologies: z.array(z.string()),
  links: z
    .object({ website: link, github: link, demo: link, appStore: link, playStore: link, npm: link })
    .default({
      website: null,
      github: null,
      demo: null,
      appStore: null,
      playStore: null,
      npm: null,
    }),
  media: z.array(mediaItemSchema).default([]),
  icon: z.string().optional(),
})

const docSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().optional(),
  label: z.string().optional(),
  company: z.string().optional(),
  placeholder: z.boolean().default(false),
})

export type ProjectConfig = z.output<typeof projectConfigSchema>
export type Doc = z.output<typeof docSchema> & { body: string }
export type Project = ProjectConfig & {
  building: Placement
  docs: Record<Locale, Doc>
}

const configModules = import.meta.glob<unknown>('./projects/*/project.json', {
  eager: true,
  import: 'default',
})
const docModules = import.meta.glob<string>('./projects/*/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const folderOf = (path: string) => path.split('/')[2]

/** Fatal content problems. Thrown in development so a bad entry cannot ship invisibly. */
export const contentErrors: string[] = []
/** Recoverable problems, such as a missing translation that falls back to English. */
export const contentWarnings: string[] = []

function readDoc(folder: string, locale: Locale): Doc | null {
  const raw = docModules[`./projects/${folder}/${locale}.md`]
  if (raw === undefined) return null
  const { data, body } = parseFrontmatter(raw)
  const parsed = docSchema.safeParse(data)
  if (!parsed.success) {
    contentErrors.push(
      `${folder}/${locale}.md: ${parsed.error.issues.map((i) => i.message).join('; ')}`,
    )
    return null
  }
  return { ...parsed.data, body }
}

function buildRegistry(): Project[] {
  const seen = new Set<string>()
  const projects: Project[] = []

  for (const [path, config] of Object.entries(configModules)) {
    const folder = folderOf(path)
    const parsed = projectConfigSchema.safeParse(config)
    if (!parsed.success) {
      contentErrors.push(
        `${folder}/project.json: ${parsed.error.issues
          .map((i) => `${i.path.join('.')} ${i.message}`)
          .join('; ')}`,
      )
      continue
    }
    if (parsed.data.id !== folder) {
      contentErrors.push(
        `${folder}/project.json: id "${parsed.data.id}" must match its folder name`,
      )
      continue
    }
    if (seen.has(folder)) {
      contentErrors.push(`duplicate project id "${folder}"`)
      continue
    }
    seen.add(folder)

    const english = readDoc(folder, 'en')
    if (!english) {
      contentErrors.push(`${folder}: en.md is required`)
      continue
    }
    const docs = { en: english } as Record<Locale, Doc>
    for (const locale of locales) {
      if (locale === 'en') continue
      const doc = readDoc(folder, locale)
      if (doc) docs[locale] = doc
      else {
        contentWarnings.push(`${folder}: ${locale}.md missing, falling back to English`)
        docs[locale] = english
      }
    }

    projects.push({ ...parsed.data, building: parsed.data.building as Placement, docs })
  }

  return projects.sort((a, b) => {
    const aEnd = a.dates.end
    const bEnd = b.dates.end
    if (aEnd === null || bEnd === null) {
      if (aEnd === null && bEnd === null)
        return b.dates.start.localeCompare(a.dates.start) || a.id.localeCompare(b.id)
      return aEnd === null ? -1 : 1
    }
    return bEnd.localeCompare(aEnd) || a.id.localeCompare(b.id)
  })
}

export const allProjects = buildRegistry()

/** Projects that get a building and a route. */
export const projects = allProjects.filter((p) => p.status === 'published')

export const projectById = (id: string | null | undefined) =>
  id ? projects.find((p) => p.id === id) : undefined

export const doc = (project: Project, locale: Locale) => project.docs[locale] ?? project.docs.en

if (contentWarnings.length) console.warn('[content]', contentWarnings.join('\n'))
if (contentErrors.length) {
  if (import.meta.env.DEV) throw new Error(`Invalid project content:\n${contentErrors.join('\n')}`)
  console.error('[content]', contentErrors.join('\n'))
}
if (import.meta.env.PROD && projects.some((p) => p.docs.en.placeholder)) {
  console.warn('[content] published projects still contain placeholder copy')
}
