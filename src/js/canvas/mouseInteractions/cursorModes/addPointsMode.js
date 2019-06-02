import { changePolygonPointsToWaitForAddingFirstPointImpl } from '../../objects/polygon/alterPolygon/changePointsStyle';

function setAddPointsMode(canvas, startingPoint) {
  changePolygonPointsToWaitForAddingFirstPointImpl(canvas, startingPoint);
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

function addingPointsMouseHoverMode(event, canvas) {
  if (event.target) {
    if (event.target.shapeName === 'point') {
      canvas.hoverCursor = 'default';
    } else if (event.target.shapeName === 'tempPoint') {
      canvas.hoverCursor = 'move';
    } else if (!event.target.selectable) {
      canvas.hoverCursor = 'crosshair';
    }
  } else {
    canvas.hoverCursor = 'crosshair';
  }
}

function setHoverCursorOnMouseOut(canvas, cursor) {
  canvas.hoverCursor = cursor;
}

export {
  setAddPointsMode, addingPointsMouseHoverMode, setHoverCursorOnMouseOut,
};
