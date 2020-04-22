let baseDiv = null;

function lightUpWindow(transitionDurationMillisonds) {
  baseDiv = document.getElementById('window-dim');
  baseDiv.style.backgroundColor = 'rgba(0,0,0,0)';
  window.setTimeout(() => {
    baseDiv.style.position = '';
  }, transitionDurationMillisonds);
}

function dimWindow(transitionDurationSeconds, backgroundColor) {
  baseDiv = document.getElementById('window-dim');
  baseDiv.style.transitionDuration = `${transitionDurationSeconds}s`;
  baseDiv.style.MozTransitionDuration = `${transitionDurationSeconds}s`;
  baseDiv.style.position = 'absolute';
  baseDiv.style.backgroundColor = backgroundColor;
}

export { dimWindow, lightUpWindow };
