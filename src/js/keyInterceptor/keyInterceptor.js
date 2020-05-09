import { labelShape, cancelLabellingProcess } from '../tools/labellerModal/buttonEventHandlers';
import { getLabellerModalDisplayedState, getPolygonDrawingInProgressState, getBoundingBoxDrawingInProgressState } from '../tools/stateMachine';

function keyDownEventHandler(event) {
  if (getLabellerModalDisplayedState()) {
    if (event.key === 'Enter') {
      labelShape();
    } else if (event.key === 'Escape') {
      cancelLabellingProcess();
    }
  } else if (getPolygonDrawingInProgressState()) {
    if (event.key === 'Escape') {
      window.createNewPolygon();
    }
  } else if (getBoundingBoxDrawingInProgressState()) {
    if (event.key === 'Escape') {
      window.createNewBndBox();
    }
  }
  console.log(event.key);
}

function registerKeyInterceptor() {
  document.addEventListener('keydown', keyDownEventHandler);
}

export { registerKeyInterceptor as default };
