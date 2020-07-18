let displayingDimensionsOverlay = false;

function validateClientBrowserDimensions() {
  if (window.innerHeight < 500 || window.innerWidth < 800) {
    // code to not overwrite the overlay if already shown by browser support module
    const inadequateClientResourcesOverlay = document.getElementById('inadequate-client-resources-overlay');
    if (inadequateClientResourcesOverlay.style.display === 'block') return;
    const inadequateClientResourcesOverlayText = document.getElementById('inadequate-client-resources-overlay-text');
    inadequateClientResourcesOverlayText.innerHTML = 'Minimum window size to use MyVision is 500 x 800 px';
    inadequateClientResourcesOverlayText.style.marginLeft = '-28px';
    inadequateClientResourcesOverlayText.style.maxWidth = 'none';
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
