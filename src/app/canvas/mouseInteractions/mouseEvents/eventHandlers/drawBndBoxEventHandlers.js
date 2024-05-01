import {
  prepareCanvasForNewBoundingBox, // Prepares the canvas for creating a new bounding box
  instantiateNewBoundingBox, // Creates a new bounding box instance
  drawBoundingBox, // Draws the bounding box on the canvas
  finishDrawingBoundingBox, // Finalizes the drawing of the bounding box
  shapeScrollEvents, // Handles scroll events for shapes
} from '../../../objects/boundingBox/boundingBox';

// assignDrawBoundingBoxEvents function assigns event listeners to a canvas
// for handling user interactions related to drawing a bounding box
function assignDrawBoundingBoxEvents(canvas) {
  // Prepares the canvas for creating a new bounding box
  prepareCanvasForNewBoundingBox(canvas);

  // Adds a 'mouse:down' event listener to the canvas
  // This event is triggered when the user presses the mouse button down
  canvas.on('mouse:down', () => {
    // Creates a new bounding box instance
    instantiateNewBoundingBox();
  });

  // Adds a 'mouse:move' event listener to the canvas
  // This event is triggered when the user moves the mouse while holding down the mouse button
  canvas.on('mouse:move', (e) => {
    // Draws the bounding box on the canvas
    drawBoundingBox(e);
  });

  // Adds a 'mouse:up' event listener to the canvas
  // This event is triggered when the user releases the mouse button
  canvas.on('mouse:up', () => {
    // Finalizes the drawing of the bounding box
    finishDrawingBoundingBox();
  });

  // Adds a 'mouse:wheel' event listener to the canvas
  // This event is triggered when the user scrolls the mouse wheel
  canvas.on('mouse:wheel', (e) => {
    // Handles scroll events for shapes
    shapeScrollEvents(e);
  });
}

// Exports the assignDrawBoundingBoxEvents function as the default export
export { assignDrawBoundingBoxEvents as default };
