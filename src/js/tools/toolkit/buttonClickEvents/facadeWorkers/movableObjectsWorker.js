import { getMovableObjectsState, setMovableObjectsState, getDefaultState } from '../facadeWorkersUtils/stateMachine';

function changeMovableObjectsState(canvas) {
  if (getDefaultState()) {
    if (getMovableObjectsState()) {
      canvas.forEachObject((iteratedObj) => {
        if (iteratedObj.shapeName === 'polygon' || iteratedObj.shapeName === 'bndBox') {
          iteratedObj.lockMovementX = true;
          iteratedObj.lockMovementY = true;
          iteratedObj.hoverCursor = 'default';
        }
      });
      setMovableObjectsState(false);
    } else {
      canvas.forEachObject((iteratedObj) => {
        if (iteratedObj.shapeName === 'polygon' || iteratedObj.shapeName === 'bndBox') {
          iteratedObj.lockMovementX = false;
          iteratedObj.lockMovementY = false;
          iteratedObj.hoverCursor = 'move';
        }
      });
      setMovableObjectsState(true);
    }
  } else if (getMovableObjectsState()) {
    setMovableObjectsState(false);
  } else {
    setMovableObjectsState(true);
  }
}

export { changeMovableObjectsState as default };
