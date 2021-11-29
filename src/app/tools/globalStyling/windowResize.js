import { resizeCanvasAndImage, resizeCanvas, getCurrentImage } from '../imageList/uploadImages/drawImageOnCanvas.js';
import { resizeAllObjectsDimensionsByDoubleScale } from '../../canvas/objects/objectsProperties/changeProperties.js';
import labelProperies from '../../canvas/objects/label/properties.js';
import { zoomCanvas } from '../toolkit/buttonClickEvents/facadeWorkers/zoomWorker.js';
import {
  getSettingsPopupOpenState, getExportDatasetsPopupOpenState,
  getCurrentZoomState, getBoundingBoxCrosshairDropdownOpenState,
} from '../state.js';
import { validateFullLabellerModalVisibile } from '../labellerModal/style.js';
import { setStickySettingsPopupProperties } from '../settingsPopup/style.js';
import { setStickyExportDatasetsPopupProperties } from '../exportDatasetsPopup/style.js';
import validateClientBrowserDimensions from './inadequateResourcesOverlay.js';
import { setStickyBoundingBoxCrosshairDropdownProperties } from '../settingsPopup/options/boundingBoxCrosshairDropdown/style.js';

let canvas = null;

window.windowResize = () => {
  validateClientBrowserDimensions();
  if (getCurrentZoomState() > 1) {
    resizeCanvas();
    zoomCanvas(canvas, null, true);
  } else if (getCurrentImage()) {
    const newFileSizeRatio = resizeCanvasAndImage();
    labelProperies.updatePolygonOffsetProperties(newFileSizeRatio);
    resizeAllObjectsDimensionsByDoubleScale(newFileSizeRatio, canvas);
  }
  if (getSettingsPopupOpenState()) {
    setStickySettingsPopupProperties();
    if (getBoundingBoxCrosshairDropdownOpenState()) {
      setStickyBoundingBoxCrosshairDropdownProperties();
    }
  } else if (getExportDatasetsPopupOpenState()) {
    setStickyExportDatasetsPopupProperties();
  }
  const isWindowResized = true;
  validateFullLabellerModalVisibile(isWindowResized);
};

function assignCanvasForResizeWhenWindowResize(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForResizeWhenWindowResize as default };
