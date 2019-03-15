import {
  setEditablePolygon, movePolygonPoint, finishEditingPolygon, removePolygonPoints, displayPolygonPoints
} from '../../../canvas/canvasObjects/polygon/changePolygon';

const selectedPolygonPoints = {};
let editingPolygon = false;
let movingPolygon = false;
let selectedPolygonId = null;
let polygonEdited = false;

function assignDefaultEvents(canvas) {
  canvas.on('mouse:down', (e) => {

  });

  canvas.on('mouse:up', (e) => {
    if (movingPolygon) {
      displayPolygonPoints();
      movingPolygon = false;
      editingPolygon = true;
    } else {
      if (!e.target && editingPolygon) {
        removePolygonPoints();
        editingPolygon = false;
        selectedPolygonId = null;
      }
      if (e.target && e.target.shapeName === 'polygon' && e.target.id !== selectedPolygonId) {
        if (editingPolygon) {
          removePolygonPoints();
        }
          editingPolygon = true;
          setEditablePolygon(canvas, e.target);
          selectedPolygonId = e.target.id;
          if(polygonEdited){
            removePolygonPoints();
            displayPolygonPoints();
            polygonEdited = false;
          }
      }
    }
  });

  canvas.on('object:moving', (e) => {
    if (e.target && e.target.shapeName === 'polygon') {
      polygonEdited = true;
      if (editingPolygon) {
        editingPolygon = false;
        removePolygonPoints();
        movingPolygon = true;
      }
    }
    if (e.target && e.target.shapeName === 'point') {
      movePolygonPoint(e);
    }
  });

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
      } else if (e.target.shapeName === 'polygon') {
        e.target._objects[0].set('fill', 'rgba(255,0,0,0.01)');
      }
      canvas.renderAll();
    }
  });
}

export { assignDefaultEvents, selectedPolygonPoints };
