import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';
import { getCurrentImageId } from '../../stateManager';
import adjustIncorrectBoundingBoxCoordinates from '../sharedUtils/adjustShapeCoordinates';

function getJSONPolygonPointsCoordinates(polygon, imageDimensions) {
  const coordinatesObj = {
    all_points_x: [],
    all_points_y: [],
  };
  polygon.points.forEach((point) => {
    coordinatesObj.all_points_x.push(Math.round(point.x / imageDimensions.scaleX));
    coordinatesObj.all_points_y.push(Math.round(point.y / imageDimensions.scaleY));
  });
  return coordinatesObj;
}

function getJSONFileName() {
  const currentDate = new Date();
  return `myLabel-${currentDate.getDay()}-${currentDate.getMonth()}-${currentDate.getFullYear()}.json`;
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

// function parseBoundingBoxData(boundingBox, dimensions) {
//   const {
//     xMin, yMin, newWidth, newHeight,
//   } = adjustIncorrectBoundingBoxCoordinates(boundingBox, dimensions);
//   const shapeCoordinatesObject = {};
//   shapeCoordinatesObject.shape_attributes = {};
//   shapeCoordinatesObject.shape_attributes.name = 'rect';
//   shapeCoordinatesObject.shape_attributes.x = xMin;
//   shapeCoordinatesObject.shape_attributes.y = yMin;
//   shapeCoordinatesObject.shape_attributes.width = newWidth;
//   shapeCoordinatesObject.shape_attributes.height = newHeight;
//   shapeCoordinatesObject.region_attributes = {};
//   shapeCoordinatesObject.region_attributes.name = boundingBox.shapeLabelText;
//   return shapeCoordinatesObject;
// }

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
      const coordinatesObj = getJSONPolygonPointsCoordinates(shape, imageDimensions);
      shapesCoordinates.push({
        shape_attributes: {
          name: 'polygon',
          all_points_x: coordinatesObj.all_points_x,
          all_points_y: coordinatesObj.all_points_y,
        },
        region_attributes: {
          name: shape.shapeLabelText,
        },
      });
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
    marshalledObject[image.name] = parseImageData(image);
  });
  const downloadableElement = generateTempDownloadableJSONElement(marshalledObject);
  downloadableElement.click();
}

export { downloadVGGJSON as default };
