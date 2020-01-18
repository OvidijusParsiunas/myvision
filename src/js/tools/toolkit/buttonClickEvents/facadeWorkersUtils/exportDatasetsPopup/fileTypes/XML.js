import JSZip from 'jszip';
import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';
import { getCurrentImageId } from '../../stateManager';

/*
If there is an error on generating zips - try to use a file receiver
import FileSaver from 'file-saver';
import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData, getCurrentlySelectedImageId } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';

function getFileName() {
  const currentDate = new Date();
  return `myLabel-${currentDate.getDay()}-
    ${currentDate.getMonth()}-${currentDate.getFullYear()}.zip`;
}

function downloadZip(xml) {
  xml.generateAsync({ type: 'blob' }).then((blob) => {
    FileSaver.saveAs(blob, getFileName());
  });
}

*/
function getFileName() {
  const currentDate = new Date();
  return `myLabel-${currentDate.getDay()}-${currentDate.getMonth()}-${currentDate.getFullYear()}.zip`;
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

function isShapeOnBottomRightBordersOfImage(xMax, yMax, dimensions) {
  return xMax >= dimensions.originalWidth || yMax >= dimensions.originalHeight;
}

function isShapeOnTopLeftBordersOfImage(xMin, yMin) {
  return xMin <= 0 || yMin <= 0;
}

function isShapeTruncated(xMin, yMin, xMax, yMax, dimensions) {
  return isShapeOnTopLeftBordersOfImage(xMin, yMin)
  || isShapeOnBottomRightBordersOfImage(xMax, yMax, dimensions);
}

function parseBoundingBoxData(boundingBox, dimensions) {
  const parsedShapeData = {};
  const xMin = Math.round(boundingBox.left / dimensions.scaleX);
  const yMin = Math.round(boundingBox.top / dimensions.scaleY);
  const width = Math.round(boundingBox.width / dimensions.scaleX);
  const height = Math.round(boundingBox.height / dimensions.scaleY);
  const xMax = xMin + width;
  const yMax = yMin + height;
  const truncated = isShapeTruncated(xMin, yMin, xMax, yMax, dimensions) ? 1 : 0;
  parsedShapeData.name = boundingBox.shapeLabelText;
  parsedShapeData.pose = 'Unspecified';
  parsedShapeData.truncated = truncated;
  parsedShapeData.difficult = 0;
  parsedShapeData.bndbox = {};
  parsedShapeData.bndbox.xmin = xMin;
  parsedShapeData.bndbox.ymin = yMin;
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
