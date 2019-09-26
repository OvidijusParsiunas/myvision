import { resizeCanvasAndImage, resizeCanvas } from './uploadFile/uploadImage';
import { setPolygonLabelOffsetProps } from '../../../../canvas/objects/label/label';
import labelProperies from '../../../../canvas/objects/label/properties';
import zoomCanvas from '../facadeWorkers/zoomWorker';
import { getCurrentZoomState } from './stateManager';

let canvas = null;
let stubElement = null;

function resetPolygonSelectableArea(currentPolygon) {
  const newPosition = currentPolygon._calcDimensions();
  currentPolygon.set({
    left: newPosition.left,
    top: newPosition.top,
    height: newPosition.height,
    width: newPosition.width,
    pathOffset: {
      x: newPosition.left + newPosition.width / 2,
      y: newPosition.top + newPosition.height / 2,
    },
  });
  currentPolygon.setCoords();
}

function resizeAllObjects(newFileSizeRatio) {
  canvas.forEachObject((object) => {
    switch (object.shapeName) {
      case 'polygon':
        object.points.forEach((point) => {
          point.x *= newFileSizeRatio.width;
          point.y *= newFileSizeRatio.height;
        });
        resetPolygonSelectableArea(object, newFileSizeRatio);
        setPolygonLabelOffsetProps(object, object.points[0]);
        break;
      case 'tempPolygon':
        object.points.forEach((point) => {
          point.x *= newFileSizeRatio.width;
          point.y *= newFileSizeRatio.height;
        });
        break;
      case 'point':
      case 'invisiblePoint':
      case 'firstPoint':
      case 'tempPoint':
      case 'initialAddPoint':
      case 'label':
        object.top *= newFileSizeRatio.height;
        object.left *= newFileSizeRatio.width;
        break;
      case 'addPointsLine':
        object.top *= newFileSizeRatio.height;
        object.left *= newFileSizeRatio.width;
        object.height *= newFileSizeRatio.height;
        object.width *= newFileSizeRatio.width;
        object.x1 *= newFileSizeRatio.width;
        object.x2 *= newFileSizeRatio.width;
        object.y1 *= newFileSizeRatio.height;
        object.y2 *= newFileSizeRatio.height;
        break;
      case 'bndBox':
        object.height *= newFileSizeRatio.height;
        object.width *= newFileSizeRatio.width;
        object.top *= newFileSizeRatio.height;
        object.left *= newFileSizeRatio.width;
        break;
      default:
        break;
    }
    object.setCoords();
  });
  canvas.renderAll();
}

window.windowResize = () => {
  if (getCurrentZoomState() > 1) {
    resizeCanvas();
    zoomCanvas(canvas, null, true);
  } else {
    // fix here, when zoom in, stretch out, then zoom out to original
    const newFileSizeRatio = resizeCanvasAndImage();
    labelProperies.updatePolygonOffsetProperties(newFileSizeRatio);
    resizeAllObjects(newFileSizeRatio);
  }
};

function assignElementReferences() {
  stubElement = document.getElementById('stub');
  // zoomOverflowElement = document.getElementById('zoom-overflow');
  // zoomOverflowWrapperElement = document.getElementById('zoom-overflow-wrapper');
  // canvasElement = document.getElementById('canvas-wrapper-inner');
}

function assignCanvasForResizeWhenWindowResize(canvasObj) {
  canvas = canvasObj;
  assignElementReferences();
}

export { assignCanvasForResizeWhenWindowResize as default };
