import {
  displayPolygonPoints, movePolygonPoint, finishEditingPolygon, hidePolygonPoints
} from '../../../canvas/canvasObjects/polygon/changePolygon';

const selectedPolygonPoints = {};
let editing = false;
let selectedPolygon = null;
function assignDefaultEvents(canvas) {
  canvas.on('mouse:down', (e) => {
    if(e.target && e.target.aCoords) {
      console.log(e.target.aCoords);
    }
    window.result2 = e.target;
    if (!e.target) {
      finishEditingPolygon();
    }
    if (!editing) {
      if (e.target && e.target.shapeName === 'polygonGrp') {
        const objectsInGroup = e.target.getObjects();
        objectsInGroup.forEach((object) => {
          if(object.shapeName === 'polygon'){
            window.result = object;
        }
        canvas.add(object);
        });
        canvas.renderAll();
        canvas.remove(e.target);
        const objectsInGroupArrayIndex = 0;
        selectedPolygon = objectsInGroup[objectsInGroupArrayIndex];
        displayPolygonPoints(canvas, objectsInGroup, e.target.top, e.target.left);
        editing = true;
      }
    }
  });

  canvas.on('object:moving', (e) => {
    if (e.target && e.target.shapeName === 'polygon') {
      hidePolygonPoints(e.target.top);
    }
    if (e.target && e.target.shapeName === 'point') {
      movePolygonPoint(e, selectedPolygon);
    }
  });
  // canvas.on('object:moving', (e) => {
  //   movePoints(e);
  // });

  canvas.on('mouse:over', (e) => {
    if (e.target && e.target._objects) {
      e.target._objects[0].set('fill', 'rgba(255,0,0,0.2)');
      canvas.renderAll();
    }
  });

  canvas.on('mouse:out', (e) => {
    if (e.target && e.target._objects) {
      if (e.target.shapeName === 'bndBox') {
        e.target._objects[0].set('fill', 'rgba(255,0,0,0');
      } else if (e.target.shapeName === 'polygonGrp') {
        e.target._objects[0].set('fill', 'rgba(255,0,0,0.01)');
      }
      canvas.renderAll();
    }
  });
}

export { assignDefaultEvents, selectedPolygonPoints };
