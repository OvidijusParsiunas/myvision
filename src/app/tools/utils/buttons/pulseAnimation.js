const SINGLE_PULSE_DURATION_MILLISECONDS = 700;
let buttonElementPulseIsActiveOn = null;
let pulseActive = false;

function endAnimation(buttonElement) {
  buttonElement.style.backgroundColor = '';
  setTimeout(() => {
    buttonElement.style.transitionDuration = '';
  }, SINGLE_PULSE_DURATION_MILLISECONDS);
  buttonElementPulseIsActiveOn = null;
}

function pulse(buttonElement, primaryColor, secondaryColor, numOfAlterationsLeft) {
  setTimeout(() => {
    if (numOfAlterationsLeft === 0 || !pulseActive) {
      endAnimation(buttonElement);
      return;
    }
    buttonElement.style.backgroundColor = secondaryColor;
    pulse(buttonElement, secondaryColor, primaryColor, numOfAlterationsLeft - 1);
  }, SINGLE_PULSE_DURATION_MILLISECONDS);
}

function initiateButtonPulseAnimation(buttonElement, primaryColor, secondaryColor, pulseCount,
  beginAnimationImmediately) {
  buttonElement.style.transitionDuration = `${SINGLE_PULSE_DURATION_MILLISECONDS / 1000}s`;
  buttonElement.style.backgroundColor = beginAnimationImmediately ? primaryColor : '';
  const numOfAlterationsLeft = beginAnimationImmediately ? pulseCount * 2 - 1 : pulseCount * 2;
  if (beginAnimationImmediately) {
    pulse(buttonElement, primaryColor, secondaryColor, numOfAlterationsLeft);
  } else {
    pulse(buttonElement, secondaryColor, primaryColor, numOfAlterationsLeft);
  }
  buttonElementPulseIsActiveOn = buttonElement;
  pulseActive = true;
}

function cancelPulseAnimation(element) {
  if (buttonElementPulseIsActiveOn === element && pulseActive) {
    pulseActive = false;
  }
}

function initialisePulseAnimationCancelling() {
  window.cancelPulseAnimation = cancelPulseAnimation;
}

export { initiateButtonPulseAnimation, initialisePulseAnimationCancelling };
