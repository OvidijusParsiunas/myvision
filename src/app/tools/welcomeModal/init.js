import { initialiseWelcomeModalStyling } from './style';
import assignWelcomeModalButtonEventHandlers from './buttons/buttonClickEvents';

function initialiseWelcomeModal() {
  initialiseWelcomeModalStyling();
  assignWelcomeModalButtonEventHandlers();
}

export { initialiseWelcomeModal as default };
