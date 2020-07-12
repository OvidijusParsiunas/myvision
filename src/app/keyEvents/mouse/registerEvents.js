import registerMouseDownEvents from './mouseDown';
import { registerMouseMoveEvents } from './mouseMove';

function registerWindowMouseEvents() {
  registerMouseDownEvents();
  registerMouseMoveEvents();
}

export { registerWindowMouseEvents as default };
