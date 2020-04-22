import { getMovableObjectsState, setMovableObjectsState, getDefaultState } from '../../stateMachine';

function changeMovableObjectsState() {
  if (getDefaultState()) {
    if (getMovableObjectsState()) {
      this.canvas.forEachObject((iteratedObj) => {
        if (iteratedObj.shapeName === 'polygon' || iteratedObj.shapeName === 'bndBox') {
          iteratedObj.lockMovementX = true;
          iteratedObj.lockMovementY = true;
          iteratedObj.hoverCursor = 'default';
        }
      });
      setMovableObjectsState(false);
    } else {
      this.canvas.forEachObject((iteratedObj) => {
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
