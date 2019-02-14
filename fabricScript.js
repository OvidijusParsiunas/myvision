var canvas = new fabric.Canvas('c', { selection: false });
fabric.Object.prototype.transparentCorners = false;
var rect, isDown, origX, origY;

canvas.setBackgroundColor({ source: 'sample-img.jpg', repeat: 'repeat' }, function () {
        canvas.renderAll();
});

canvas.on('mouse:over', function(e) {
   if(e.target && e.target._objects){
     e.target._objects[0].set('fill', 'rgba(255,0,0,0.2)');
     canvas.renderAll();
   }
 });

 canvas.on('mouse:out', function(e) {
   if(e.target && e.target._objects){
     e.target._objects[0].set('fill', 'rgba(255,0,0,0');
     canvas.renderAll();
   }
 });

canvas.on('mouse:move', function(o){
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);

    if(origX>pointer.x){
        rect.set({ left: Math.abs(pointer.x) });
    }
    if(origY>pointer.y){
        rect.set({ top: Math.abs(pointer.y) });
    }

    rect.set({ width: Math.abs(origX - pointer.x) });
    rect.set({ height: Math.abs(origY - pointer.y) });

    canvas.renderAll();
});

canvas.on('mouse:up', function(o){
  if(isDown){
    rect.setCoords();
    console.log(rect);
    rect.selectable = false;
    isDown = false;
    canvas.__eventListeners["mouse:down"] = [];
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    canvas.forEachObject(function(object){
           object.selectable = true;
    });
    var pointer = canvas.getPointer(o.e);
    showLabelNamePopUp(pointer.x, pointer.y, rect);
  }
});

function newRectangle(){
  removeBndBxIfLabelNamePending();
  canvas.discardActiveObject();
  canvas.renderAll();
  canvas.forEachObject(function(object){
   object.selectable = false;
  });
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
  canvas.__eventListeners["mouse:down"] = [function(o){
      isDown = true;
      var pointer = canvas.getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;
      rect = new fabric.Rect({
          left: origX,
          top: origY,
          width: pointer.x-origX,
          height: pointer.y-origY,
          stroke: 'rgba(255,0,0)',
          strokeWidth: 2,
          fill: 'rgba(255,0,0,0)',
      });
      canvas.add(rect);
  }];
  labelNameNotSet = true;
}

function removeRectangle(){
    removeBndBxIfLabelNamePending();
    canvas.remove(canvas.getActiveObject());
}
