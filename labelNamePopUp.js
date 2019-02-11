labelNameNotSet = false;

function showLabelNamePopUp(xCoordinate, yCoordinate){
  let labelNamePopUp = document.getElementById('labelNamePopUp');
  labelNamePopUp.style.display = 'block';
  let canvasWrapperCoordinates = document.getElementById('canvas-wrapper').getBoundingClientRect();
  let canvasY = canvasWrapperCoordinates.top;
  let canvasX = canvasWrapperCoordinates.left;
  labelNamePopUp.style.top = yCoordinate + canvasY + 'px';
  labelNamePopUp.style.left = xCoordinate + canvasX + 'px';
}

function labelBndBox(){
  let text = document.getElementById("label-title").value;
  document.getElementById('labelNamePopUp').style.display = "none";
  var textShape = new fabric.Text(text, {
  fontSize: 10,
  fill: 'yellow',
  left: rect.left,
  top: rect.top,
  width: rect.width,
  height: rect.height
});
  var group = new fabric.Group([ rect, textShape ], {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    stroke: 'rgba(255,0,0)',
    strokeWidth: 2,
    fill: 'rgba(255,0,0,0.1)',
  });
  labelNameNotSet = true;
  canvas.remove(rect);
  canvas.add(group);
}

function removeBndBxIfLabelNamePending(){
  if(labelNameNotSet){
    canvas.remove(rect);
    labelNameNotSet = false;
    document.getElementById('labelNamePopUp').style.display = "none";
  }
}
