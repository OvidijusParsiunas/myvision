let baseDiv = null;

function lightUpWindow() {
  baseDiv = document.getElementById('window-dim');
  baseDiv.style.backgroundColor = 'rgba(0,0,0,0)';
  window.setTimeout(() => {
    baseDiv.style.position = '';
  }, 500);
}

function dimWindow(transitionDuration) {
  baseDiv = document.getElementById('window-dim');
  baseDiv.style.transitionDuration = `${transitionDuration}s`;
  baseDiv.style.MozTransitionDuration = `${transitionDuration}s`;
  baseDiv.style.position = 'absolute';
  baseDiv.style.backgroundColor = 'rgba(0,0,0,0.25)';
}

export { dimWindow, lightUpWindow };
