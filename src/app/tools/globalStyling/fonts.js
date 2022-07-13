import IS_FIREFOX from '../utils/browserType';

function loadSuccess() {
}

function loadFailed() {
  console.error('Failed to load custom fonts');
}

// fix for a bug where the loading of the script would stop all elements from being
// dynamic and the browser would not render them when screen dimensions are changed
function firefoxBugFix(document, url, relationship) {
  const div = document.createElement('div');
  div.innerHTML = `<link rel="${relationship}" href="${url}">`;
  document.head.appendChild(div);
}

function downloadFonts() {
  // potential alternative
  // <link href="https://fonts.googleapis.com/css?family=Alef|Archivo|Average|Barlow+Semi+Condensed|Basic|Cantarell|Chivo|Hind+Madurai|IBM+Plex+Serif|K2D|M+PLUS+1p|Mada|Palanquin|Pavanam|Source+Sans+Pro|Yantramanav&display=swap" rel="stylesheet">
  const url = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap';
  const relationship = 'stylesheet';
  const link = document.createElement('link');
  link.onload = loadSuccess;
  link.onerror = loadFailed;
  link.rel = relationship;
  link.href = url;
  document.head.appendChild(link);
  if (IS_FIREFOX) firefoxBugFix(document, url, relationship);
}

export { downloadFonts as default };
