//import JSZip from 'jszip.js';
import { getImageProperties } from '../../imageList/uploadImages/drawImageOnCanvas.js';
import { getAllImageData } from '../../imageList/imageList.js';
import { getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes.js';
import { getLabelOptions, getMaxUsedLabelIndex } from '../../labelList/labelOptions.js';
import { getCurrentImageId } from '../../state.js';
import { adjustIncorrectBoundingBoxCoordinates } from '../sharedUtils/adjustShapeCoordinates.js';

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

function buildDownloadableZip(annotationFilesData, classesFileData) {
  const zip = new JSZip();
  const imagesFolder = zip.folder('images');
  annotationFilesData.forEach((annotationFile) => {
    imagesFolder.file(annotationFile.imageName, annotationFile.data);
  });
  imagesFolder.file('classes.txt', classesFileData);
  return imagesFolder;
}

function generateClassesFileData(classesData) {
  let classesString = '';
  Object.keys(classesData).forEach((key) => {
    classesString += key.replace(',', '');
    classesString += '\n';
  });
  return classesString;
}

function getClassIdByLabelText(classes, text) {
  return classes[text];
}

function parseBoundingBoxData(boundingBox, imageDimensions, classes) {
  const boundingBoxData = {};
  boundingBoxData.class = getClassIdByLabelText(classes, boundingBox.shapeLabelText);
  const {
    left, top, width, height,
  } = adjustIncorrectBoundingBoxCoordinates(boundingBox, imageDimensions);
  const shapeWidthToImageWidth = width / imageDimensions.originalWidth;
  const shapeHeightToImageHeight = height / imageDimensions.originalHeight;
  const xmiddleToImageWidth = (left + (width / 2)) / imageDimensions.originalWidth;
  const ymiddleToImageHeight = (top + (height / 2)) / imageDimensions.originalHeight;
  boundingBoxData.xmiddle = xmiddleToImageWidth.toFixed(6);
  boundingBoxData.ymiddle = ymiddleToImageHeight.toFixed(6);
  boundingBoxData.width = shapeWidthToImageWidth.toFixed(6);
  boundingBoxData.height = shapeHeightToImageHeight.toFixed(6);
  return boundingBoxData;
}

function getAnnotatedString(boundingBox, imageDimensions, classesData) {
  let str = '';
  const boundingBoxData = parseBoundingBoxData(boundingBox, imageDimensions,
    classesData);
  Object.keys(boundingBoxData).forEach((boundingBoxKey) => {
    str += `${boundingBoxData[boundingBoxKey]} `;
  });
  return str;
}

function getImageAndAnnotationData(allImageProperties, classesData) {
  const imageAndAnnotationData = [];
  allImageProperties.forEach((image) => {
    if (image.imageDimensions) {
      let imageString = '';
      Object.keys(image.shapes).forEach((key) => {
        const shape = image.shapes[key].shapeRef;
        if (shape.shapeName === 'bndBox') {
          imageString += getAnnotatedString(shape, image.imageDimensions, classesData);
          imageString = `${imageString.trim()}\n`;
        }
      });
      if (imageString.length > 0) {
        imageAndAnnotationData.push({ imageName: image.name.replace(',', ''), data: imageString });
      }
    }
  });
  return imageAndAnnotationData;
}

function generateAnnotationFilesData(allImageProperties, classesData) {
  const imageAndAnnotationData = getImageAndAnnotationData(allImageProperties, classesData);
  const annotationsFiles = [];
  const regexToFindFirstWordBeforeFullStop = new RegExp('^([^.]+)');
  imageAndAnnotationData.forEach((annotatedImage) => {
    const imageName = `${regexToFindFirstWordBeforeFullStop.exec(annotatedImage.imageName)[0]}.txt`;
    annotationsFiles.push({ imageName, data: annotatedImage.data });
  });
  return annotationsFiles;
}

function getClassesData() {
  const classesData = {};
  const labels = getLabelOptions();
  const maxUsedLabelIndex = getMaxUsedLabelIndex();
  let labelId = 0;
  // the for loop is reversed because the new labels are pushed to the front
  for (let i = maxUsedLabelIndex; i >= 0; i -= 1) {
    classesData[labels[i].text] = labelId;
    labelId += 1;
  }
  return classesData;
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

function downloadYOLOTXT() {
  const allImageProperties = getAllImageData();
  saveCurrentImageDetails(allImageProperties);
  const classesData = getClassesData();
  const annotationFilesData = generateAnnotationFilesData(allImageProperties, classesData);
  const classesFileData = generateClassesFileData(classesData);
  const downloadableZip = buildDownloadableZip(annotationFilesData, classesFileData);
  downloadZip(downloadableZip);
}

export { downloadYOLOTXT as default };
