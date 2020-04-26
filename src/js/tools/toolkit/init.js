import { assignToolkitButtonHoverEvents } from './buttonHoverEvents/buttonHoverEvents';
import assignToolkitButtonEventHandlers from './buttonClickEvents/buttonClickEvents';
import initiateToolkitButtonStyling from './styling/styling';

function initialiseToolkit() {
  assignToolkitButtonEventHandlers();
  assignToolkitButtonHoverEvents();
  initiateToolkitButtonStyling();
}

export { initialiseToolkit as default };
