import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';
import { getLabelOptions } from '../../../../../labelList/labelOptions';
import { getCurrentImageId } from '../../stateManager';
import adjustIncorrectBoundingBoxCoordinates from '../sharedUtils/adjustShapeCoordinates';

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

function getPolygonProperties(polygon, imageDimensions) {
  const properties = { segmentation: [], bbox: [], area: 0 };
  let minX = 999999999999;
  let minY = 999999999999;
  let maxX = 0;
  let maxY = 0;
  polygon.points.forEach((point) => {
    const pointX = Math.round(point.x / imageDimensions.scaleX);
    const pointY = Math.round(point.y / imageDimensions.scaleY);
    properties.segmentation.push(pointX);
    properties.segmentation.push(pointY);
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

function getBoundingBoxProperties(boundingBox, imageDimensions) {
  const properties = { segmentation: [], bbox: [], area: 0 };
  const {
    left, top, width, height,
  } = adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions);
  properties.segmentation.push(Math.round(left));
  properties.segmentation.push(Math.round(top));
  properties.segmentation.push(Math.round(left + width));
  properties.segmentation.push(Math.round(top));
  properties.segmentation.push(Math.round(left + width));
  properties.segmentation.push(Math.round(top + height));
  properties.segmentation.push(Math.round(left));
  properties.segmentation.push(Math.round(top + height));
  properties.bbox.push(Math.round(left));
  properties.bbox.push(Math.round(top));
  properties.bbox.push(Math.round(width));
  properties.bbox.push(Math.round(height));
  properties.area = Math.round(width * height);
  return properties;
}

function getCategoryIdByLabelText(categories, text) {
  return categories[text];
}

function getShapeProperties(shape, imageDimensions) {
  if (shape.shapeName === 'polygon') {
    return getPolygonProperties(shape, imageDimensions);
  }
  if (shape.shapeName === 'bndBox') {
    return getBoundingBoxProperties(shape, imageDimensions);
  }
  return { segmentation: [], bbox: [], area: 0 };
}

function parseImageShapeData(shape, imageId, shapeId, imageDimensions, categories) {
  const parsedImageShapeData = {};
  parsedImageShapeData.id = shapeId;
  parsedImageShapeData.image_id = imageId;
  parsedImageShapeData.category_id = getCategoryIdByLabelText(categories, shape.shapeLabelText);
  const shapeProperties = getShapeProperties(shape, imageDimensions);
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
