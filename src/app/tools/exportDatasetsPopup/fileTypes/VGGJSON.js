import { getImageProperties } from '../../imageList/uploadImages/drawImageOnCanvas.js';
import { getAllImageData } from '../../imageList/imageList.js';
import { getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes.js';
import { getCurrentImageId } from '../../state.js';
import { adjustIncorrectBoundingBoxCoordinates, adjustIncorrectPolygonPointCoordinates } from '../sharedUtils/adjustShapeCoordinates.js';

function getJSONPolygonPointsCoordinates(polygon, imageDimensions) {
  const coordinatesObj = {
    all_points_x: [],
    all_points_y: [],
  };
  polygon.points.forEach((point) => {
    const {
      pointX, pointY,
    } = adjustIncorrectPolygonPointCoordinates(point, imageDimensions);
    coordinatesObj.all_points_x.push(pointX);
    coordinatesObj.all_points_y.push(pointY);
  });
  return coordinatesObj;
}

function getJSONFileName() {
  const currentDate = new Date();
  return `visionai-${currentDate.getDay()}-${currentDate.getMonth()}-${currentDate.getFullYear()}.json`;
}

function generateTempDownloadableJSONElement(json) {
  const pom = document.createElement('a');
  const bb = new Blob([JSON.stringify(json)], { type: 'application/json' });
  pom.setAttribute('href', window.URL.createObjectURL(bb));
  pom.setAttribute('download', getJSONFileName());
  pom.dataset.downloadurl = ['application/json', pom.download, pom.href].join(':');
  pom.draggable = true;
  pom.classList.add('dragout');
  return pom;
}

function parsePolygonData(polygon, imageDimensions) {
  const coordinatesObj = getJSONPolygonPointsCoordinates(polygon, imageDimensions);
  return {
    shape_attributes: {
      name: 'polygon',
      all_points_x: coordinatesObj.all_points_x,
      all_points_y: coordinatesObj.all_points_y,
    },
    region_attributes: {
      name: polygon.shapeLabelText,
    },
  };
}

function parseBoundingBoxData(boundingBox, imageDimensions) {
  const {
    left, top, width, height,
  } = adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions);
  return {
    shape_attributes: {
      name: 'rect',
      x: left,
      y: top,
      width,
      height,
    },
    region_attributes: {
      name: boundingBox.shapeLabelText,
    },
  };
}

function parseShapesData(shapes, imageDimensions) {
  const shapesCoordinates = [];
  Object.keys(shapes).forEach((key) => {
    const shape = shapes[key].shapeRef;
    if (shape.shapeName === 'polygon') {
      shapesCoordinates.push(parsePolygonData(shape, imageDimensions));
    } else if (shape.shapeName === 'bndBox') {
      shapesCoordinates.push(parseBoundingBoxData(shape, imageDimensions));
    }
  });
  return shapesCoordinates;
}

function parseImageData(image) {
  const parsedImageData = {};
  parsedImageData.filename = image.name;
  parsedImageData.size = image.size;
  parsedImageData.regions = parseShapesData(image.shapes, image.imageDimensions);
  return parsedImageData;
}

// All formats:
// what happens when there are no shapes in an image

function saveCurrentImageDetails(allImageProperties) {
  const currentlySelectedImageId = getCurrentImageId();
  const currentlySelectedImageProperties = getImageProperties();
  const imageDimensions = {};
  imageDimensions.scaleX = currentlySelectedImageProperties.scaleX;
  imageDimensions.scaleY = currentlySelectedImageProperties.scaleY;
  allImageProperties[currentlySelectedImageId].imageDimensions = imageDimensions;
  allImageProperties[currentlySelectedImageId].shapes = getAllExistingShapes();
}

function downloadVGGJSON() {
  const allImageProperties = getAllImageData();
  const marshalledObject = {};
  saveCurrentImageDetails(allImageProperties);
  allImageProperties.forEach((image) => {
    const parsedImageData = parseImageData(image);
    const objectName = `${parsedImageData.filename}${parsedImageData.size}`;
    marshalledObject[objectName] = parsedImageData;
  });
  const downloadableElement = generateTempDownloadableJSONElement(marshalledObject);
  downloadableElement.click();
}

export { downloadVGGJSON as default };
