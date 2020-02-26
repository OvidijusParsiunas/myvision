const widthDelta = 3.5;
const heightDelta = 2;

function adjustBoundingBoxCoordinates(bLeft, bTop, bWidth, bHeight, imageDimensions) {
  const {
    scaleX, scaleY, originalWidth, originalHeight,
  } = imageDimensions;
  if (bLeft + bWidth > originalWidth - widthDelta / scaleX) {
    bWidth = originalWidth - bLeft;
    console.log('triggered width');
  }
  if (bTop + bHeight > originalHeight - heightDelta / scaleY) {
    bHeight = originalHeight - bTop;
    console.log('triggered top');
  }
  return {
    newLeft: bLeft,
    newTop: bTop,
    newWidth: bWidth,
    newHeight: bHeight,
  };
}

export { adjustBoundingBoxCoordinates as default };
