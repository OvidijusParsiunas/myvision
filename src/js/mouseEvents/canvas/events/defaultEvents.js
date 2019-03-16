import {
  setEditablePolygon, movePolygonPoint,
  removePolygonPoints, displayPolygonPoints,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
} from '../../../canvas/canvasObjects/polygon/changePolygon';

const selectedPolygonPoints = {};
let editingPolygon = false;
let polygonMoved = false;
let polygonPointMoved = false;
let selectedPolygonId = null;
let newPolygonSelected = false;

function assignDefaultEvents(canvas) {
  canvas.on('mouse:down', (e) => {
    if (e.target && e.target.shapeName === 'polygon' && e.target.id !== selectedPolygonId) {
      newPolygonSelected = true;
    } else {
      newPolygonSelected = false;
    }
  });

  canvas.on('mouse:up', (e) => {
    if (polygonMoved) {
      if (newPolygonSelected) {
        setEditablePolygonAfterMoving(canvas, e.target);
        selectedPolygonId = e.target.id;
      } else {
        displayPolygonPoints();
      }
      polygonMoved = false;
      editingPolygon = true;
    } else if (polygonPointMoved) {
      resetPolygonSelectableArea();
      polygonPointMoved = false;
    } else if (newPolygonSelected) {
      if (editingPolygon) {
        // when selecting another polygon without moving the first one
        removePolygonPoints();
      }
      setEditablePolygon(canvas, e.target);
      selectedPolygonId = e.target.id;
      editingPolygon = true;
    } else if (!e.target && editingPolygon) {
      removePolygonPoints();
      editingPolygon = false;
      selectedPolygonId = null;
    }
  });

  canvas.on('object:moving', (e) => {
    if (e.target && e.target.shapeName === 'polygon') {
      if (editingPolygon) {
        removePolygonPoints();
        editingPolygon = false;
      }
      polygonMoved = true;
    }
    if (e.target && e.target.shapeName === 'point') {
      movePolygonPoint(e);
      polygonPointMoved = true;
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
