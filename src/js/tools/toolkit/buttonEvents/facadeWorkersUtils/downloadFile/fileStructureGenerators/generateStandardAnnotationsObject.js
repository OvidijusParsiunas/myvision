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

// this will need to be fixed when extracting graph details for a new xml file
// function useWithLabels(canvas) {
//   let shape = {};
//   canvas.forEachObject((object) => {
//     const rectangleObject = object._objects[0];
//     const rectangleText = object._objects[1].text;
//     shape = {
//       name: rectangleText,
//       pose: 'Unspecified',
//       truncated: 1,
//       difficult: 0,
//       bndbox: {
//         xmin: rectangleObject.left,
//         ymin: rectangleObject.top,
//         xmax: rectangleObject.left + rectangleObject.width,
//         ymax: rectangleObject.top + rectangleObject.height,
//       },
//     };
//   });
//   return shape;
// }

function getBoundingBoxCoordinates(canvas) {
  let shape = {};
  canvas.forEachObject((object) => {
    const rectangleObject = object;
    shape = {
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

function builAnnotationsObject(canvas, fileStatus) {
  const annotationsObject = {};
  annotationsObject.annotations = getImageDetails(canvas, fileStatus);
  annotationsObject.annotations.object = getBoundingBoxCoordinates(canvas);
  return annotationsObject;
}

export { builAnnotationsObject as default };
