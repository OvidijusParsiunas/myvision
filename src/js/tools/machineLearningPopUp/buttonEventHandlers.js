import { getAllImageData } from '../imageList/imageList';

let tfModel = null;

function makePredictions() {
  getAllImageData().forEach((image) => {
    tfModel.detect(image.data).then((predictions) => {
      console.log('Predictions: ', predictions[0]);
    });
  });
}

function resolvePromise(resolve) {
  resolve();
}

function loadModel() {
  return new Promise((resolve) => {
    const { cocoSsd } = window;
    cocoSsd.load().then((model) => {
      tfModel = model;
      resolve();
    });
  });
}

function downloadCOCOSSD() {
  return new Promise((resolve) => {
    const cocoSSDScript = document.createElement('script');
    cocoSSDScript.onload = resolvePromise.bind(this, resolve);
    cocoSSDScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd';
    document.head.appendChild(cocoSSDScript);
  });
}

function downloadTensorflowJS() {
  return new Promise((resolve) => {
    const tensorflowJSScript = document.createElement('script');
    tensorflowJSScript.onload = resolvePromise.bind(this, resolve);
    tensorflowJSScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
    document.head.appendChild(tensorflowJSScript);
  });
}

function startMachineLearning() {
  if (!tfModel) {
    downloadTensorflowJS()
      .then(() => downloadCOCOSSD())
      .then(() => loadModel())
      .then(() => makePredictions());
  } else {
    makePredictions();
  }
}

export { startMachineLearning as default };
