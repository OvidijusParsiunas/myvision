import { resizeCanvas } from './uploadFile/uploadImage';

let canvas = null;

function resizeAllObjects(newFileSizeRatio) {
  canvas.forEachObject((object) => {
    if (object.shapeName === 'bndBox') {
      object.height *= newFileSizeRatio.height;
      object.width *= newFileSizeRatio.width;
      object.top *= newFileSizeRatio.height;
      object.left *= newFileSizeRatio.width;
    } else if (object.shapeName === 'polygon') {
      object.points.forEach((point) => {
        point.x *= newFileSizeRatio.width;
        point.y *= newFileSizeRatio.height;
      });
      object.setCoords();
    }
    console.log(object);
  });
}

window.windowResize = () => {
  const newFileSizeRatio = resizeCanvas();
  resizeAllObjects(newFileSizeRatio);
  // zoomCanvas(canvas);
};

function assignCanvasForResizeWindowResize(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForResizeWindowResize as default };
