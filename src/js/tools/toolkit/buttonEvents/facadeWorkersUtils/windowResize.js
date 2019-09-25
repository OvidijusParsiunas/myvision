import { resizeCanvas } from './uploadFile/uploadImage';
import { setPolygonLabelOffsetProps } from '../../../../canvas/objects/label/label';
import labelProperies from '../../../../canvas/objects/label/properties';

let canvas = null;

function resetPolygonSelectableArea(currentPolygon, newFileSizeRatio) {
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
  setPolygonLabelOffsetProps(currentPolygon, currentPolygon.points[0], newFileSizeRatio);
}

function resizeAllObjects(newFileSizeRatio) {
  canvas.forEachObject((object) => {
    if (object.shapeName === 'label') {
      object.top *= newFileSizeRatio.height;
      object.left *= newFileSizeRatio.width;
    } else if (object.shapeName === 'bndBox') {
      object.height *= newFileSizeRatio.height;
      object.width *= newFileSizeRatio.width;
      object.top *= newFileSizeRatio.height;
      object.left *= newFileSizeRatio.width;
    } else if (object.shapeName === 'polygon') {
      object.points.forEach((point) => {
        point.x *= newFileSizeRatio.width;
        point.y *= newFileSizeRatio.height;
      });
      resetPolygonSelectableArea(object, newFileSizeRatio);
      // reset polygon like in move polygon
    }
    object.setCoords();
  });
  canvas.renderAll();
}

window.windowResize = () => {
  const newFileSizeRatio = resizeCanvas();
  labelProperies.updatePolygonOffsetProperties(newFileSizeRatio);
  resizeAllObjects(newFileSizeRatio);
  // zoomCanvas(canvas);
};

function assignCanvasForResizeWindowResize(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForResizeWindowResize as default };
