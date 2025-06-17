/**
 * Script to convert Markdown CV files to PDF
 */
const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);

// Create a temporary CSS file for styling
const tempCssPath = path.join(__dirname, 'cv-style.css');
const cssContent = `
/* Página completa para PDF/impresión */
@page {
  size: A4;
  margin: 10mm 10mm; /* top/bottom 12 ‒ sides 15 */
}

body {
  font-family: 'IBM Plex Mono', monospace;
  margin: 0;               /* el margen real lo maneja @page */
  color: #040005;
  font-size: 11.5pt;
  line-height: 1.6;
}

a {
  color: #2E4730;
  text-decoration: none;
}

h1 {
  font-size: 20pt;
  margin: 0 0 0.5rem 0;
}

h2 {
  font-size: 14pt;
  border-bottom: 1px solid #2E4730;
  padding-bottom: 0.2rem;
  margin: 2.2rem 0 1rem 0;
}

h3 {
  font-size: 12pt;
  margin: 1.1rem 0 0.4rem 0;
}

hr {
  border: none;
  border-top: 1px dashed #888;
  margin: 16px 0;
}

ul {
  margin: 0;
  padding-left: 18px;
}

section {
  margin-bottom: 1.3rem;
}
`;

// Configuration for PDF generation
const pdfOptions = {
  pdf_options: {
    format: 'A4',
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    },
    printBackground: true
  }
};

/**
 * Convert a single markdown file to PDF
 * @param {string} mdFilePath Path to markdown file
 */
async function convertToPdf(mdFilePath) {
  const baseName = path.basename(mdFilePath, '.md');
  const outputPath = path.join(path.dirname(mdFilePath), `${baseName}.pdf`);
  
  try {
    console.log(`Converting ${mdFilePath} to PDF...`);
    await mdToPdf(
      { path: mdFilePath },
      { 
        ...pdfOptions, 
        dest: outputPath,
        stylesheet: tempCssPath 
      }
    );
    console.log(`✅ Successfully created ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error converting ${mdFilePath}:`, error.message);
  }
}

/**
 * Process the CV directory and convert all markdown files
 */
async function processCvFiles() {
  const cvDir = path.join(__dirname, '..', 'public', 'cv');
  
  try {
    // Write CSS file first
    console.log('Creating CV styles...');
    await writeFile(tempCssPath, cssContent);
    console.log('CSS styles created successfully.');
    
    console.log('Scanning for CV markdown files...');
    const files = await readdir(cvDir);
    
    let mdFiles = [];
    
    for (const file of files) {
      const filePath = path.join(cvDir, file);
      const fileStat = await stat(filePath);
      
      if (fileStat.isFile() && path.extname(file).toLowerCase() === '.md') {
        mdFiles.push(filePath);
      }
    }
    
    if (mdFiles.length === 0) {
      console.log('No markdown files found in the CV directory.');
      return;
    }
    
    console.log(`Found ${mdFiles.length} markdown files to convert.`);
    
    // Process each file
    for (const mdFile of mdFiles) {
      await convertToPdf(mdFile);
    }
    
    // Clean up temporary CSS file
    try {
      fs.unlinkSync(tempCssPath);
      console.log('Temporary CSS file removed.');
    } catch (err) {
      console.log('Could not remove temporary CSS file:', err.message);
    }
    
    console.log('All CV files processed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error processing CV files:', error.message);
    process.exit(1);
  }
}

// Run the script
processCvFiles();
