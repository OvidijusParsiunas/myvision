import JSZip from 'jszip';
import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';
import { getLabelOptions, getMaxUsedLabelIndex } from '../../../../../labelList/labelOptions';
import { getCurrentImageId } from '../../stateMachine';
import { adjustIncorrectBoundingBoxCoordinates } from '../sharedUtils/adjustShapeCoordinates';

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

function buildDownloadableZip(annotationFilesData, namesFileData) {
  const zip = new JSZip();
  const imagesFolder = zip.folder('images');
  annotationFilesData.forEach((annotationFile) => {
    imagesFolder.file(annotationFile.imageName, annotationFile.data);
  });
  imagesFolder.file('classes.txt', namesFileData);
  return imagesFolder;
}

function generateNamesFileData(namesData) {
  let classesString = '';
  Object.keys(namesData).forEach((key) => {
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

function getAnnotatedString(boundingBox, imageDimensions, namesData) {
  let str = '';
  const boundingBoxData = parseBoundingBoxData(boundingBox, imageDimensions,
    namesData);
  Object.keys(boundingBoxData).forEach((boundingBoxKey) => {
    str += `${boundingBoxData[boundingBoxKey]} `;
  });
  return str;
}

function getImageAndAnnotationData(allImageProperties, namesData) {
  const imageAndAnnotationData = [];
  allImageProperties.forEach((image) => {
    if (image.imageDimensions) {
      let imageString = '';
      Object.keys(image.shapes).forEach((key) => {
        const shape = image.shapes[key].shapeRef;
        if (shape.shapeName === 'bndBox') {
          imageString += getAnnotatedString(shape, image.imageDimensions, namesData);
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

function generateAnnotationFilesData(allImageProperties, namesData) {
  const imageAndAnnotationData = getImageAndAnnotationData(allImageProperties, namesData);
  const annotationsFiles = [];
  const regexToFindFirstWordBeforeFullStop = new RegExp('^([^.]+)');
  imageAndAnnotationData.forEach((annotatedImage) => {
    const imageName = `${regexToFindFirstWordBeforeFullStop.exec(annotatedImage.imageName)[0]}.txt`;
    annotationsFiles.push({ imageName, data: annotatedImage.data });
  });
  return annotationsFiles;
}

function getNamesData() {
  const namesData = {};
  const labels = getLabelOptions();
  const maxUsedLabelIndex = getMaxUsedLabelIndex();
  let labelId = 0;
  // the for loop is reversed because the new labels are pushed to the front
  for (let i = maxUsedLabelIndex; i >= 0; i -= 1) {
    namesData[labels[i].text] = labelId;
    labelId += 1;
  }
  return namesData;
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
  const namesData = getNamesData();
  const annotationFilesData = generateAnnotationFilesData(allImageProperties, namesData);
  const namesFileData = generateNamesFileData(namesData);
  const downloadableZip = buildDownloadableZip(annotationFilesData, namesFileData);
  downloadZip(downloadableZip);
}

export { downloadYOLOTXT as default };
