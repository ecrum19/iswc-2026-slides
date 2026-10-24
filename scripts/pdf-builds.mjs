// Exports the deck as a PDF with one page per build step, so paging through
// it replays the slides' reveals. `npm run pdf` prints one page per slide
// with every step shown at once instead.
//
// Usage: npm run pdf:builds [-- --output file.pdf]   (default: slides.pdf)
// Needs Google Chrome (or set CHROME_PATH) and Ghostscript (`gs`) to merge
// the pages, plus a network connection for the web fonts. The pages are built
// in a temporary folder; only the merged PDF is written to the repository.

import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
// Installed with @shower/cli, which uses it for `npm run pdf`.
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDTH = 1600;
const HEIGHT = 900;
// Longest transition: a build's delayed parts fade in over .75s + .45s.
const SETTLE_MS = 1600;

const outputArg = process.argv.indexOf('--output');
const OUTPUT = path.resolve(ROOT, outputArg > -1 ? process.argv[outputArg + 1] : 'slides.pdf');

const CHROME_CANDIDATES = [
	process.env.CHROME_PATH,
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/Applications/Chromium.app/Contents/MacOS/Chromium',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium',
	'/usr/bin/chromium-browser',
];

// The live results-explorer figures are swapped for their static images, as
// in the deck's print styles, so the PDF does not depend on the live site.
const STATIC_FIGURES = `
	.live-frame, .live-panel { display: none !important; }
	.live-fallback { display: block !important; }
	.interactive-shell--complexity, .interactive-shell--heatmap { grid-template-columns: 1fr; }
	.static-figure img { height: 260px; }
	.interactive-shell--heatmap .static-figure img { height: 310px; }
`;

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
};

// A minimal static server, so the deck loads over http as it does when hosted.
function serve(root) {
	const server = createServer(async (req, res) => {
		const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
		const file = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
		if (path.relative(root, file).startsWith('..')) {
			res.writeHead(403).end();
			return;
		}
		try {
			const body = await readFile(file);
			res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream' });
			res.end(body);
		} catch {
			res.writeHead(404).end();
		}
	});
	return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const executablePath = CHROME_CANDIDATES.find((p) => p && existsSync(p));
if (!executablePath) {
	console.error('Chrome not found. Install Google Chrome or set CHROME_PATH to a Chrome or Chromium binary.');
	process.exit(1);
}

const server = await serve(ROOT);
const tmp = await mkdtemp(path.join(tmpdir(), 'slides-builds-'));
const browser = await puppeteer.launch({ executablePath, defaultViewport: { width: WIDTH, height: HEIGHT } });

let cleanedUp = false;
const cleanUp = async () => {
	if (cleanedUp) return;
	cleanedUp = true;
	await browser.close();
	server.close();
	await rm(tmp, { recursive: true, force: true });
};
// Stopping the export with Ctrl+C also removes the temporary pages.
process.once('SIGINT', () => cleanUp().finally(() => process.exit(130)));

try {
	const page = await browser.newPage();
	// Print with the screen styles: the print styles show every build at once.
	await page.emulateMediaType('screen');
	await page.goto(`http://127.0.0.1:${server.address().port}/index.html?full`, { waitUntil: 'networkidle0' });
	await page.addStyleTag({ content: STATIC_FIGURES });
	await page.evaluate(() => document.fonts.ready);
	await page.evaluate(() => window.shower.first());

	// The current slide and how many of its build steps are showing.
	const state = () => page.evaluate(() => {
		const slide = document.querySelector('.slide.active');
		return `${slide.id}|${slide.querySelectorAll('.next.active, .next.visited').length}`;
	});
	const settle = async () => {
		await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
		await page.waitForFunction(() => [...document.querySelectorAll('.slide.active img')].every((img) => img.complete));
	};

	const pages = [];
	let current = null;
	await settle();
	for (;;) {
		current = await state();
		const file = path.join(tmp, `page-${String(pages.length + 1).padStart(3, '0')}.pdf`);
		await page.pdf({
			path: file,
			width: `${WIDTH}px`,
			height: `${HEIGHT}px`,
			margin: { top: 0, right: 0, bottom: 0, left: 0 },
			printBackground: true,
			pageRanges: '1',
		});
		pages.push(file);
		process.stdout.write(`\rPrinted ${pages.length} pages (${current.replace('|', ', step ')})   `);

		await page.evaluate(() => window.shower.next());
		await settle();
		if (await state() === current) break;
	}
	process.stdout.write('\n');

	// Merge the pages; Ghostscript keeps the text, vector graphics and links.
	// It writes into the temporary folder, so a failed merge never leaves a
	// partial PDF behind; only the finished file is copied out.
	const merged = path.join(tmp, 'merged.pdf');
	await promisify(execFile)('gs', [
		'-q', '-dBATCH', '-dNOPAUSE', '-dSAFER',
		'-sDEVICE=pdfwrite', '-dAutoRotatePages=/None',
		'-dDownsampleColorImages=false', '-dDownsampleGrayImages=false', '-dDownsampleMonoImages=false',
		`-sOutputFile=${merged}`,
		...pages,
	]).catch((error) => {
		throw new Error(error.code === 'ENOENT' ? 'Ghostscript (gs) not found; install it to merge the pages.' : error.message);
	});
	await copyFile(merged, OUTPUT);
	console.log(`Wrote ${pages.length} pages to ${path.relative(ROOT, OUTPUT)}`);
} finally {
	await cleanUp();
}
