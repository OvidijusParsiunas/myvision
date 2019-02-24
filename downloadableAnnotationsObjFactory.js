function getImageDetails(canvas, fileStatus) {
  return {
    folder: 'Unknown',
    filename: fileStatus.name,
    path: 'Unknown',
    source: {
      database: 'Unknown',
    },
    size: {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      depth: 1,
    },
    segmented: 0,
  };
}

function getBoundingBoxCoordinates(canvas) {
  let shape = {};
  canvas.forEachObject((object) => {
    const rectangleObject = object._objects[0];
    const rectangleText = object._objects[1].text;
    shape = {
      name: rectangleText,
      pose: 'Unspecified',
      truncated: 1,
      difficult: 0,
      bndbox: {
        xmin: rectangleObject.left,
        ymin: rectangleObject.top,
        xmax: rectangleObject.left + rectangleObject.width,
        ymax: rectangleObject.top + rectangleObject.height,
      },
    };
  });
  return shape;
}

function buildDownloadableAnnotationsObject(canvas, fileStatus) {
  const downloadableObject = {};
  downloadableObject.annotations = getImageDetails(canvas, fileStatus);
  downloadableObject.annotations.object = getBoundingBoxCoordinates(canvas);
  return downloadableObject;
}

export { buildDownloadableAnnotationsObject as default };
