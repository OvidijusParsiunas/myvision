import fabric from 'fabric';
import {
  displayPolygonPoints, movePolygonPoint, finishEditingPolygon, hidePolygonPoints,
} from '../../../canvas/canvasObjects/polygon/changePolygon';

const selectedPolygonPoints = {};
let editing = false;
let selectedPolygon = null;
function assignDefaultEvents(canvas) {
  canvas.on('mouse:down', (e) => {
      if (e.target && e.target.shapeName === 'polygon') {
        displayPolygonPoints(canvas, e.target);
        selectedPolygon = e.target;
        canvas.discardActiveObject();
        let circleId = 0;
        e.target.get('points').forEach((point) => {
            const circle = new fabric.Circle(
            {
              radius: 3,
              fill: 'blue',
              stroke: '#333333',
              strokeWidth: 0.5,
              left: point.x,
              top: point.y,
              selectable: true,
              hasBorders: false,
              hasControls: false,
              originX: 'center',
              originY: 'center',
              shapeName: 'point',
              objectCaching: false,
              circleId,
            });
            circleId++;
            canvas.add(circle);
            circle.bringToFront();
        })

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
