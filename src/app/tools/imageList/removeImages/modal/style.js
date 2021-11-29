import { setRemoveImageModalDisplayedState, getCrosshairUsedOnCanvasState } from '../../../state.js';
import { SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM } from '../../../dimWindow/consts.js';
import { moveCrosshair } from '../../../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode.js';
import { dimWindow, lightUpWindow } from '../../../dimWindow/dimWindowService.js';
import { executeFunctionOnceOnMouseOver } from '../../../../keyEvents/mouse/mouseOverOut.js';

let modalParentElement = null;

function displayRemoveImagesModal() {
  dimWindow(SLOW_DIM_SECONDS, THICK_DIM);
  modalParentElement.style.display = 'block';
  setRemoveImageModalDisplayedState(true);
}

function closeRemoveImagesModal() {
  modalParentElement.style.display = 'none';
  setRemoveImageModalDisplayedState(false);
  lightUpWindow(SLOW_LIGHTUP_MILLISECONDS);
  if (getCrosshairUsedOnCanvasState()) executeFunctionOnceOnMouseOver(moveCrosshair);
}

function setInitialCheckBoxInputValue() {
  document.getElementById('remove-images-modal-checkbox').checked = false;
}

function assignRemoveImagesModalLocalVariables() {
  modalParentElement = document.getElementById('remove-images-modal-parent');
}

function initialiseRemoveImagesModalStyling() {
  assignRemoveImagesModalLocalVariables();
  setInitialCheckBoxInputValue();
}

export { initialiseRemoveImagesModalStyling, displayRemoveImagesModal, closeRemoveImagesModal };
