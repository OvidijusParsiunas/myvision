// Import necessary functions from './style' and '../../state' modules
import { hideSelectFormatViewAssets, selectFormat } from './style';
import { setFormatState } from '../../state';

// Move to the next view after hiding the select format view assets
function moveToNextView(nextViewCallback) {
  // Hide the select format view assets
  hideSelectFormatViewAssets();
  // Call the next view callback
  nextViewCallback();
}

// Set the format and update the state
function setFormat(format, targetElement) {
  // Select the format on the target element
  selectFormat(targetElement);
  // Update the format state
  setFormatState(format);
}

// Register event handlers for buttons and bind the required functions
function registerButtonEventHandlers(nextViewCallback) {
  // Bind the moveToNextView function to the global window object with nextViewCallback as an argument
  window.moveToUploadDatasetsView = moveToNextView.bind(this, nextViewCallback);
  // Bind the setFormat function to the global window object
  window.selectUploadDatasetsFormat = setFormat;
}

// Export the registerButtonEventHandlers function as the default export
export { registerButtonEventHandlers as default };
