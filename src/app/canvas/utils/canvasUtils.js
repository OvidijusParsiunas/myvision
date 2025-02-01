import IS_FIREFOX from '../../tools/utils/browserType';

// Flag to keep track of which canvas element is currently being displayed
let canvasElement1Displaying = true;
let oldCanvas = null;
let canvas = null;

// Reference to the two canvas container elements
let canvasContainerElement1 = null;
let canvasContainerElement2 = null;

// Reference to the current canvas container element
let currentCanvasContainerElement = null;

// Timeout duration in milliseconds, which may vary depending on the browser
let timeoutMilliseconds = 0;

// Function to retrieve the current canvas container element
function getCurrentCanvasContainerElement() {
  return currentCanvasContainerElement;
}

// Function to switch the current canvas container element
function switchCurrentCanvasContainerElement() {
  currentCanvasContainerElement = canvasElement1Displaying
    ? canvasContainerElement2 : canvasContainerElement1;
}

// Function to switch the styles of the canvas container elements and perform other related tasks
function switchCanvasContainerElementsStyle() {
  setTimeout(() => {
    if (canvasElement1Displaying) {
      // Set the display style of the first canvas container element to 'none'
      canvasContainerElement1.style.display = 'none';

      // Set the display style of the second canvas container element to an empty string (default)
      canvasContainerElement2.style.display = '';

      // Set the left and top position of the first canvas container element to 50%
      canvasContainerElement1.style.left = '50%';
      canvasContainerElement1.style.top = '50%';

      // Set the flag for the first canvas element to false
      canvasElement1Displaying = false;
    } else {
      // Set the display style of the first canvas container element to an empty string (default)
      canvasContainerElement1.style.display = '';

      // Set the display style of the second canvas container element to 'none'
      canvasContainerElement2.style.display = 'none';

      // Set the left and top position of the second canvas container element to 50%
      canvasContainerElement2.style.left = '50%';
      canvasContainerElement2.style.top = '50%';

      // Set the flag for the first canvas element to true
      canvasElement1Displaying = true;
    }

    // Reset the old canvas's viewport transform and clear it
    oldCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    oldCanvas.clear();
  }, timeoutMilliseconds);
}

// Function to switch the canvas container elements
function switchCanvasContainerElements() {
  switchCanvasContainerElementsStyle();
  switchCurrentCanvasContainerElement();
}

// Function to enable active objects to appear in front
function enableActiveObjectsAppearInFront() {
  canvas.preserveObjectStacking = false;
}

// Function to prevent active objects from appearing in front
function preventActiveObjectsAppearInFront() {
  if (canvas) { canvas.preserveObjectStacking = true; }
}

// Function to assign a new canvas object for utility functions
function assignNewCanvasForUtils(newCanvasObj) {
  oldCanvas = canvas;
  canvas = newCanvasObj;
}

// Function to assign the timeout duration in milliseconds depending on the browser
function assignTimeoutMillisecondsDependingOnBrowser() {
  timeoutMilliseconds = IS_FIREFOX ? 12 : 0;
}

// Function to assign the canvas object and related properties for utility functions
function assignCanvasForUtils(canvasObj) {
  canvas = canvasObj;
  canvas.randomProperty = 'test';
  canvasContainerElement1 = document.getElementById('canvas-absolute-container-1');
  canvasContainerElement2 = document.getElementById('canvas-absolute-container-2');
  currentCanvasContainerElement = canvasContainerElement1;
  assignTimeoutMillisecondsDependingOnBrowser();
}

// Export the relevant functions for external use
export {
  assignCanvasForUtils, enableActiveObjectsAppearInFront, getCurrentCanvasContainerElement,
  preventActiveObjectsAppearInFront, switchCanvasContainerElements, assignNewCanvasForUtils,
};
