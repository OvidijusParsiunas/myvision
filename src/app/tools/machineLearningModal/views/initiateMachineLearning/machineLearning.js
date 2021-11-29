import { getAllImageData } from '../../../imageList/imageList.js';
import { drawTempShapesToShowCaseMLResults, updateImageThumbnails } from '../../../../canvas/utils/drawShapesViaCoordinates/drawShapesViaCoordinates.js';
import { getCurrentImageId } from '../../../state.js';
import {
  displayErrorMessage, changeToMLCompleteStyle, removeCancelButton, changeToNoImagesFoundStyle,
  displayNextButton, displayRetryButton, changeToLoadingStyle, removeLoadingContent,
} from './style.js';

let tfModel = null;
let isInProgress = false;
let isCancelled = false;
let modelLoadingInitiated = false;
let imagesToBeAnalysedByML = [];
const tensorflowJSScript = { element: document.createElement('script'), status: { download: 'waiting' } };
const cocoSSDScript = { element: document.createElement('script'), status: { download: 'waiting' } };

function errorHandler() {
  removeLoadingContent();
  displayErrorMessage('ERROR! Something went wrong, please try again later.');
  displayRetryButton();
  isInProgress = false;
}

function predict(image) {
  return tfModel.detect(image.data);
}

function isObjectEmpty(object) {
  return Object.keys(object).length === 0 && object.constructor === Object;
}

function displayPredictionResults(results, predictionIdToImageId,
  nextViewCallback, setMachineLearningDataFunc, coverage) {
  // opportunity for remembering the last changed label names by moving
  // this object outside of the function
  const predictedImageCoordinates = {};
  for (let i = 0; i < results.length; i += 1) {
    predictedImageCoordinates[predictionIdToImageId[i]] = results[i];
  }
  setMachineLearningDataFunc(predictedImageCoordinates);
  removeLoadingContent();
  removeCancelButton();
  if (isObjectEmpty(predictedImageCoordinates)) {
    nextViewCallback();
  } else {
    displayNextButton();
    if (coverage === 'all'
    || (coverage === 'new' && Object.prototype.hasOwnProperty.call(predictedImageCoordinates, getCurrentImageId()))) {
      drawTempShapesToShowCaseMLResults(predictedImageCoordinates);
    }
    updateImageThumbnails(predictedImageCoordinates);
    changeToMLCompleteStyle();
  }
  isInProgress = false;
}

function executeModel(images, results, predictionIdToImageId,
  nextViewCallback, setMachineLearningDataFunc, coverage) {
  if (isCancelled) return;
  if (images.length > 0) {
    predict(images.splice(0, 1)[0]).then((result) => {
      results.push(result);
      executeModel(images, results, predictionIdToImageId,
        nextViewCallback, setMachineLearningDataFunc, coverage);
    }).catch((error) => {
      console.error(error);
      errorHandler();
    });
  } else {
    displayPredictionResults(results, predictionIdToImageId,
      nextViewCallback, setMachineLearningDataFunc, coverage);
  }
}

// decided not to store generated shapes because if you have 100 images with
// 100s of shapes, it would lead to significant memory usage
function makePredictionsForAllImages(nextViewCallback, setMachineLearningData, coverage) {
  const allImageData = getAllImageData();
  const predictionIdToImageId = [];
  imagesToBeAnalysedByML = [];
  // optimisation for not generating shapes on untouched images taken out
  // as when displaying the generated label names, only the new name label
  // names were shown, but when looked at image, all of them were there
  // this did not look right in terms of UX
  // Optimisation description:
  // only predicting images with no highlighted shapes and current image
  // as it can have partial highlighting, so predicting all again
  // 12/01/2020
  for (let i = 0; i < allImageData.length; i += 1) {
    const image = allImageData[i];
    if (coverage === 'all' || (coverage === 'new' && !image.analysedByML)) {
      image.analysedByML = true;
      imagesToBeAnalysedByML.push(image);
      predictionIdToImageId.push(i);
    }
  }
  const images = [...imagesToBeAnalysedByML];
  executeModel(images, [], predictionIdToImageId,
    nextViewCallback, setMachineLearningData, coverage);
}

function markScriptDownloadSuccessfull(status) {
  status.download = 'complete';
}

function loadModel(status) {
  markScriptDownloadSuccessfull(status);
  return new Promise((resolve, reject) => {
    if (isCancelled) return;
    const { cocoSsd } = window;
    if (!modelLoadingInitiated) {
      modelLoadingInitiated = true;
      cocoSsd.load().then((model) => {
        tfModel = model;
        if (isCancelled) return;
        resolve();
      }).catch(() => {
        modelLoadingInitiated = false;
        reject();
      });
    }
  });
}

function downloadScript(script, url, resolve, reject) {
  if (isCancelled) return;
  if (script.status.download === 'complete') {
    resolve(script.status);
    return;
  }
  if (script.status.download === 'in_progress') {
    document.head.removeChild(script.element);
    script.element = document.createElement('script');
  }
  script.element.onload = resolve.bind(this, script.status);
  script.element.onerror = reject;
  script.status.download = 'in_progress';
  script.element.src = url;
  document.head.appendChild(script.element);
}

function downloadCOCOSSD(status) {
  markScriptDownloadSuccessfull(status);
  return new Promise((resolve, reject) => {
    downloadScript(cocoSSDScript, 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.1.0',
      resolve, reject);
  });
}

function downloadTensorflowJS() {
  return new Promise((resolve, reject) => {
    downloadScript(tensorflowJSScript, 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.1',
      resolve, reject);
  });
}

function startMachineLearning(nextViewCallback, setMachineLearningData, coverage) {
  if (isCancelled) { isCancelled = false; }
  const allImageData = getAllImageData();
  if (allImageData.length > 0) {
    changeToLoadingStyle();
    isInProgress = true;
    if (!tfModel) {
      downloadTensorflowJS()
        .then(resultScriptStatus => downloadCOCOSSD(resultScriptStatus))
        .then(resultScriptStatus => loadModel(resultScriptStatus))
        .then(() => makePredictionsForAllImages(nextViewCallback, setMachineLearningData, coverage))
        .catch(() => errorHandler());
    } else {
      makePredictionsForAllImages(nextViewCallback, setMachineLearningData, coverage);
    }
  } else {
    changeToNoImagesFoundStyle();
  }
}

function isFractionOfImagesAnalysedByML() {
  const images = getAllImageData();
  let imagesAnalysedByML = false;
  let imagesNotYetAnalysedByML = false;
  for (let i = 0; i < images.length; i += 1) {
    if (images[i].analysedByML) {
      imagesAnalysedByML = true;
    } else {
      imagesNotYetAnalysedByML = true;
    }
    if (imagesAnalysedByML && imagesNotYetAnalysedByML) {
      return true;
    }
  }
  return false;
}

function cancelMachineLearning() {
  isCancelled = true;
  isInProgress = false;
  imagesToBeAnalysedByML.forEach((image) => { image.analysedByML = false; });
}

function getProgressStatus() {
  return isInProgress;
}

export {
  startMachineLearning, cancelMachineLearning,
  getProgressStatus, isFractionOfImagesAnalysedByML,
};
