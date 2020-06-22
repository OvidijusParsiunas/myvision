let displayingCanvasSupportOverlay = false;
let displayingDimensionsOverlay = false;
const CANVAS_BROWSER_SUPPORT_URL = 'https://community.canvaslms.com/docs/DOC-10720-what-are-the-browser-and-computer-requirements-for-canvas';

function validateClientBrowserDimensions() {
  if (displayingCanvasSupportOverlay) return;
  if (window.innerHeight < 500 || window.innerWidth < 800) {
    if (displayingDimensionsOverlay) return;
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    const inadequateClientResourcesOverlayText = document.getElementById('inadequate-client-resources-overlay-text');
    inadequateClientResourcesOverlayText.innerHTML = 'Minimum window size is 500 x 800';
    inadequateClientResourcesOverlay.style.display = 'block';
    displayingDimensionsOverlay = true;
  } else {
    if (!displayingDimensionsOverlay) return;
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    inadequateClientResourcesOverlay.style.display = 'none';
    displayingDimensionsOverlay = false;
  }
}

function validateCanvasSupport() {
  const canvasElement = document.createElement('canvas');
  const isCanvasSupported = !!(canvasElement.getContext && canvasElement.getContext('2d'));
  if (!isCanvasSupported) {
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    const inadequateClientResourcesOverlayText = document.getElementById('inadequate-client-resources-overlay-text');
    inadequateClientResourcesOverlayText.innerHTML = `Your browser does not support the Canvas feature, please update or choose another one from <a href="${CANVAS_BROWSER_SUPPORT_URL}" target="_blank">here</a>`;
    inadequateClientResourcesOverlay.style.display = 'block';
    displayingCanvasSupportOverlay = true;
  }
}

export { validateClientBrowserDimensions, validateCanvasSupport };
