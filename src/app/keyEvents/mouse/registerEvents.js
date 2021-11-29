import registerMouseDownEvents from './mouseDown.js';
import { registerMouseMoveEvents } from './mouseMove.js';
import { registerMouseOverOutEvents } from './mouseOverOut.js';

function registerWindowMouseEvents() {
  registerMouseDownEvents();
  registerMouseMoveEvents();
  registerMouseOverOutEvents();
}

export { registerWindowMouseEvents as default };
