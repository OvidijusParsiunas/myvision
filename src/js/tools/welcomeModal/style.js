import { setWelcomeModalDisplayedState } from '../stateMachine';
import { dimWindow, lightUpWindow } from '../dimWindow/dimWindowService';
import { SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM } from '../dimWindow/consts';

let modalParentElement = null;

function displayWelcomeModal() {
  dimWindow(SLOW_DIM_SECONDS, THICK_DIM);
  modalParentElement.classList.add('six');
  setWelcomeModalDisplayedState(true);
}

function closeWelcomeModal() {
  modalParentElement.style.display = 'none';
  setWelcomeModalDisplayedState(false);
  lightUpWindow(SLOW_LIGHTUP_MILLISECONDS);
}

function assignWelcomeModalLocalVariables() {
  modalParentElement = document.getElementById('modal-container');
}

function initialiseWelcomeModalStyling() {
  assignWelcomeModalLocalVariables();
  displayWelcomeModal();
}

export { initialiseWelcomeModalStyling, displayWelcomeModal, closeWelcomeModal };
