import { closeWelcomeModal, switchLanguage } from './workers';

function assignWelcomeModalButtonEventHandlers() {
  window.closeWelcomeModal = closeWelcomeModal;
  window.switchLanguage = switchLanguage;
}

export { assignWelcomeModalButtonEventHandlers as default };
