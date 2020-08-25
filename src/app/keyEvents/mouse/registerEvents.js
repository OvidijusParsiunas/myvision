import registerMouseDownEvents from './mouseDown';
import { registerMouseMoveEvents } from './mouseMove';
import { registerMouseOverOutEvents } from './mouseOverOut';

function registerWindowMouseEvents() {
  registerMouseDownEvents();
  registerMouseMoveEvents();
  registerMouseOverOutEvents();
}

export { registerWindowMouseEvents as default };
