import fabric from 'fabric';

let canvas1 = null;
let canvas2 = null;
let activeCanvasRef = null;

function setBoundingBoxEditToolsToBeTransparent() {
  fabric.Object.prototype.transparentCorners = false;
}

function createNewCanvas() {
  canvas1 = new fabric.Canvas('c', { selection: false });
  canvas2 = new fabric.Canvas('d', { selection: false });
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

export {
  setBoundingBoxEditToolsToBeTransparent, createNewCanvas, reasignCanvas,
};
