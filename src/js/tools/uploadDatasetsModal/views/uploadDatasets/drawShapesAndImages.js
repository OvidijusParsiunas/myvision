import { drawShapesCoordinatesFileUpload } from '../../../toolkit/buttonClickEvents/facadeWorkersUtils/drawShapesViaCoordinates/drawShapesViaCoordinates';
import { addImageFromMultiUploadToList } from '../../../imageList/imageList';
import { removeNoImagesFoundOnMLModalStyle } from '../../../machineLearningModal/views/initiateMachineLearning/style';
import { onImageLoad } from '../../../toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';

let finalObjectAssemblerFunc = null;

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
  // console.log(finalObject);
}

function setFinalObjectAssembler(finalObjectAssemblerFuncArg) {
  finalObjectAssemblerFunc = finalObjectAssemblerFuncArg;
}

export { drawShapesAndImages, setFinalObjectAssembler };
