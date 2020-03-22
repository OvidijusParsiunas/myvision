import { drawShapesCoordinatesFileUpload } from '../../../toolkit/buttonClickEvents/facadeWorkersUtils/drawShapesViaCoordinates/drawShapesViaCoordinates';
import { addImageFromMultiUploadToList } from '../../../imageList/imageList';
import { removeNoImagesFoundOnMLModalStyle } from '../../../machineLearningModal/views/initiateMachineLearning/style';
import { onImageLoad } from '../../../toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';

let finalObjectAssemblerFunc = null;

// drawing new images regardless if they exist at the moment
function drawImages(images) {
  for (let i = 0; i < images.length; i += 1) {
    const { fileMetaData, imageElement } = images[i];
    const firstImage = i === 0;
    addImageFromMultiUploadToList(fileMetaData, imageElement, firstImage);
    removeNoImagesFoundOnMLModalStyle();
    if (firstImage) { onImageLoad(imageElement); }
  }
}

function drawShapesAndImages() {
  const { images, shapes } = finalObjectAssemblerFunc();
  drawImages(images);
  setTimeout(() => {
    drawShapesCoordinatesFileUpload(shapes);
  }, 0);
}

function setFinalObjectAssembler(finalObjectAssemblerFuncArg) {
  finalObjectAssemblerFunc = finalObjectAssemblerFuncArg;
}

export { drawShapesAndImages, setFinalObjectAssembler };
