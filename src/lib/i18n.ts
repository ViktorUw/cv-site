import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export const languages = ['en', 'pl'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'en';

type Localized = { en: object; pl: object };

// Flattens a record: shared fields plus the text in the requested language.
export function localize<T extends Localized, L extends Lang>(data: T, lang: L) {
	const { en, pl, ...shared } = data;
	return { ...shared, ...(lang === 'en' ? en : pl) } as Omit<T, Lang> & T[L];
}

export async function getProfile(lang: Lang) {
	const entry = await getEntry('profile', 'profile');
	if (!entry) throw new Error('src/content/profile.yaml is missing');
	return localize(entry.data, lang);
}

export async function getUi(lang: Lang) {
	const entry = await getEntry('ui', 'ui');
	if (!entry) throw new Error('src/content/ui.yaml is missing');
	return entry.data[lang];
}

// List collections are shown in the order of the YAML file.
export async function getList<C extends 'flow' | 'process' | 'skills' | 'education'>(
	collection: C,
	lang: Lang,
) {
	// The cast keeps the exact type of the requested collection instead of a union of all four.
	const entries = (await getCollection(collection)) as CollectionEntry<C>[];
	return entries
		.sort((a, b) => a.data.order - b.data.order)
		.map((entry) => ({ id: entry.id, ...localize(entry.data as CollectionEntry<C>['data'], lang) }));
}

export async function getProjects(lang: Lang) {
	const entries = await getCollection('projects');
	return entries
		.sort((a, b) => a.data.order - b.data.order)
		.map((entry) => ({ id: entry.id, ...localize(entry.data, lang) }));
}

export async function getContacts() {
	const entries = await getCollection('contacts');
	return entries
		.sort((a, b) => a.data.order - b.data.order)
		.map((entry) => ({ id: entry.id, ...entry.data }));
}
