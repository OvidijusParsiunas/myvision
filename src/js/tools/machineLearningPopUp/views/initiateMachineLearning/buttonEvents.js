import startMachineLearning from './machineLearning';

function registerButtonEventHandlers(nextViewCallback, setMachineLearningData) {
  window.startMachineLearning = startMachineLearning.bind(
    this, nextViewCallback, setMachineLearningData,
  );
}

export { registerButtonEventHandlers as default };
