import { getImageProperties } from '../../imageList/uploadImages/drawImageOnCanvas.js';
import { getAllImageData } from '../../imageList/imageList.js';
import { getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes.js';
import { getLabelOptions } from '../../labelList/labelOptions.js';
import { getCurrentImageId } from '../../state.js';
import {
  roundNumberToDecimalPlaces,
  adjustIncorrectBoundingBoxCoordinates,
  adjustIncorrectPolygonPointCoordinates,
} from '../sharedUtils/adjustShapeCoordinates.js';

const decimalPlaces = 2;

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

function calculatePolygonArea(coordinatesArg) {
  const coordinates = [...coordinatesArg];
  if (coordinatesArg[0] !== coordinatesArg[coordinatesArg.length - 2]
    || coordinatesArg[1] !== coordinatesArg[coordinatesArg.length - 1]) {
    coordinates.push(coordinates[0]);
    coordinates.push(coordinates[1]);
  }
  let area = 0;
  for (let i = 0; i < coordinates.length - 2; i += 2) {
    area += coordinates[i] * coordinates[i + 3] - coordinates[i + 2] * coordinates[i + 1];
  }
  return area / 2;
}


function parsePolygonProperties(polygon, imageDimensions) {
  const properties = { segmentation: [], bbox: [], area: 0 };
  let minX = 999999999999;
  let minY = 999999999999;
  let maxX = 0;
  let maxY = 0;
  const pointsArray = [];
  polygon.points.forEach((point) => {
    const {
      pointX, pointY,
    } = adjustIncorrectPolygonPointCoordinates(point, imageDimensions, decimalPlaces);
    pointsArray.push(pointX);
    pointsArray.push(pointY);
    if (pointX < minX) { minX = pointX; }
    if (pointY < minY) { minY = pointY; }
    if (pointX > maxX) { maxX = pointX; }
    if (pointY > maxY) { maxY = pointY; }
  });
  properties.segmentation = [pointsArray];
  const bboxWidth = roundNumberToDecimalPlaces(maxX - minX, decimalPlaces);
  const bboxHeight = roundNumberToDecimalPlaces(maxY - minY, decimalPlaces);
  properties.bbox.push(minX);
  properties.bbox.push(minY);
  properties.bbox.push(bboxWidth);
  properties.bbox.push(bboxHeight);
  properties.area = roundNumberToDecimalPlaces(calculatePolygonArea(pointsArray), decimalPlaces);
  return properties;
}

function parseBoundingBoxProperties(boundingBox, imageDimensions) {
  const properties = { segmentation: [], bbox: [], area: 0 };
  const {
    left, top, width, height,
  } = adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions, decimalPlaces);
  const rightCoordinate = roundNumberToDecimalPlaces(left + width, decimalPlaces);
  const bottomCoordinate = roundNumberToDecimalPlaces(top + height, decimalPlaces);
  const pointsArray = [];
  pointsArray.push(left);
  pointsArray.push(top);
  pointsArray.push(rightCoordinate);
  pointsArray.push(top);
  pointsArray.push(rightCoordinate);
  pointsArray.push(bottomCoordinate);
  pointsArray.push(left);
  pointsArray.push(bottomCoordinate);
  properties.segmentation = [pointsArray];
  properties.bbox.push(left);
  properties.bbox.push(top);
  properties.bbox.push(width);
  properties.bbox.push(height);
  properties.area = roundNumberToDecimalPlaces(width * height, decimalPlaces);
  return properties;
}

function getCategoryIdByLabelText(categories, text) {
  return categories[text];
}

function parseShapeProperties(shape, imageDimensions) {
  if (shape.shapeName === 'polygon') {
    return parsePolygonProperties(shape, imageDimensions);
  }
  if (shape.shapeName === 'bndBox') {
    return parseBoundingBoxProperties(shape, imageDimensions);
  }
  return { segmentation: [], bbox: [], area: 0 };
}

