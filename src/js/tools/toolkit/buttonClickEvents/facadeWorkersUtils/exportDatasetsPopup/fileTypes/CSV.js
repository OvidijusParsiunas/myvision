import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';
import { getCurrentImageId } from '../../stateManager';

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
  return `myLabel-${currentDate.getDay()}-${currentDate.getMonth()}-${currentDate.getFullYear()}.csv`;
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

function getBoundingBoxData(boundingBox, dimensions) {
  const boundingBoxData = {};
  boundingBoxData.class = boundingBox.shapeLabelText;
  const topLeftX = boundingBox.left / dimensions.scaleX;
  const topleftY = boundingBox.top / dimensions.scaleY;
  const width = boundingBox.width / dimensions.scaleX;
  const height = boundingBox.height / dimensions.scaleY;
  boundingBoxData.xmin = Math.round(topLeftX);
  boundingBoxData.ymin = Math.round(topleftY);
  boundingBoxData.xmax = Math.round(topLeftX + width);
  boundingBoxData.ymax = Math.round(topleftY + height);
  return boundingBoxData;
}

function getImageData(image) {
  const imageData = {};
  imageData.filename = image.name;
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
          const boundingBoxData = getBoundingBoxData(shape, image.imageDimensions);
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
  // VGG16
  // VGG19
  // InceptionV3
  // MobileNet
  // ResNet50dimensions
}

export { downloadCSV as default };
