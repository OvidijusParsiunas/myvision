// import fabric from 'fabric.js';

let canvas1 = null;
let canvas2 = null;
let activeCanvasRef = null;

function setBoundingBoxEditToolsToBeTransparent() {
  fabric.Object.prototype.transparentCorners = false;
}

function createNewCanvas() {
  canvas1 = new fabric.Canvas('c', { selection: false, width: 1, height: 1 });
  canvas2 = new fabric.Canvas('d', { selection: false, width: 1, height: 1 });
  activeCanvasRef = 'canvas1';
  return canvas1;
}

function reasignCanvas() {
  if (activeCanvasRef === 'canvas1') {
    activeCanvasRef = 'canvas2';
    return canvas2;
  }
  activeCanvasRef = 'canvas1';
  return canvas1;
}

function getCanvasReferences() {
  return { canvas1, canvas2 };
}

export {
  setBoundingBoxEditToolsToBeTransparent,
  reasignCanvas, getCanvasReferences, createNewCanvas,
};
