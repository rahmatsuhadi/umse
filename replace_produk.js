const fs = require('fs');

function replaceInFile(file, replacements) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    replacements.forEach(([find, replace], i) => {
        const isMatch = (typeof find === 'string' && content.includes(find)) || (find instanceof RegExp && content.match(find));
        if (isMatch) {
            content = content.replace(find, replace);
            console.log(`[OK] ${file} Replacement ${i}`);
        } else {
            console.log(`[FAIL] ${file} Replacement ${i}`);
        }
    });
    // clean up empty style tags
    content = content.replace(/ style=\{\{\s*\}\}/g, '');
    content = content.replace(/ style=\{\s*\}/g, '');
    fs.writeFileSync(file, content, 'utf8');
}

// produk/page.tsx
replaceInFile('src/app/(public)/produk/page.tsx', [
  ['style={{ background: "var(--cream)" }}', 'className="bg-cream"'],
  ['style={{ color: "rgba(255,255,255,0.85)" }}', 'className="text-white-85"'],
  [/style=\{\{\s*display:\s*"flex",\s*alignItems:\s*"center",\s*gap:\s*"8px",\s*flexWrap:\s*"wrap"\s*\}\}/g, 'className="flex-center-wrap gap-8"'],
  [/style=\{\{\s*flexWrap:\s*"wrap"\s*\}\}/g, 'className="flex-wrap"'],
  [/style=\{\{\s*fontSize:\s*"13px",\s*color:\s*"var\(--text-muted\)",\s*fontWeight:\s*600\s*\}\}/g, 'className="text-muted fw-600 font-13"'],
  [/style=\{\{\s*display:\s*"flex",\s*alignItems:\s*"center",\s*gap:\s*"8px"\s*\}\}/g, 'className="flex-center gap-8"'],
  [/style=\{\{\s*fontSize:\s*"13px"\s*\}\}/g, 'className="font-13"'],
  [/style=\{\{\s*cursor:\s*'pointer'\s*\}\}/g, 'className="cursor-pointer"'],
  [/style=\{\{\s*objectFit:\s*'cover'\s*\}\}/g, 'className="object-cover"'],
  [/style=\{\{\s*fontSize:\s*'40px'\s*\}\}/g, 'className="font-40"'],
  [/style=\{\{\s*fontSize:\s*'11px',\s*color:\s*'var\(--text-muted\)',\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'4px',\s*marginBottom:\s*'8px'\s*\}\}/g, 'className="product-shop-info"'],
  [/style=\{\{\s*fontSize:\s*'16px',\s*fontWeight:\s*800,\s*color:\s*'var\(--terracotta\)'\s*\}\}/g, 'className="price-main-lg"'],
  [/style=\{\{\s*fontSize:\s*'11px',\s*color:\s*'var\(--text-muted\)',\s*marginTop:\s*'2px',\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'3px'\s*\}\}/g, 'className="sold-row-sm"'],
  [/style=\{\{\s*color:\s*"#F1C40F",\s*fontSize:\s*"12px"\s*\}\}/g, 'className="star-icon"'],
  [/style=\{\{\s*fontWeight:\s*700,\s*color:\s*"var\(--text-primary\)"\s*\}\}/g, 'className="rating-text"'],
  [/style=\{\{\s*gridColumn:\s*'1\/-1',\s*textAlign:\s*'center',\s*padding:\s*'60px',\s*color:\s*'var\(--text-muted\)'\s*\}\}/g, 'className="empty-state-msg"'],
  [/style=\{\{\s*textAlign:\s*"center",\s*marginTop:\s*"40px"\s*\}\}/g, 'className="mt-40 text-center"'],
  [/style=\{\{\s*padding:\s*'12px 32px',\s*fontWeight:\s*700,\s*background:\s*'white'\s*\}\}/g, 'className="btn-load-more"'],
  [/style=\{\{\s*paddingBottom:\s*"60px"\s*\}\}/g, 'className="pb-60"'],
]);

// produk/[id]/page.tsx
replaceInFile('src/app/(public)/produk/[id]/page.tsx', [
  ['style={{ background: \'var(--cream)\', minHeight: \'100vh\' }}', 'className="page-bg-cream"'],
  [/style=\{\{\s*textDecoration:\s*'none'\s*\}\}/g, 'className="no-underline"'],
  ['style={{ background: \'var(--cream)\', borderTop: \'1px solid var(--cream-dark)\' }}', 'className="product-detail-footer"'],
  ['style={{ background: \'white\', paddingTop: \'40px\' }}', 'className="bg-white pt-40"'],
  ['style={{ maxWidth: \'1200px\', margin: \'0 auto\', padding: \'0 20px\' }}', 'className="container-1200"'],
  ['style={{ display: \'flex\', alignItems: \'center\', justifyContent: \'space-between\', marginBottom: \'20px\' }}', 'className="flex-between mb-20"'],
  ['style={{ fontSize: \'22px\' }}', 'className="font-22"'],
  ['style={{ width: \'100%\', height: \'100%\', objectFit: \'cover\' }}', 'className="w-full h-full object-cover"']
]);

// panduan-pembeli/page.tsx
replaceInFile('src/app/(public)/panduan-pembeli/page.tsx', [
  ['style={{ display: "block" }}', '']
]);

// panduan-merchant/page.tsx
replaceInFile('src/app/(public)/panduan-merchant/page.tsx', [
  ['style={{ display: "block" }}', ''],
  ['style={{ background: "#E2F0D4" }}', 'className="bg-green-light"']
]);

// faq/page.tsx
replaceInFile('src/app/(public)/faq/page.tsx', [
  [/style=\{\{\s*textAlign:\s*"center",\s*padding:\s*"40px",\s*color:\s*"var\(--text-muted\)"\s*\}\}/g, 'className="empty-state-msg"']
]);

console.log("Doneproduk");
