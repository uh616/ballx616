const fs = require('fs');
const path = require('path');

function main() {
  const distAssetsDir = path.join(__dirname, '..', 'dist', 'assets');
  if (!fs.existsSync(distAssetsDir)) {
    console.error('dist/assets not found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = fs.readdirSync(distAssetsDir);
  const indexJs = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
  if (!indexJs) {
    console.error('index-*.js not found in dist/assets.');
    process.exit(1);
  }

  const jsPath = path.join(distAssetsDir, indexJs);
  const content = fs.readFileSync(jsPath, 'utf8');

  const re = /["']\/(?:ballx616\/)?(images\/[^"']+)["']/g;
  const used = new Set();
  let m;
  while ((m = re.exec(content)) !== null) {
    used.add(m[1]);
  }

  const publicDir = path.join(__dirname, '..', 'public');
  const missing = [];

  for (const rel of used) {
    const filePath = path.join(publicDir, rel.replace(/^images[\\/]/, 'images' + path.sep));
    if (!fs.existsSync(filePath)) {
      missing.push(rel);
    }
  }

  if (!missing.length) {
    console.log('All referenced images exist in public/.');
  } else {
    console.log('Missing images (referenced in dist JS, but not found under public/):');
    for (const rel of missing) {
      console.log(' -', rel);
    }
  }
}

main();