function parseImageShapeData(shape, imageId, shapeId, imageDimensions, categories) {
  const parsedImageShapeData = {};
  parsedImageShapeData.id = shapeId;
  parsedImageShapeData.image_id = imageId;
  parsedImageShapeData.category_id = getCategoryIdByLabelText(categories, shape.shapeLabelText);
  const shapeProperties = parseShapeProperties(shape, imageDimensions);
  parsedImageShapeData.segmentation = shapeProperties.segmentation;
  parsedImageShapeData.area = shapeProperties.area;
  parsedImageShapeData.bbox = shapeProperties.bbox;
  parsedImageShapeData.isCrowd = 0;
  return parsedImageShapeData;
}

// All formats:

// column_name = ['filename', 'width', 'height',
// 'class', 'xmin', 'ymin', 'xmax', 'ymax']
// what happens when there are no shapes in an image

function parseImageData(image, imageId) {
  const parsedImageData = {};
  parsedImageData.id = imageId;
  parsedImageData.width = image.imageDimensions.originalWidth;
  parsedImageData.height = image.imageDimensions.originalHeight;
  parsedImageData.file_name = image.name;
  parsedImageData.license = 1;
  parsedImageData.date_captured = '';
  return parsedImageData;
}

function parseLabelData(label, labelId) {
  const parsedLabelData = {};
  parsedLabelData.id = labelId;
  parsedLabelData.name = label.text;
  parsedLabelData.supercategory = 'none';
  return parsedLabelData;
}

function getImageAndAnnotationData(allImageProperties, categoriesObject) {
  const imageAndAnnotationData = { images: [], annotations: [] };
  let imageId = 0;
  let shapeId = 0;
  allImageProperties.forEach((image) => {
    if (image.imageDimensions) {
      imageAndAnnotationData.images.push(parseImageData(image, imageId));
      Object.keys(image.shapes).forEach((key) => {
        const shape = image.shapes[key].shapeRef;
        imageAndAnnotationData.annotations.push(parseImageShapeData(shape, imageId,
          shapeId, image.imageDimensions, categoriesObject));
        shapeId += 1;
      });
      imageId += 1;
    }
  });
  return imageAndAnnotationData;
}

function getCategoriesData() {
  const categoriesData = { categoriesArray: [], categoriesObject: {} };
  const labels = getLabelOptions();
  let labelId = 0;
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    const label = labels[i];
    categoriesData.categoriesArray.push(parseLabelData(label, labelId));
    categoriesData.categoriesObject[label.text] = labelId;
    labelId += 1;
  }
  return categoriesData;
}

function saveCurrentImageDetails(allImageProperties) {
  const currentlySelectedImageId = getCurrentImageId();
  const currentlySelectedImageProperties = getImageProperties();
  const imageDimensions = {};
  imageDimensions.scaleX = currentlySelectedImageProperties.scaleX;
  imageDimensions.scaleY = currentlySelectedImageProperties.scaleY;
  imageDimensions.originalWidth = currentlySelectedImageProperties.originalWidth;
  imageDimensions.originalHeight = currentlySelectedImageProperties.originalHeight;
  allImageProperties[currentlySelectedImageId].imageDimensions = imageDimensions;
  allImageProperties[currentlySelectedImageId].shapes = getAllExistingShapes();
}

function downloadCOCOJSON() {
  const marshalledObject = {};
  const allImageProperties = getAllImageData();
  saveCurrentImageDetails(allImageProperties);
  const categoriesData = getCategoriesData();
  const imageAndAnnotationData = getImageAndAnnotationData(allImageProperties,
    categoriesData.categoriesObject);
  marshalledObject.images = imageAndAnnotationData.images;
  marshalledObject.annotations = imageAndAnnotationData.annotations;
  marshalledObject.licenses = [{ id: 1, name: 'Unknown', url: '' }];
  marshalledObject.categories = categoriesData.categoriesArray;
  const downloadableElement = generateTempDownloadableJSONElement(marshalledObject);
  downloadableElement.click();
}

export { downloadCOCOJSON as default };
