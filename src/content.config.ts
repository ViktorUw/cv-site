// Schemas for everything in src/content/.
// If a YAML file is missing a field or has a typo, the build stops
// and names the file and field, so the site never ships half-filled.
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// Astro sorts entries by id, so list files record each item's position
// and the site shows them in the same order as the YAML file.
const orderedList = (path: string) =>
	file(path, {
		parser: (text) =>
			(parse(text) as Record<string, unknown>[]).map((item, index) => ({
				...item,
				order: index,
			})),
	});
const ordered = { order: z.number() };

// Every record keeps its translated text in `en:` and `pl:` blocks.
const localized = <T extends z.ZodRawShape>(shape: T) =>
	z.object({ en: z.object(shape), pl: z.object(shape) });

const profile = defineCollection({
	loader: glob({ pattern: 'profile.yaml', base: './src/content' }),
	schema: ({ image }) =>
		z
			.object({
				name: z.string(),
				// Path relative to profile.yaml, e.g. ../assets/photo.jpg
				photo: image().optional(),
				// Link to a PDF in public/ (e.g. /cv-en.pdf). Leave empty to hide the button.
				cvUrl: z.string().optional(),
			})
			.extend(
				localized({
					location: z.string(),
					role: z.string(),
					headline: z.string(),
					intro: z.string(),
					photoAlt: z.string(),
					about: z.array(z.string()).min(1),
					seoTitle: z.string(),
					seoDescription: z.string().max(170),
				}).shape,
			),
});

const ui = defineCollection({
	loader: glob({ pattern: 'ui.yaml', base: './src/content' }),
	schema: localized({
		skipToContent: z.string(),
		menu: z.string(),
		nav: z.object({
			about: z.string(),
			process: z.string(),
			projects: z.string(),
			skills: z.string(),
			education: z.string(),
			contact: z.string(),
		}),
		sections: z.object({
			about: z.string(),
			process: z.string(),
			projects: z.string(),
			skills: z.string(),
			education: z.string(),
			contact: z.string(),
		}),
		contactIntro: z.string(),
		flowCaption: z.string(),
		themeToggle: z.string(),
		languageLabel: z.string(),
		downloadCv: z.string(),
		projectLinks: z.object({ code: z.string(), demo: z.string() }),
		plannedBadge: z.string(),
		footer: z.string(),
	}),
});

const flow = defineCollection({
	loader: orderedList('src/content/flow.yaml'),
	schema: z
		.object({
			...ordered,
			kind: z.enum(['trigger', 'step', 'result']),
			tool: z.string(),
		})
		.extend(localized({ label: z.string() }).shape),
});

const process = defineCollection({
	loader: orderedList('src/content/process.yaml'),
	schema: z.object(ordered).extend(localized({ title: z.string(), text: z.string() }).shape),
});

const projects = defineCollection({
	loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
	schema: ({ image }) =>
		z
			.object({
				order: z.number(),
				// planned = shown as "in progress", without links
				status: z.enum(['live', 'planned']).default('live'),
				stack: z.array(z.string()),
				links: z
					.object({ github: z.url().optional(), demo: z.url().optional() })
					.default({}),
				image: image().optional(),
			})
			.extend(localized({ title: z.string(), summary: z.string() }).shape),
});

const skills = defineCollection({
	loader: orderedList('src/content/skills.yaml'),
	schema: z
		.object({ ...ordered, items: z.array(z.string()).min(1) })
		.extend(localized({ title: z.string() }).shape),
});

const education = defineCollection({
	loader: orderedList('src/content/education.yaml'),
	schema: z
		.object({ ...ordered, start: z.string(), end: z.string() })
		.extend(
			localized({
				institution: z.string(),
				degree: z.string(),
				note: z.string().optional(),
			}).shape,
		),
});

const contacts = defineCollection({
	loader: orderedList('src/content/contacts.yaml'),
	schema: z.object({
		...ordered,
		kind: z.enum(['email', 'linkedin', 'github', 'telegram', 'phone', 'other']),
		href: z.string(),
		// What visitors see, e.g. the address or @handle
		label: z.string(),
	}),
});

export const collections = {
	profile,
	ui,
	flow,
	process,
	projects,
	skills,
	education,
	contacts,
};
