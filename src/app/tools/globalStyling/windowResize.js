import { resizeCanvasAndImage, resizeCanvas, getCurrentImage } from '../imageList/uploadImages/drawImageOnCanvas';
import { resizeAllObjectsDimensionsByDoubleScale } from '../../canvas/objects/objectsProperties/changeProperties';
import labelProperies from '../../canvas/objects/label/properties';
import { zoomCanvas } from '../toolkit/buttonClickEvents/facadeWorkers/zoomWorker';
import {
  getSettingsPopupOpenState, getExportDatasetsPopupOpenState,
  getCurrentZoomState, getBoundingBoxCrosshairPopoverOpenState,
} from '../state';
import { validateFullLabellerModalVisibile } from '../labellerModal/style';
import { setStickySettingsPopupProperties } from '../settingsPopup/style';
import { setStickyExportDatasetsPopupProperties } from '../exportDatasetsPopup/style';
import validateClientBrowserDimensions from './inadequateResourcesOverlay';
import { setStickyBoundingBoxCrosshairPopoverProperties } from '../settingsPopup/options/boundingBoxCrosshairPopover/style';

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
    if (getBoundingBoxCrosshairPopoverOpenState()) {
      setStickyBoundingBoxCrosshairPopoverProperties();
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
