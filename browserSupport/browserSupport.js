const CANVAS_BROWSER_SUPPORT_URL = 'https://community.canvaslms.com/docs/DOC-10720-what-are-the-browser-and-computer-requirements-for-canvas';

function validateCanvasSupport() {
  const canvasElement = document.createElement('canvas');
  const isCanvasSupported = !!(canvasElement.getContext && canvasElement.getContext('2d'));
  if (!isCanvasSupported) {
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    const inadequateClientResourcesOverlayText = document.getElementById('inadequate-client-resources-overlay-text');
    inadequateClientResourcesOverlayText.innerHTML = `Your browser does not support the Canvas feature, please update or choose another one from <a href="${CANVAS_BROWSER_SUPPORT_URL}" target="_blank">here</a>`;
    inadequateClientResourcesOverlay.style.display = 'block';
  }
}

export { validateCanvasSupport as default };
