function changeCanvasToDrawCursor(canvas) {
  canvas.discardActiveObject();
  canvas.renderAll();
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
  });
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
}

function assignDefaultEvents(canvas) {
  canvas.on('mouse:over', (e) => {
    if (e.target && e.target._objects) {
      e.target._objects[0].set('fill', 'rgba(255,0,0,0.2)');
      canvas.renderAll();
    }
  });

  canvas.on('mouse:out', (e) => {
    if (e.target && e.target._objects) {
      if (e.target.shapeName === 'bndBox') {
        e.target._objects[0].set('fill', 'rgba(255,0,0,0');
      } else if (e.target.shapeName === 'polygon') {
        e.target._objects[0].set('fill', 'rgba(255,0,0,0.01)');
      }
      canvas.renderAll();
    }
  });
}

function purgeCanvasMouseEvents(canvas) {
  if (canvas.__eventListeners) {
    canvas.__eventListeners['mouse:down'] = [];
    canvas.__eventListeners['mouse:over'] = [];
    canvas.__eventListeners['mouse:out'] = [];
    canvas.__eventListeners['mouse:move'] = [];
    canvas.__eventListeners['mouse:up'] = [];
  }
}

function changeCanvasToDefaultCursor(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = true;
  });
  purgeCanvasMouseEvents(canvas);
  assignDefaultEvents(canvas);
}

export { changeCanvasToDrawCursor, changeCanvasToDefaultCursor };
