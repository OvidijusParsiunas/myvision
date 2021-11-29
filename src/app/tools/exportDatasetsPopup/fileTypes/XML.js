//import JSZip from 'jszip.js';
import { getImageProperties } from '../../imageList/uploadImages/drawImageOnCanvas.js';
import { getAllImageData } from '../../imageList/imageList.js';
import { getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes.js';
import { getCurrentImageId } from '../../state.js';
import { adjustIncorrectBoundingBoxCoordinates, roundNumberToDecimalPlaces } from '../sharedUtils/adjustShapeCoordinates.js';

/*
If there is an error on generating zips - try to use a file receiver
import FileSaver from 'file-saver.js';
import { getImageProperties } from '../../uploadImages/drawImageOnCanvas.js';
import { getAllImageData, getCurrentlySelectedImageId } from '../../../../../imageList/imageList.js';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes.js';

function getFileName() {
  const currentDate = new Date();
  return `visionai-${currentDate.getDay()}-
    ${currentDate.getMonth()}-${currentDate.getFullYear()}.zip`;
}

function downloadZip(xml) {
  xml.generateAsync({ type: 'blob' }).then((blob) => {
    FileSaver.saveAs(blob, getFileName());
  });
}

*/

const decimalPlaces = 0;

function getFileName() {
  const currentDate = new Date();
  return `visionai-${currentDate.getDay()}-${currentDate.getMonth()}-${currentDate.getFullYear()}.zip`;
}

function downloadZip(xml) {
  const pom = document.createElement('a');
  xml.generateAsync({ type: 'blob' }).then((blob) => {
    pom.setAttribute('href', window.URL.createObjectURL(blob));
    pom.setAttribute('download', getFileName());
    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');
    pom.click();
  });
}

function isShapeOnBottomRightBordersOfImage(xMax, yMax, imageDimensions) {
  return xMax >= imageDimensions.originalWidth || yMax >= imageDimensions.originalHeight;
}

function isShapeOnTopLeftBordersOfImage(xMin, yMin) {
  return xMin <= 1 || yMin <= 1;
}

function isShapeTruncated(xMin, yMin, xMax, yMax, imageDimensions) {
  return isShapeOnTopLeftBordersOfImage(xMin, yMin)
  || isShapeOnBottomRightBordersOfImage(xMax, yMax, imageDimensions);
}

function parseBoundingBoxData(boundingBox, imageDimensions) {
  const parsedShapeData = {};
  const {
    left, top, width, height,
  } = adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions, decimalPlaces);
  const xMax = roundNumberToDecimalPlaces(left + width, decimalPlaces);
  const yMax = roundNumberToDecimalPlaces(top + height, decimalPlaces);
  const truncated = isShapeTruncated(left, top, xMax, yMax, imageDimensions) ? 1 : 0;
  parsedShapeData.name = boundingBox.shapeLabelText;
  parsedShapeData.pose = 'Unspecified';
  parsedShapeData.truncated = truncated;
  parsedShapeData.difficult = 0;
  parsedShapeData.bndbox = {};
  parsedShapeData.bndbox.xmin = left;
  parsedShapeData.bndbox.ymin = top;
  parsedShapeData.bndbox.xmax = xMax;
  parsedShapeData.bndbox.ymax = yMax;
  return parsedShapeData;
}

function parseImageData(image) {
  const parsedImageData = {};
  parsedImageData.folder = 'Unknown';
  parsedImageData.filename = image.name;
  parsedImageData.path = 'Unknown';
  parsedImageData.source = { database: 'Unknown' };
  parsedImageData.size = {};
  parsedImageData.size.width = image.imageDimensions.originalWidth;
  parsedImageData.size.height = image.imageDimensions.originalHeight;
  parsedImageData.size.depth = 3;
  parsedImageData.segmented = 0;
  return parsedImageData;
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

function JSONtoXML(JSONObject, tabsString) {
  let tagString = '';
  tabsString = tabsString !== undefined ? tabsString += '\t' : '';
  Object.keys(JSONObject).forEach((key) => {
    if (typeof (JSONObject[key]) === 'object') {
      if (key === 'objects') {
        JSONObject[key].forEach((object) => {
          tagString += `${tabsString}<object>\n${JSONtoXML(object, tabsString)}${tabsString}</object>\n`;
        });
      } else {
        tagString += `${tabsString}<${key}>\n${JSONtoXML(JSONObject[key], tabsString)}${tabsString}</${key}>\n`;
      }
    } else {
      tagString += `${tabsString}<${key}>${JSONObject[key]}</${key}>\n`;
    }
  });
  return tagString;
}

// All formats:
// what happens when there are no shapes in an image

function buildDownloadableZip(annotatedImages) {
  const zip = new JSZip();
  const imagesFolder = zip.folder('images');
  const regexToFindFirstWordBeforeFullStop = new RegExp('^([^.]+)');
  annotatedImages.forEach((annotatedImage) => {
    const imageName = `${regexToFindFirstWordBeforeFullStop.exec(annotatedImage.annotation.filename)[0]}.xml`;
    const annotatedImageXML = JSONtoXML(annotatedImage);
    imagesFolder.file(imageName, annotatedImageXML);
  });
  return imagesFolder;
}

function getObjectsArray(image) {
  const objectsArray = [];
  Object.keys(image.shapes).forEach((key) => {
    const shape = image.shapes[key].shapeRef;
    if (shape.shapeName === 'bndBox') {
      objectsArray.push(parseBoundingBoxData(shape, image.imageDimensions));
    }
  });
  return objectsArray;
}

function getImageAndAnnotationData(allImageProperties) {
  const imageAndAnnotationData = [];
  allImageProperties.forEach((image) => {
    if (image.imageDimensions) {
      let annotationsObject = {};
      annotationsObject = { ...parseImageData(image) };
      annotationsObject.objects = getObjectsArray(image);
      if (annotationsObject.objects && annotationsObject.objects.length > 0) {
        imageAndAnnotationData.push({ annotation: annotationsObject });
      }
    }
  });
  return imageAndAnnotationData;
}

function downloadXML() {
  const allImageProperties = getAllImageData();
  saveCurrentImageDetails(allImageProperties);
  const imageAndAnnotationData = getImageAndAnnotationData(allImageProperties);
  const downloadableZip = buildDownloadableZip(imageAndAnnotationData);
  downloadZip(downloadableZip);
}

export { downloadXML as default };
