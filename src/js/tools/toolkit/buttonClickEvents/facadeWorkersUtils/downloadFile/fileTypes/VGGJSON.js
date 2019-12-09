import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData, getCurrentlySelectedImageId } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';

function getJSONPolygonPointsCoordinates(polygon, dimensions) {
  const coordinatesObj = {
    all_points_x: [],
    all_points_y: [],
  };
  polygon.points.forEach((point) => {
    coordinatesObj.all_points_x.push(Math.round(point.x / dimensions.scaleX));
    coordinatesObj.all_points_y.push(Math.round(point.y / dimensions.scaleY));
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

function getShapesData(shapes, dimensions) {
  const shapesCoordinates = [];
  Object.keys(shapes).forEach((key) => {
    const shape = shapes[key].shapeRef;
    if (shape.shapeName === 'polygon') {
      const coordinatesObj = getJSONPolygonPointsCoordinates(shape, dimensions);
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
      shapesCoordinates.push({
        shape_attributes: {
          name: 'rect',
          x: Math.round(shape.left / dimensions.scaleX),
          y: Math.round(shape.top / dimensions.scaleY),
          width: Math.round(shape.width / dimensions.scaleX),
          height: Math.round(shape.height / dimensions.scaleY),
        },
        region_attributes: {
          name: shape.shapeLabelText,
        },
      });
    }
  });
  return shapesCoordinates;
}

function parseImageData(image) {
  const parsedImageData = {};
  parsedImageData.filename = image.name;
  parsedImageData.size = image.size;
  parsedImageData.regions = getShapesData(image.shapes, image.imageDimensions);

  return parsedImageData;
}

// All formats:
// what happens when there are no shapes in an image

function saveCurrentImageDetails(allImageProperties) {
  const currentlySelectedImageId = getCurrentlySelectedImageId();
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
