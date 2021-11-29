import { removeActiveButtonPopover } from '../../globalStyling/buttons/popovers.js';
import isLeftMouseButtonClick from './clickEvents.js';

function removeButtonPopoverIfActive(func, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  removeActiveButtonPopover();
  if (func) func();
}

function doNothingIfNotLeftMouseButtonPress(func, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  if (func) func();
}

function doNothingIfNotLeftMouseButtonPressWthArg(func, funcArg1, event) {
  if (event && !isLeftMouseButtonClick(event)) return;
  if (func) func(funcArg1);
}

export {
  removeButtonPopoverIfActive,
  doNothingIfNotLeftMouseButtonPress,
  doNothingIfNotLeftMouseButtonPressWthArg,
};
