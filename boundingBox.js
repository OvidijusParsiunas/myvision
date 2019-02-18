import fabric from 'fabric';
import leftMouseBtn from './mouseEvents';

let canvas = null;
const bndBoxProps = {};

function createNewBndBox() {
  // removeBndBxIfLabelNamePending();
  canvas.discardActiveObject();
  canvas.renderAll();
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
  });
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
  canvas.__eventListeners['mouse:down'] = [() => {
    leftMouseBtn.down = true;
    const pointer = canvas.getPointer(canvas.e);
    bndBoxProps.origX = pointer.x;
    bndBoxProps.origY = pointer.y;
    bndBoxProps.rect = new fabric.Rect({
      left: bndBoxProps.origX,
      top: bndBoxProps.origY,
      width: pointer.x - bndBoxProps.origX,
      height: pointer.y - bndBoxProps.origY,
      stroke: 'rgba(255,0,0)',
      strokeWidth: 2,
      fill: 'rgba(255,0,0,0)',
    });
    canvas.add(bndBoxProps.rect);
  }];
  // labelNameNotSet = true;
}

function drawBndBox(canvasObj) {
  if (!leftMouseBtn.down) return;
  const pointer = canvas.getPointer(canvasObj.e);
  if (bndBoxProps.origX > pointer.x) {
    bndBoxProps.rect.set({ left: Math.abs(pointer.x) });
  }
  if (bndBoxProps.origY > pointer.y) {
    bndBoxProps.rect.set({ top: Math.abs(pointer.y) });
  }
  bndBoxProps.rect.set({ width: Math.abs(bndBoxProps.origX - pointer.x) });
  bndBoxProps.rect.set({ height: Math.abs(bndBoxProps.origY - pointer.y) });
  canvas.renderAll();
}

function finishDrawingBndBox(canvasObj) {
  if (leftMouseBtn.down) {
    leftMouseBtn.down = false;
    bndBoxProps.rect.setCoords();
    bndBoxProps.rect.selectable = false;
    canvas.__eventListeners['mouse:down'] = [];
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.selectable = true;
    });
    const pointer = canvas.getPointer(canvasObj.e);
    // showLabelNamePopUp(pointer.x, pointer.y, rect);
  }
}

function highlightBndBox(canvasObj) {
  if (canvasObj.target && canvasObj.target._objects) {
    canvasObj.target._objects[0].set('fill', 'rgba(255,0,0,0.2)');
    canvas.renderAll();
  }
}

function removeBndBoxHighlight(canvasObj) {
  if (canvasObj.target && canvasObj.target._objects) {
    canvasObj.target._objects[0].set('fill', 'rgba(255,0,0,0');
    canvas.renderAll();
  }
}

function removeBndBox() {
  // removeBndBxIfLabelNamePending();
  canvas.remove(canvas.getActiveObject());
}

function setCanvas(newCanvas) {
  canvas = newCanvas;
}

export {
  setCanvas,
  createNewBndBox,
  drawBndBox,
  finishDrawingBndBox,
  highlightBndBox,
  removeBndBoxHighlight,
  removeBndBox,
};
