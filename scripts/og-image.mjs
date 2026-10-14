// Generates the link-preview images (public/og-en.png, public/og-pl.png)
// from src/content/profile.yaml and the photo, using headless Chrome.
// Run after changing your name, role, headline or photo:
//   npm run og
// Set CHROME=/path/to/chrome if Chrome isn't found as `google-chrome`.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const profile = parse(readFileSync(join(root, 'src/content/profile.yaml'), 'utf8'));
const chrome = process.env.CHROME ?? 'google-chrome';
const font = pathToFileURL(
	join(root, 'node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-ext-wght-normal.woff2'),
);
const fontLatin = pathToFileURL(
	join(root, 'node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2'),
);
const photo = profile.photo
	? pathToFileURL(resolve(join(root, 'src/content'), profile.photo)).href
	: null;

const escape = (text) =>
	text.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

const page = (lang) => {
	const text = profile[lang];
	return `<!doctype html>
<html lang="${lang}">
<meta charset="utf-8">
<style>
	@font-face { font-family: S; src: url(${fontLatin}) format('woff2'); font-weight: 400 900; }
	@font-face { font-family: S; src: url(${font}) format('woff2'); font-weight: 400 900;
		unicode-range: U+0100-02BA, U+1E00-1EFF; }
	* { margin: 0; box-sizing: border-box; }
	body { width: 1200px; height: 630px; background: #eef1f4; color: #1b2330;
		font-family: S, sans-serif; display: flex; padding: 72px; gap: 64px; }
	.text { flex: 1; display: flex; flex-direction: column; }
	.name { font-size: 30px; font-weight: 600; letter-spacing: -0.01em; }
	.role { margin-top: 6px; font-size: 24px; color: #5b6675; }
	h1 { margin-top: auto; font-size: 54px; line-height: 1.12; font-weight: 600;
		letter-spacing: -0.025em; text-wrap: balance; }
	.flow { margin-top: 44px; display: flex; align-items: center; }
	.node { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #9aa5b4; background: #f8fafc; }
	.node:last-child { border-color: #2b59c3; background: #2b59c3; }
	.link { width: 72px; height: 2px; background: #c9d1db; }
	img { width: 340px; height: 486px; object-fit: cover; border-radius: 16px; border: 1px solid #c9d1db; }
</style>
<body>
	<div class="text">
		<p class="name">${escape(profile.name)}</p>
		<p class="role">${escape(text.role)}</p>
		<h1>${escape(text.headline)}</h1>
		<div class="flow"><span class="node"></span><span class="link"></span><span class="node"></span><span class="link"></span><span class="node"></span><span class="link"></span><span class="node"></span></div>
	</div>
	${photo ? `<img src="${photo}" alt="">` : ''}
</body>
</html>`;
};

const work = mkdtempSync(join(tmpdir(), 'og-'));
try {
	for (const lang of ['en', 'pl']) {
		const html = join(work, `${lang}.html`);
		writeFileSync(html, page(lang));
		const out = join(root, 'public', `og-${lang}.png`);
		execFileSync(chrome, [
			'--headless=new',
			'--disable-gpu',
			'--hide-scrollbars',
			'--allow-file-access-from-files',
			`--user-data-dir=${join(work, 'profile')}`,
			'--window-size=1200,630',
			'--virtual-time-budget=2000',
			`--screenshot=${out}`,
			pathToFileURL(html).href,
		], { stdio: 'ignore' });
		console.log(`Wrote public/og-${lang}.png`);
	}
} finally {
	rmSync(work, { recursive: true, force: true });
}
