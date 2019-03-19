import {
  setEditablePolygon, sendPolygonPointsToFront,
  removePolygonPoint, removePolygonPoints,
  getPolygonEditingStatus
} from '../../../canvas/canvasObjects/polygon/changePolygon';

let selectedPolygonId = null;
let newPolygonSelected = false;

function setEditablePolygonOnClick(event, canvas) {
  if (getPolygonEditingStatus()) {
    // selecting another polygon without moving the first one
    removePolygonPoints();
  }
  setEditablePolygon(canvas, event.target, true);
  selectedPolygonId = event.target.id;
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedPolygonId = null;
}

function assignRemovePointsEvents(canvas) {
  canvas.on('mouse:down', (e) => {
    if (e.target) {
      if (e.target.shapeName === 'polygon' && e.target.id !== selectedPolygonId) {
        newPolygonSelected = true;
      } else if (e.target.shapeName === 'point') {
        removePolygonPoint(e.target.pointId);
      }
    }
  });

  canvas.on('mouse:over', (e) => {
    if (e.target && e.target.shapeName === 'point') {
      e.target.stroke = 'red';
      canvas.renderAll();
    }
  });

  canvas.on('mouse:up', (e) => {
    if (e.target && e.target.shapeName === 'polygon' && newPolygonSelected) {
      setEditablePolygonOnClick(e, canvas);
    } else if (!e.target && getPolygonEditingStatus()) {
      setPolygonNotEditableOnClick();
    }
  });

  canvas.on('mouse:out', (e) => {
    if (e.target && e.target.shapeName === 'point') {
      e.target.stroke = 'black';
      canvas.renderAll();
    }
  });
}

export { assignRemovePointsEvents as default };
