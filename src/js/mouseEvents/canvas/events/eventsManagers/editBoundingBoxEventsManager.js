// call these files workers

function boundingBoxScalingEvents(event) {
  if (event.target.shapeName === 'bndBox') {
    const boundingBox = event.target;
    boundingBox.width *= boundingBox.scaleX;
    boundingBox.height *= boundingBox.scaleY;
    boundingBox.scaleX = 1;
    boundingBox.scaleY = 1;
  }
}

function boundingBoxMouseOutEvents(event) {
  event.target.set('fill', 'rgba(255,0,0,0');
}

export { boundingBoxScalingEvents, boundingBoxMouseOutEvents };
