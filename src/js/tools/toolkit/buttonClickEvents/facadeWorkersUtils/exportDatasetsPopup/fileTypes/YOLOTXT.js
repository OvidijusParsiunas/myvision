import JSZip from 'jszip';
import { getImageProperties } from '../../uploadFile/drawImageOnCanvas';
import { getAllImageData, getCurrentlySelectedImageId } from '../../../../../imageList/imageList';
import { getAllExistingShapes } from '../../../../../../canvas/objects/allShapes/allShapes';
import { getLabelOptions } from '../../../../../labelList/labelOptions';

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

function getCategoryIdByLabelText(categories, text) {
  return categories[text];
}

function parseBoundingBoxData(boundingBox, dimensions, categories) {
  const boundingBoxData = {};
  boundingBoxData.class = getCategoryIdByLabelText(categories, boundingBox.shapeLabelText);
  const width = (boundingBox.width / dimensions.scaleX) / dimensions.originalWidth;
  const height = (boundingBox.height / dimensions.scaleY) / dimensions.originalHeight;
  const xmiddle = ((boundingBox.left + (boundingBox.width / 2)) / dimensions.scaleX)
    / dimensions.originalWidth;
  const ymiddle = ((boundingBox.top + (boundingBox.height / 2)) / dimensions.scaleY)
    / dimensions.originalHeight;
  boundingBoxData.xmiddle = xmiddle.toFixed(6);
  boundingBoxData.ymiddle = ymiddle.toFixed(6);
  boundingBoxData.width = width.toFixed(6);
  boundingBoxData.height = height.toFixed(6);
  return boundingBoxData;
}

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

function buildDownloadableZip(annotatedImages) {
  const zip = new JSZip();
  const imagesFolder = zip.folder('images');
  const regexToFindFirstWordBeforeFullStop = new RegExp('^([^.]+)');
  annotatedImages.forEach((annotatedImage) => {
    const imageName = `${regexToFindFirstWordBeforeFullStop.exec(annotatedImage.imageName)[0]}.txt`;
    imagesFolder.file(imageName, annotatedImage.data);
  });
  return imagesFolder;
}

function getCategoriesData() {
  const categoriesData = {};
  const labels = getLabelOptions();
  let labelId = 0;
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    categoriesData[labels[i].text] = labelId;
    labelId += 1;
  }
  return categoriesData;
}

function getAnnotatedString(boundingBox, imageDimensions, categoriesData) {
  let str = '';
  const boundingBoxData = parseBoundingBoxData(boundingBox, imageDimensions,
    categoriesData);
  Object.keys(boundingBoxData).forEach((boundingBoxKey) => {
    str += `${boundingBoxData[boundingBoxKey]} `;
  });
  return str;
}


function getImageAndAnnotationData(allImageProperties, categoriesData) {
  const imageAndAnnotationData = [];
  allImageProperties.forEach((image) => {
    if (image.imageDimensions) {
      let imageString = '';
      Object.keys(image.shapes).forEach((key) => {
        const shape = image.shapes[key].shapeRef;
        if (shape.shapeName === 'bndBox') {
          imageString += getAnnotatedString(shape, image.imageDimensions, categoriesData);
          imageString = `${imageString.trim()}\n`;
        }
      });
      if (imageString.length > 0) {
        imageAndAnnotationData.push({ imageName: image.name, data: imageString });
      }
    }
  });
  return imageAndAnnotationData;
}

function downloadYOLOTXT() {
  const allImageProperties = getAllImageData();
  saveCurrentImageDetails(allImageProperties);
  const categoriesData = getCategoriesData();
  const imageAndAnnotationData = getImageAndAnnotationData(allImageProperties, categoriesData);
  const downloadableZip = buildDownloadableZip(imageAndAnnotationData);
  downloadZip(downloadableZip);
}

export { downloadYOLOTXT as default };
