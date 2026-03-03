const fs = require("fs");
const files = [
  "src/app/(public)/explore/page.tsx",
  "src/app/(public)/sleman-food/page.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  
  // Revert back from align-right attempts and establish standard HTML flex behavior for labels
  content = content.replace(
      `<span className="explore-toggle-slider" />`,
      `<span className="explore-toggle-slider" style={{ left: openNow ? "calc(100% - 18px)" : "2px" }} />`
  );
  
  // Revert for explore page specifically with different checking property
  content = content.replace(
      `<span className="explore-toggle-slider"></span>`,
      `<span className="explore-toggle-slider" style={{ left: isOpenNow ? "calc(100% - 18px)" : "2px" }}></span>`
  );
  
  fs.writeFileSync(file, content);
}
