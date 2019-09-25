import { resizeCanvas } from './uploadFile/uploadImage';
import { setPolygonLabelOffsetProps } from '../../../../canvas/objects/label/label';
import labelProperies from '../../../../canvas/objects/label/properties';
// import { getDefaultState } from './stateManager';
// import { resetCanvasEventsToDefault } from '../facade';
// import { interruptAllCanvasEvents } from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/resetCanvasState';

let canvas = null;

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
  // if (getDefaultState()) {
  //   console.log('deselect');
  // } else {
  //   console.log('called');
  //   interruptAllCanvasEvents();
  //   resetCanvasEventsToDefault();
  // }
  const newFileSizeRatio = resizeCanvas();
  labelProperies.updatePolygonOffsetProperties(newFileSizeRatio);
  resizeAllObjects(newFileSizeRatio);
  // zoomCanvas(canvas);
};

function assignCanvasForResizeWindowResize(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForResizeWindowResize as default };
