import { getCanvasReferences } from '../../../utils/fabricUtils.js';

// the following is used to fix bounding box stretching bugs within a canvas
// and when switching between older and newer ones
function setScalingEventListeners() {
  const { canvas1, canvas2 } = getCanvasReferences();
  if (canvas1 && canvas1.__eventListeners
    && canvas1.__eventListeners['object:scaling'] && canvas1.__eventListeners['object:scaling'].length > 1) {
    canvas1.__eventListeners['object:scaling'].pop();
  }
  if (canvas2 && canvas2.__eventListeners
   && canvas2.__eventListeners['object:scaling'].length > 1) {
    canvas2.__eventListeners['object:scaling'].pop();
  }
}

function purgeCanvasMouseEvents(canvas) {
  if (canvas.__eventListeners) {
    canvas.__eventListeners['mouse:down'] = [];
    canvas.__eventListeners['mouse:over'] = [];
    canvas.__eventListeners['mouse:out'] = [];
    canvas.__eventListeners['mouse:move'] = [];
    canvas.__eventListeners['mouse:up'] = [];
    canvas.__eventListeners['mouse:wheel'] = [];
    canvas.__eventListeners['object:moving'] = [];
    setScalingEventListeners();
  }
}

// consider using this to reassign events

/*
canvas.on('object:moving', moveHandler);
canvas.on('object:modified', modifiedHandler);
canvas.on('custom:event', customEvtHandler);

//or you register with key/value pairs
canvas.on({
    'object:moving' : moveHandler,
    'object:modified' : modifiedHandler,
    'custom:event' : customEvtHandler
});
*/

export { purgeCanvasMouseEvents as default };
