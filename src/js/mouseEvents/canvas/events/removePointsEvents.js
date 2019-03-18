import { removePolygonPoint, sendPolygonPointsToFront } from '../../../canvas/canvasObjects/polygon/changePolygon';

function assignRemovePointsEvents(canvas) {
  canvas.on('mouse:down', (e) => {
    if (e.target) {
      if (e.target.shapeName === 'polygon') {
        sendPolygonPointsToFront();
      }
    }
    if (e.target && e.target.shapeName === 'point') {
      removePolygonPoint(e.target.pointId);
    }
  });

  canvas.on('mouse:over', (e) => {
    if (e.target && e.target.shapeName === 'point') {
      e.target.fill = 'red';
      canvas.renderAll();
    }
  });

  canvas.on('mouse:out', (e) => {
    if (e.target && e.target.shapeName === 'point') {
      e.target.fill = 'blue';
      canvas.renderAll();
    }
  });
}

export { assignRemovePointsEvents as default };
