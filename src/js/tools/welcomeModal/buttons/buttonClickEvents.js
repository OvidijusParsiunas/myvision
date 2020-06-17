import { cancelRemoveImage } from './workers';

function assignWelcomeModalButtonEventHandlers() {
  window.closeWelcomeModal = cancelRemoveImage;
}

export { assignWelcomeModalButtonEventHandlers as default };
