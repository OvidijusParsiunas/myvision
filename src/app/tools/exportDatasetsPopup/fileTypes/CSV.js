import { getImageProperties } from '../../imageList/uploadImages/drawImageOnCanvas.js';
import { getAllImageData } from '../../imageList/imageList.js';
import { getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes.js';
import { getCurrentImageId } from '../../state.js';
import { adjustIncorrectBoundingBoxCoordinates } from '../sharedUtils/adjustShapeCoordinates.js';

const columnHeaders = {
  filename: 'filename',
  width: 'width',
  height: 'height',
  class: 'class',
  xmin: 'xmin',
  ymin: 'ymin',
  xmax: 'xmax',
  ymax: 'ymax',
};

function getJSONFileName() {
  const currentDate = new Date();
  return `visionai-${currentDate.getDay()}-${currentDate.getMonth()}-${currentDate.getFullYear()}.csv`;
}

function generateTempDownloadableJSONElement(json) {
  const pom = document.createElement('a');
  const bb = new Blob([json], { type: 'text/csv;charset=utf-8;' });
  pom.setAttribute('href', window.URL.createObjectURL(bb));
  pom.setAttribute('download', getJSONFileName());
  pom.dataset.downloadurl = ['text/csv;charset=utf-8;', pom.download, pom.href].join(':');
  pom.draggable = true;
  pom.classList.add('dragout');
  return pom;
}

// All formats:
// what happens when there are no shapes in an image

function constructCsvString(csvArray) {
  let csvString = '';
  for (let i = 0; i < csvArray.length; i += 1) {
    let line = '';
    Object.keys(csvArray[i]).forEach((key) => {
      if (line !== '') line += ',';
      line += csvArray[i][key];
    });
    csvString += `${line}\r\n`;
  }
  return csvString;
}

function buildCSVRowObj(imageData, boundingBoxData) {
  return { ...imageData, ...boundingBoxData };
}

function parseBoundingBoxData(boundingBox, imageDimensions) {
  const boundingBoxData = {};
  boundingBoxData.class = boundingBox.shapeLabelText.replace(',', '');
  const {
    left, top, width, height,
  } = adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions);
  boundingBoxData.xmin = Math.round(left);
  boundingBoxData.ymin = Math.round(top);
  boundingBoxData.xmax = Math.round(left + width);
  boundingBoxData.ymax = Math.round(top + height);
  return boundingBoxData;
}

function getImageData(image) {
  const imageData = {};
  imageData.filename = image.name.replace(',', '');
  imageData.width = image.imageDimensions.originalWidth;
  imageData.height = image.imageDimensions.originalHeight;
  return imageData;
}

function getImageAndAnnotationData(allImageProperties) {
  const imageAndAnnotationData = [];
  allImageProperties.forEach((image) => {
    if (image.imageDimensions) {
      const imageData = getImageData(image);
      Object.keys(image.shapes).forEach((key) => {
        const shape = image.shapes[key].shapeRef;
        if (shape.shapeName === 'bndBox') {
          const boundingBoxData = parseBoundingBoxData(shape, image.imageDimensions);
          const csvRow = buildCSVRowObj(imageData, boundingBoxData);
          imageAndAnnotationData.push(csvRow);
        }
      });
    }
  });
  return imageAndAnnotationData;
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

function downloadCSV() {
  const allImageProperties = getAllImageData();
  saveCurrentImageDetails(allImageProperties);
  const csvArray = [];
  const imageAndAnnotationData = getImageAndAnnotationData(allImageProperties);
  csvArray.push(columnHeaders);
  csvArray.push(...imageAndAnnotationData);
  const csvString = constructCsvString(csvArray);
  const downloadableElement = generateTempDownloadableJSONElement(csvString);
  downloadableElement.click();
}

export { downloadCSV as default };
