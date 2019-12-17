import { getAllImageData } from '../imageList/imageList';
import { displayErrorMessage, updateProgressMessage } from './style';

let tfModel = null;

function errorHandler() {
  displayErrorMessage();
}

function makePredictions() {
  getAllImageData().forEach((image) => {
    tfModel.detect(image.data).then((predictions) => {
      console.log('Predictions: ', predictions[0]);
    }).catch(() => {
      errorHandler();
    });
  });
  updateProgressMessage('Finished!');
}

function rejectPromise(reject) {
  reject();
}

function resolvePromise(resolve) {
  resolve();
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
    cocoSSDScript.onload = resolvePromise.bind(this, resolve);
    cocoSSDScript.onerror = rejectPromise.bind(this, reject);
    cocoSSDScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd';
    document.head.appendChild(cocoSSDScript);
  });
}

function downloadTensorflowJS() {
  return new Promise((resolve, reject) => {
    updateProgressMessage('In Progress...');
    const tensorflowJSScript = document.createElement('script');
    tensorflowJSScript.onload = resolvePromise.bind(this, resolve);
    tensorflowJSScript.onerror = rejectPromise.bind(this, reject);
    tensorflowJSScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
    document.head.appendChild(tensorflowJSScript);
  });
}

function startMachineLearning() {
  if (!tfModel) {
    downloadTensorflowJS()
      .then(() => downloadCOCOSSD())
      .then(() => loadModel())
      .then(() => makePredictions())
      .catch(() => errorHandler());
  } else {
    makePredictions();
  }
}

export { startMachineLearning as default };
