// Import a collection of event worker functions for handling point removal events.
import {
  pointMouseUpEvents, pointMouseOutEvents, // Event handlers for 'mouse:up' and 'mouse:out' events.
  pointMouseDownEvents, pointMouseOverEvents, // Event handlers for 'mouse:down' and 'mouse:over' events.
  setRemovablePointsEventsCanvas, pointMouseMoveEvents, // Event handlers for 'mouse:move' events and a function to set up removable points on a canvas.
} from '../eventWorkers/removePointsEventsWorker';

// The main function to assign point removal event listeners to an existing polygon on a canvas.
function assignRemovePointsOnExistingPolygonEvents(canvas) {
  // Set up removable points on the given canvas.
  setRemovablePointsEventsCanvas(canvas);

  // Assign event listeners for 'mouse:down' events.
  canvas.on('mouse:down', (e) => {
    pointMouseDownEvents(e); // Call the event handler function for 'mouse:down' events.
  });

  // Assign event listeners for 'mouse:over' events.
  canvas.on('mouse:over', (e) => {
    pointMouseOverEvents(e); // Call the event handler function for 'mouse:over' events.
  });

  // Assign event listeners for 'mouse:up' events.
  canvas.on('mouse:up', (e) => {
    pointMouseUpEvents(e); // Call the event handler function for 'mouse:up' events.
  });

  // Assign event listeners for 'mouse:out' events.
  canvas.on('mouse:out', (e) => {
    pointMouseOutEvents(e); // Call the event handler function for 'mouse:out' events.
  });

  // Assign event listeners for 'mouse:move' events.
  canvas.on('mouse:move', (e) => {
    pointMouseMoveEvents(e); // Call the event handler function for 'mouse:move' events.
  });
}

// Export the assignRemovePointsOnExistingPolygonEvents function as the default export.
export { assignRemovePointsOnExistingPolygonEvents as default };
