const fs = require('fs');
const path = require('path');
const pages = ['index.html', 'about.html', 'service.html', 'project.html', 'shop.html', 'contact.html'];
const failures = [];
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#?]+)[^"]*"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|tel:)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(page), target))) failures.push(`${page}: ${target}`);
  }
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${page}: missing title`);
  if (!/meta name="description"/.test(html)) failures.push(`${page}: missing description`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('All public-page local links, assets, titles and descriptions validated.');
}
