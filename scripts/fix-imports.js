const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript files
const findFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  
  return results;
};

// Fix imports in a file
const fixImports = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace @/lib/db with @/lib/prisma
  content = content.replace(/from ['"]@\/lib\/db['"]/g, 'from \'@/lib/prisma\'');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in ${filePath}`);
  }
};

// Main function
const main = () => {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findFiles(srcDir);
  
  files.forEach(fixImports);
  console.log('Import fixes completed!');
};

main(); 