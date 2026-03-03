const fs = require('fs');
const file = 'src/app/(public)/sleman-food/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  ['className="pb-20 md:pb-0 explore-page" style={{ background: "var(--cream)", minHeight: "100vh" }}', 'className="pb-20 md:pb-0 explore-page"'],
  ['className="explore-header" style={{ background: "linear-gradient(135deg, #FF9800 0%, #E65100 100%)", paddingTop: \'80px\', paddingBottom: \'32px\' }}', 'className="explore-header"'],
  ['className="explore-title" style={{ color: "rgba(255,255,255,0.8)" }}', 'className="explore-title"'],
  ['className="explore-keyword" style={{ color: "white", border: "none", marginBottom: "10px" }}', 'className="explore-keyword"'],
  ['className="explore-desc" style={{ color: "white" }}', 'className="explore-desc"'],
  ['className="explore-search-bar" style={{ marginTop: "24px" }}', 'className="explore-search-bar"'],
  ['className="explore-stats" style={{ marginTop: "24px" }}', 'className="explore-stats"'],
  ['className="explore-stat" style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "6px 14px", borderRadius: "20px" }}', 'className="explore-stat"'],
  
  // Filter panel
  ['className="filter-header" style={{ background: "#E65100", color: "white", padding: "12px 16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}', 'className="filter-header"'],
  [/className="filter-section" style=\{\{ padding: "12px 16px", borderBottom: "1\.5px solid var\(--cream-dark\)" \}\}/g, 'className="filter-section"'],
  [/<h4 style=\{\{ fontSize: "13px", fontWeight: 800, color: "var\(--text-primary\)", marginBottom: "8px" \}\}>/g, '<h4 className="filter-section-title">'],
  ['className="filter-option" style={{ display: "flex", alignItems: "center", gap: "8px" }}', 'className="filter-option"'],
  
  // Selects
  ['className="sort-select"\n                                            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid var(--cream-dark)", fontSize: "13px" }}', 'className="sort-select sort-select-full"'],
  ['className="sort-select"\n                                    style={{ padding: "8px 12px", border: "1.5px solid var(--cream-dark)", borderRadius: "8px", fontSize: "13px", background: "white", outline: "none" }}', 'className="sort-select"'],
  
  // Checkboxes
  [/className="filter-option" style=\{\{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0", cursor: "pointer" \}\}/g, 'className="filter-option"'],
  [/style=\{\{ width: "16px", height: "16px", cursor: "pointer" \}\}/g, 'className="filter-checkbox"'],
  [/<span style=\{\{ fontSize: "13px", color: "var\(--text-secondary\)", fontWeight: 500 \}\}>/g, '<span className="filter-label-text">'],
  
  // Prices
  ['className="price-range" style={{ display: "flex", flexDirection: "column", gap: "8px" }}', 'className="price-range"'],
  [/className="price-input-wrap" style=\{\{ display: "flex", alignItems: "center", gap: "8px" \}\}/g, 'className="price-input-wrap"'],
  [/<span style=\{\{ fontSize: "12px", color: "var\(--text-muted\)", width: "30px" \}\}>/g, '<span className="price-input-label">'],
  [/className="price-input"\n.*style=\{\{ flex: 1, padding: "6px 10px", border: "1.5px solid var\(--cream-dark\)", borderRadius: "6px", fontSize: "13px" \}\}/g, 'className="price-input"'],
  
  // Reset
  ['style={{ width: "100%", padding: "8px", background: "white", border: "1.5px solid var(--terracotta)", color: "var(--terracotta)", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}', 'className="btn-reset-filter"'],
  
  // Layout main panel
  ['style={{ minWidth: 0, flex: 1 }}', 'className="explore-main-content"'],
  ['className="sort-bar" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}', 'className="sort-bar"'],
  ['<label style={{ fontSize: "13px", color: "var(--text-muted)" }}>', '<label className="sort-label">'],
  ['className="result-count" style={{ marginLeft: "auto", fontSize: "13px", color: "var(--text-muted)" }}', 'className="result-count"'],
  
  // Products
  ['className="product-grid-lg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}', 'className="product-grid-lg"'],
  ['className={`product-card-lg ${isClosed ? \'is-closed\' : \'\'}`}\n                                            style={{\n                                                textDecoration: "none",\n                                                display: "flex",\n                                                flexDirection: "column",\n                                                background: "white",\n                                                borderRadius: "16px",\n                                                border: "1.5px solid var(--cream-dark)",\n                                                overflow: "hidden",\n                                                height: "100%"\n                                            }}', 'className={`product-card-lg ${isClosed ? \'is-closed\' : \'\'}`}\n'],
  ['className="product-img-lg" style={{ position: \'relative\', height: \'200px\', flexShrink: 0, background: \'var(--cream-dark)\' }}', 'className="product-img-lg"'],
  ['style={{ fontSize: \'40px\', width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}', 'className="product-img-placeholder"'],
  ['style={{ objectFit: \'cover\', filter: isClosed ? \'grayscale(100%) brightness(0.72)\' : \'none\' }}', 'className="product-img-main"'],
  ['className="promo-tag" style={{ position: \'absolute\', top: 0, left: 0, background: \'linear-gradient(135deg, #e53935, #c62828)\', color: \'white\', fontSize: \'11px\', fontWeight: 800, padding: \'5px 14px 5px 9px\', clipPath: \'polygon(0 0, 100% 0, 85% 100%, 0 100%)\' }}', 'className="promo-tag"'],
  ['className="closed-overlay" style={{ position: \'absolute\', inset: 0, background: \'rgba(0,0,0,0.42)\', display: \'flex\', flexDirection: \'column\', alignItems: \'center\', justifyContent: \'center\' }}', 'className="closed-overlay"'],
  ['className="closed-badge" style={{ background: \'rgba(0,0,0,0.78)\', color: \'white\', fontSize: \'12px\', fontWeight: 800, padding: \'5px 14px\', borderRadius: \'20px\', border: \'1.5px solid rgba(255,255,255,0.25)\' }}', 'className="closed-badge"'],
  
  ['className="product-body-lg" style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}', 'className="product-body-lg"'],
  ['className="product-name-lg" style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}', 'className="product-name-lg"'],
  ['className="product-shop-lg" style={{ fontSize: \'11px\', color: \'var(--text-muted)\', display: \'flex\', alignItems: \'center\', gap: \'4px\', marginBottom: \'12px\' }}', 'className="product-shop-lg"'],
  ['style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--cream-dark)", paddingTop: "12px" }}', 'className="product-action-lg"'],
  ['className="price-main" style={{ fontSize: \'16px\', fontWeight: 800, color: \'var(--terracotta)\' }}', 'className="price-main"'],
  ['className="sold-row" style={{ fontSize: \'11px\', color: \'var(--text-muted)\', marginTop: \'4px\', display: \'flex\', alignItems: \'center\', gap: \'3px\' }}', 'className="sold-row"'],
  ['<span style={{ color: "#F1C40F", fontSize: "12px" }}>', '<span className="star-icon">'],
  ['<span style={{ fontWeight: 700, color: "var(--text-primary)" }}>', '<span className="rating-text">'],
  
  // WA Button (removing styles)
  ['style={isClosed ? { background: \'#bbb\', boxShadow: \'none\', cursor: \'not-allowed\', width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", color: "white" } : { background: \'#25D366\', boxShadow: \'0 2px 8px rgba(37,211,102,0.3)\', cursor: \'pointer\', width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", color: "white" }}', ''],
  
  // Load More Button
  ['style={{ padding: \'12px 32px\', fontWeight: 700, background: \'white\', border: \'1.5px solid var(--cream-dark)\', borderRadius: \'50px\', cursor: \'pointer\', color: \'var(--text-secondary)\' }}', 'className="btn-load-more"'],
];

replacements.forEach(([find, replace], i) => {
  if (content.includes(find) || (find instanceof RegExp && content.match(find))) {
    content = content.replace(find, replace);
    console.log(`[OK] Replacement ${i} done`);
  } else {
    console.log(`[FAIL] Replacement ${i} not found:`, find instanceof RegExp ? find.toString() : find.slice(0, 50) + "...");
  }
});

fs.writeFileSync(file, content, 'utf8');
console.log("Done");
