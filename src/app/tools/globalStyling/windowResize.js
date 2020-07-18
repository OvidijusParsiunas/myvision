import { resizeCanvasAndImage, resizeCanvas, getCurrentImage } from '../imageList/uploadImages/drawImageOnCanvas';
import { resizeAllObjectsDimensionsByDoubleScale } from '../../canvas/objects/objectsProperties/changeProperties';
import labelProperies from '../../canvas/objects/label/properties';
import { zoomCanvas } from '../toolkit/buttonClickEvents/facadeWorkers/zoomWorker';
import { getCurrentZoomState, getSettingsPopupOpenState, getExportDatasetsPopupOpenState } from '../state';
import { validateFullModalVisibile } from '../labellerModal/style';
import { setStickySettingsPopupProperties } from '../settingsPopup/style';
import { setStickyExportDatasetsPopupProperties } from '../exportDatasetsPopup/style';
import validateClientBrowserDimensions from './inadequateResourcesOverlay';

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
  } else if (getExportDatasetsPopupOpenState()) {
    setStickyExportDatasetsPopupProperties();
  }
  const isWindowResized = true;
  validateFullModalVisibile(isWindowResized);
};

function assignCanvasForResizeWhenWindowResize(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForResizeWhenWindowResize as default };
