let displayingDimensionsOverlay = false;

function validateClientBrowserDimensions() {
  if (window.innerHeight < 500 || window.innerWidth < 800) {
    if (displayingDimensionsOverlay) return;
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    const inadequateClientResourcesOverlayText = document.getElementById('inadequate-client-resources-overlay-text');
    inadequateClientResourcesOverlayText.innerHTML = 'Minimum window size for this tool is 500 x 800';
    inadequateClientResourcesOverlayText.style.marginLeft = '-28px';
    inadequateClientResourcesOverlay.style.display = 'block';
    displayingDimensionsOverlay = true;
  } else {
    if (!displayingDimensionsOverlay) return;
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    inadequateClientResourcesOverlay.style.display = 'none';
    displayingDimensionsOverlay = false;
  }
}

export { validateClientBrowserDimensions as default };
