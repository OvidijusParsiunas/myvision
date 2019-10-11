import fabric from 'fabric';

function setBoundingBoxEditToolsToBeTransparent() {
  fabric.Object.prototype.transparentCorners = false;
}

function createNewCanvas() {
  return new fabric.Canvas('c', { selection: false, renderOnAddRemove: false });
}

function createNewCanvas2() {
  return new fabric.Canvas('d', { selection: false, renderOnAddRemove: false });
}

export { setBoundingBoxEditToolsToBeTransparent, createNewCanvas, createNewCanvas2 };
