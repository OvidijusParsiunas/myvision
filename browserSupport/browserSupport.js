const CANVAS_BROWSER_SUPPORT_URL = 'https://community.canvaslms.com/docs/DOC-10720-what-are-the-browser-and-computer-requirements-for-canvas';
const CHROMIUM_SUPPORT_URL = 'https://www.zdnet.com/pictures/all-the-chromium-based-browsers/';
let displayingBrowserSupportOverlay = false;

function validateBrowserType() {
  const agent = navigator.userAgent;
  if ((agent.toLowerCase().indexOf('chrome') > -1 && agent.indexOf('Edge') === -1) || agent.toLowerCase().indexOf('firefox') > -1) return;
  const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
  const inadequateClientResourcesOverlayText = document.getElementById('inadequate-client-resources-overlay-text');
  inadequateClientResourcesOverlayText.innerHTML = `Please switch to a <a href="${CHROMIUM_SUPPORT_URL}" target="_blank">Chromium</a> based browser or Firefox`;
  inadequateClientResourcesOverlayText.style.marginTop = '32px';
  inadequateClientResourcesOverlayText.style.maxWidth = 'none';
  inadequateClientResourcesOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  displayingBrowserSupportOverlay = true;
}

function validateCanvasSupport() {
  if (displayingBrowserSupportOverlay) return;
  const canvasElement = document.createElement('canvas');
  const isCanvasSupported = !!(canvasElement.getContext && canvasElement.getContext('2d'));
  if (!isCanvasSupported) {
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    const inadequateClientResourcesOverlayText = document.getElementById('inadequate-client-resources-overlay-text');
    inadequateClientResourcesOverlayText.innerHTML = `Your browser does not support the Canvas feature, please update or choose another one from <a href="${CANVAS_BROWSER_SUPPORT_URL}" target="_blank">here</a>`;
    inadequateClientResourcesOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

export { validateBrowserType, validateCanvasSupport };
