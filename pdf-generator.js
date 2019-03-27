'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const hogan = require('hogan.js');
// get the currentdirectory and join it to the template
const file = path.join(process.cwd(), 'template.html');

async function createPDF(data){

  // reading the html template file and putting it into a variable
  const templateHtml = fs.readFileSync(file, 'utf8');
  // hogan precompiles your templates into vanilla JS.
  // It's best to serve your templates precompiled whenever you 
  // can (rather than the raw templates), as parsing is the most
  // time consuming operation.
  const template = hogan.compile(templateHtml);
  // pass object data as a parameter and compiles it
  // returns string with the full compiled HTML with the variables filled
  // http://twitter.github.io/hogan.js/
  const html = template.render(data);

  const date = new Date().getTime();

  // name of pdf and it's path, it will just generate the pdf in the current directory
  const pdfPath = (`${data.name}-${date}.pdf`);

  // pdf configurations e.g. the size of the pdf, more can be found here https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  const options = {
    width: '1230px',
    headerTemplate: "<p></p>",
    footerTemplate: "<p></p>",
    displayHeaderFooter: false,
    margin: {
      top: "10px",
      bottom: "30px"
    },
    printBackground: true,
    path: pdfPath
  }

  // start the browser
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });

  // new blank page
  const page = await browser.newPage();
  
  // Pass our compiled HTML String to the page we 
  // just created, causes the HTML String we have to 
  // be opened and rendered by the browser. 
  // The waitUntil command is used so that the page and 
  // all its external dependencies are waited to be loaded, 
  // without this command your pdf may be broken, since
   // external files may not have been loaded yet.
  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: 'networkidle0'
  });

  // generate pdf
  await page.pdf(options);
  console.log(`pdf generated with the name ${pdfPath}`)
  await browser.close();
}

// the object to pass to hogan into the template
const data = {
  title: "A Pdf example",
  date: "26/03/2019",
  name: "Sulthan Ahmed",
  github: "https://github.com/sulthan-ahmed",
  colour: "blue",
  superhero: "batman",
  country: "UK",
  about: "This is a generated pdf using hogan and google puppeteer"
}

createPDF(data);
