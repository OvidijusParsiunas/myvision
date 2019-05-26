import { changePolygonPointsToWaitForAddingFirstPointImpl } from '../../objects/polygon/alterPolygon/changePointsStyle';

function setAddPointsMode(canvas, startingPoint) {
  changePolygonPointsToWaitForAddingFirstPointImpl(canvas, startingPoint);
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

function mouseHover(canvas, events) {
  if (events.target) {
    if (events.target.shapeName === 'point') {
      canvas.hoverCursor = 'default';
    } else if (events.target.shapeName === 'tempPoint') {
      canvas.hoverCursor = 'move';
    } else if (!events.target.selectable) {
      canvas.hoverCursor = 'crosshair';
    }
  } else {
    canvas.hoverCursor = 'crosshair';
  }
  canvas.renderAll();
}

function setHoverCursorOnMouseOut(canvas, cursor) {
  canvas.hoverCursor = cursor;
}

export { setAddPointsMode, mouseHover, setHoverCursorOnMouseOut };
