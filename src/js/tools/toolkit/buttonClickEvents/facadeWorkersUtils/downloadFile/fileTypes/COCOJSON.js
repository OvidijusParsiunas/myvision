import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData, getCurrentlySelectedImageId } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';
import { getLabelOptions } from '../../../../../labelList/labelOptions';

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

function parseLabelData(label, labelId) {
  const parsedLabelData = {};
  parsedLabelData.id = labelId;
  parsedLabelData.name = label.text;
  parsedLabelData.supercategory = 'none';
  return parsedLabelData;
}

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

function getPolygonProperties(polygon, dimensions) {
  const properties = { segmentations: [], bbox: [], area: 0 };
  let minX = 999999999999;
  let minY = 999999999999;
  let maxX = 0;
  let maxY = 0;
  polygon.points.forEach((point) => {
    const pointX = Math.round(point.x / dimensions.scaleX);
    const pointY = Math.round(point.y / dimensions.scaleY);
    properties.segmentations.push(pointX);
    properties.segmentations.push(pointY);
    if (pointX < minX) { minX = pointX; }
    if (pointY < minY) { minY = pointY; }
    if (pointX > maxX) { maxX = pointX; }
    if (pointY > maxY) { maxY = pointY; }
  });
  const bboxWidth = maxX - minX;
  const bboxHeight = maxY - minY;
  properties.bbox.push(minX);
  properties.bbox.push(minY);
  properties.bbox.push(bboxWidth);
  properties.bbox.push(bboxHeight);
  properties.area = bboxWidth * bboxHeight;
  return properties;
}

function getBoundingBoxProperties(boundingBox, dimensions) {
  const properties = { segmentations: [], bbox: [], area: 0 };
  const topLeftX = boundingBox.left / dimensions.scaleX;
  const topleftY = boundingBox.top / dimensions.scaleY;
  const width = boundingBox.width / dimensions.scaleX;
  const height = boundingBox.height / dimensions.scaleY;
  properties.segmentations.push(Math.round(topLeftX));
  properties.segmentations.push(Math.round(topleftY));
  properties.segmentations.push(Math.round(topLeftX + width));
  properties.segmentations.push(Math.round(topleftY));
  properties.segmentations.push(Math.round(topLeftX + width));
  properties.segmentations.push(Math.round(topleftY + height));
  properties.segmentations.push(Math.round(topLeftX));
  properties.segmentations.push(Math.round(topleftY + height));
  properties.bbox.push(Math.round(topLeftX));
  properties.bbox.push(Math.round(topleftY));
  properties.bbox.push(Math.round(width));
  properties.bbox.push(Math.round(height));
  properties.area = Math.round(width * height);
  return properties;
}

function getShapeProperties(shape, dimensions) {
  if (shape.shapeName === 'polygon') {
    return getPolygonProperties(shape, dimensions);
  }
  if (shape.shapeName === 'bndBox') {
    return getBoundingBoxProperties(shape, dimensions);
  }
  return { segmentations: [], bbox: [], area: 0 };
}

function getCategoryIdByLabelText(categories, text) {
  return categories[text];
}

function parseImageShapeData(shape, imageId, shapeId, dimensions, categories) {
  const parsedImageShapeData = {};
  parsedImageShapeData.id = shapeId;
  parsedImageShapeData.image_id = imageId;
  const shapeProperties = getShapeProperties(shape, dimensions);
  parsedImageShapeData.segmentations = shapeProperties.segmentations;
  parsedImageShapeData.bbox = shapeProperties.bbox;
  parsedImageShapeData.area = shapeProperties.area;
  parsedImageShapeData.isCrowd = 0;
  parsedImageShapeData.category_id = getCategoryIdByLabelText(categories, shape.shapeLabelText);
  return parsedImageShapeData;
}

// All formats:
// what happens when there are no shapes in an image

function saveCurrentImageDetails(allImageProperties) {
  const currentlySelectedImageId = getCurrentlySelectedImageId();
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
  const allImageProperties = getAllImageData();
  const marshalledObject = {};
  marshalledObject.images = [];
  marshalledObject.annotations = [];
  marshalledObject.categories = [];
  saveCurrentImageDetails(allImageProperties);
  const labels = getLabelOptions();
  let labelId = 0;
  const categoriesObject = {};
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    const label = labels[i];
    marshalledObject.categories.push(parseLabelData(label, labelId));
    categoriesObject[label.text] = labelId;
    labelId += 1;
  }
  let imageId = 0;
  allImageProperties.forEach((image) => {
    marshalledObject.images.push(parseImageData(image, imageId));
    let shapeId = 0;
    Object.keys(image.shapes).forEach((key) => {
      const shape = image.shapes[key].shapeRef;
      marshalledObject.annotations.push(parseImageShapeData(shape, imageId,
        shapeId, image.imageDimensions, categoriesObject));
      shapeId += 1;
    });
    imageId += 1;
  });
  marshalledObject.licenses = [{ id: 1, name: 'Unknown', url: '' }];
  const downloadableElement = generateTempDownloadableJSONElement(marshalledObject);
  downloadableElement.click();
}

export { downloadCOCOJSON as default };
