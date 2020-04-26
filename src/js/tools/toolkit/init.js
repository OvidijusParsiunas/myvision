import { assignToolkitButtonHoverEvents } from './buttonHoverEvents/buttonHoverEvents';
import { initiateToolkitButtonStyling } from './styling/styling';
import assignToolkitButtonEventHandlers from './buttonClickEvents/buttonClickEvents';

function initialiseToolkit() {
  assignToolkitButtonEventHandlers();
  assignToolkitButtonHoverEvents();
  initiateToolkitButtonStyling();
}

export { initialiseToolkit as default };
