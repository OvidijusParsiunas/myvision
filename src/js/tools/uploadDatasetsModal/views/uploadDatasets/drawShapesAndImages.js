import { drawShapesViaCoordinates } from '../../../../canvas/utils/drawShapesViaCoordinates/drawShapesViaCoordinates';
import { addImageFromMultiUploadToList } from '../../../imageList/imageList';
import { removeNoImagesFoundOnMLModalStyle } from '../../../machineLearningModal/views/initiateMachineLearning/style';
import { onImageLoad } from '../../../imageList/uploadImage/drawImageOnCanvas';
import { getReuseAlreadyUploadedImagesState } from '../../stateMachine';

let finalObjectAssemblerFunc = null;

function drawImages(images) {
  for (let i = 0; i < images.length; i += 1) {
    if (!images[i].alreadyUploaded) {
      const { fileMetaData, imageElement } = images[i].body;
      const firstImage = i === 0;
      addImageFromMultiUploadToList(fileMetaData, imageElement, firstImage);
      removeNoImagesFoundOnMLModalStyle();
      if (firstImage) { onImageLoad(imageElement); }
    }
  }
}

function drawShapesAndImages() {
  const { images, shapes } = finalObjectAssemblerFunc();
  drawImages(images);
  setTimeout(() => {
    const isUsingMachineLearning = false;
    drawShapesViaCoordinates(shapes, isUsingMachineLearning, getReuseAlreadyUploadedImagesState());
  }, 0);
}

function setFinalObjectAssembler(finalObjectAssemblerFuncArg) {
  finalObjectAssemblerFunc = finalObjectAssemblerFuncArg;
}

export { drawShapesAndImages, setFinalObjectAssembler };
