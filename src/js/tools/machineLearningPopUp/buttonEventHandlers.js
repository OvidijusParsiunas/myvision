import { getAllImageData } from '../imageList/imageList';
import { displayErrorMessage, updateProgressMessage } from './style';
import { drawShapesViaCoordinates } from '../toolkit/buttonClickEvents/facadeWorkersUtils/drawShapesViaCoordinates/drawShapesViaCoordinates';

let tfModel = null;

function errorHandler() {
  displayErrorMessage();
}

const predictedImageCoordinates = {};

function predict(image) {
  return tfModel.detect(image.data);
}

function executeAndRecordPredictionResults(promisesArray) {
  Promise.all(promisesArray).then((predictions) => {
    for (let i = 0; i < predictions.length; i += 1) {
      predictedImageCoordinates[i] = predictions[i];
    }
    drawShapesViaCoordinates(predictedImageCoordinates);
    updateProgressMessage('Finished!');
  });
}

function makePredictionsForAllImages() {
  const predictPromises = [];
  getAllImageData().forEach((image) => {
    predictPromises.push(predict(image));
  });
  executeAndRecordPredictionResults(predictPromises);
}

function loadModel() {
  return new Promise((resolve, reject) => {
    const { cocoSsd } = window;
    cocoSsd.load().then((model) => {
      tfModel = model;
      resolve();
    }).catch(() => {
      reject();
    });
  });
}

function downloadCOCOSSD() {
  return new Promise((resolve, reject) => {
    const cocoSSDScript = document.createElement('script');
    cocoSSDScript.onload = resolve;
    cocoSSDScript.onerror = reject;
    cocoSSDScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd';
    document.head.appendChild(cocoSSDScript);
  });
}

function downloadTensorflowJS() {
  return new Promise((resolve, reject) => {
    updateProgressMessage('In Progress...');
    const tensorflowJSScript = document.createElement('script');
    tensorflowJSScript.onload = resolve;
    tensorflowJSScript.onerror = reject;
    tensorflowJSScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
    document.head.appendChild(tensorflowJSScript);
  });
}

function startMachineLearning() {
  drawShapesViaCoordinates();
  // if (!tfModel) {
  //   downloadTensorflowJS()
  //     .then(() => downloadCOCOSSD())
  //     .then(() => loadModel())
  //     .then(() => makePredictionsForAllImages())
  //     .catch(() => errorHandler());
  // } else {
  //   makePredictionsForAllImages();
  // }
}

export { startMachineLearning as default };
