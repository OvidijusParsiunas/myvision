import fabric from 'fabric';
import polygonProperties from './properties';

function prepareShapeWhenLabelling(canvas, pointArray, finalPoint, activeShape) {
  const points = [];
  pointArray.forEach((point) => {
    points.push({
      x: point.left,
      y: point.top,
    });
    canvas.remove(point);
  });
  canvas.remove(finalPoint);

  canvas.remove(activeShape);

  const polygon = new fabric.Polygon(points, polygonProperties.newPolygon());

//   lockMovementIfAssertedByState(polygon);
  canvas.add(polygon);

//   activeShape = null;
//   polygonMode = false;
//   drawingFinished = true;
}

function createPolygon() {
    
}

export {
  prepareShapeWhenLabelling,
};
