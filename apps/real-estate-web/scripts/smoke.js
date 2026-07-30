const fs = require('fs');
const path = require('path');

const builtDir = path.join(__dirname, '..', '.next', 'server', 'app');
const checks = [
  { file: 'hostel.html', mustContain: 'Hostel accommodation request' },
  { file: 'register.html', mustContain: 'Create your AY' },
  { file: 'dashboard.html', mustContain: 'Create a listing' },
];

let failed = false;
for (const chk of checks) {
  const p = path.join(builtDir, chk.file);
  if (!fs.existsSync(p)) {
    console.error(`MISSING: ${chk.file} not found at ${p}`);
    failed = true;
    continue;
  }
  const content = fs.readFileSync(p, 'utf8');
  if (!content || content.length < 50) {
    console.error(`EMPTY: ${chk.file} seems empty or too small`);
    failed = true;
    continue;
  }
  if (!content.includes(chk.mustContain)) {
    console.error(`CHECK FAILED: ${chk.file} does not contain expected string: ${chk.mustContain}`);
    // print a short preview to help debugging
    console.error('--- file head preview ---');
    console.error(content.slice(0, 600));
    console.error('--- end preview ---');
    failed = true;
  } else {
    console.log(`OK: ${chk.file} contains expected text`);
  }
}

if (failed) {
  console.error('\nSmoke check FAILED');
  process.exit(2);
}
console.log('\nSmoke check PASSED');
process.exit(0);
