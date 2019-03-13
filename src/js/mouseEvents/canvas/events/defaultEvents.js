import {
  setEditablePolygon, movePolygonPoint, finishEditingPolygon, removePolygonPoints, displayPolygonPoints
} from '../../../canvas/canvasObjects/polygon/changePolygon';

const selectedPolygonPoints = {};
let editingPolygon = false;
let movingPolygon = false;
let selectedPolygonId = null;
function assignDefaultEvents(canvas) {
  canvas.on('mouse:down', (e) => {
    if (e.target && e.target.shapeName === 'polygon' && e.target.id !== selectedPolygonId) {
      editingPolygon = true;
      setEditablePolygon(canvas, e.target);
      selectedPolygonId = e.target.id;
    }
  });

  canvas.on('mouse:up', () => {
    if (movingPolygon) {
      displayPolygonPoints();
      movingPolygon = false;
      editingPolygon = true;
    }
  });

  canvas.on('object:moving', (e) => {
    if (e.target && e.target.shapeName === 'polygon') {
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
