import fabric from 'fabric';
import polygonProperties from "./polygonProperties";

let selectedPolygon;
let selectedPolygonText;
let selectedPolygonPoints;
let canvas;
let thisTop;
let thisLeft;
let polygonPoints;
let currentPoints;

function displayPolygonPoints(canvasObj, polygonObjects, top, left) {
  thisTop = top;
  thisLeft = left;
  canvas = canvasObj;
  const indexOfPolygonObject = 0;
  const indexOfPolygonText = 1;
  const indexOfPolygonPoints = 2;
  selectedPolygon = polygonObjects[indexOfPolygonObject];
  selectedPolygonText = polygonObjects[indexOfPolygonText];
  selectedPolygonPoints = polygonObjects.slice(indexOfPolygonPoints, polygonObjects.length);
  selectedPolygonPoints.forEach((point) => {
    point.set('visible', true);
  });
  canvasObj.renderAll();
}

function hidePolygonPoints() {
  if (selectedPolygonPoints) {
    selectedPolygonPoints.forEach((point) => {
      point.set('visible', false);
    });
    canvas.renderAll();
  }
}

function movePolygonPoint(event, newPolygon) {
  const pointer = canvas.getPointer(event.e);
  const polygonPoint = event.target;
  newPolygon.points[polygonPoint.circleId] = {
    x: pointer.x, y: pointer.y,
  };
  polygonPoints = newPolygon.points;
  currentPoints = pointer.x;
  currentPoints = pointer.x;
  //console.log(newPolygon.points);
  // console.log(newPolygon);
  // polygonPoint.set('left', pointer.x);
  // polygonPoint.set('top', pointer.y);
}

function finishEditingPolygon() {
  // selectedPolygon.points = polygonPoints;
  // const rrange = selectedPolygon.top;
  // console.log(thisTop);
  // console.log(selectedPolygon.top);
  // let numbY = thisTop - selectedPolygon.top;
  // console.log(numbY);
  // let numbY2 = numbY + selectedPolygon.top;
  // console.log(numbY2);
                    // selectedPolygon.clone(function (cloned) {
                    //     canvas.discardActiveObject();
                    //     cloned.set({
                    //         top: cloned.top + 20,
                    //         evented: true
                    //     });
                    //     if (cloned.type === 'activeSelection') {
                    //         // active selection needs a reference to the canvas.
                    //         cloned.canvas = canvas;
                    //         cloned.forEachObject(function (obj) {
                    //             canvas.add(obj);
                    //         });
                    //         cloned.setCoords();
                    //     } else {
                    //         canvas.add(cloned);
                    //     }
                    //     canvas.setActiveObject(cloned);
                    //     canvas.requestRenderAll();
                    // });

  const group = new fabric.Group(
    [selectedPolygon, selectedPolygonText, ...selectedPolygonPoints]
  );
//  const anotherGroup = group.clone();
//  let matrix3 = group.calcTransformMatrix();
      // var transforms = fabric.util.qrDecompose(matrix3);
  //    let canvasPoint = fabric.util.transformPoint(selectedPolygon, matrix3);


  // console.log(selectedPolygon);
  // console.log(selectedPolygon.calcTransformMatrix());
  // console.log(group.calcTransformMatrix());
  //console.log('!!!!!!!!!!!!!! ' + transforms.translateY);
  //let matrix = group.calcTransformMatrix()[4];
  let matrix2 = selectedPolygon.calcTransformMatrix()[4];
  //let newPoint = fabric.util.transformPoint({y: group.top, x: group.left}, matrix);
  // let newPolygon = new fabric.Polygon(polygonPoints, {fill: 'purple'});

  // console.log(thisLeft);
  // attempt to use aCoords
  //let new2 = (thisLeft + matrix)*matrix2;
  // canvas.add(newPolygon);
  group.set('top', thisTop);
  group.set('left', thisLeft);
  canvas.add(group);

  canvas.remove(selectedPolygon);
  canvas.remove(selectedPolygonText);
  selectedPolygonPoints.forEach((point) => {
    canvas.remove(point);
  });
  console.log(group);
}

export {
  displayPolygonPoints, hidePolygonPoints,
  movePolygonPoint, finishEditingPolygon,
};
