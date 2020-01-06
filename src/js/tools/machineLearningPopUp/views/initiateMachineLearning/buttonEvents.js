import startMachineLearning from './machineLearning';

function registerButtonEventHandlers(nextViewCallback) {
  window.startMachineLearning = startMachineLearning.bind(this, nextViewCallback);
}

export { registerButtonEventHandlers as default };
