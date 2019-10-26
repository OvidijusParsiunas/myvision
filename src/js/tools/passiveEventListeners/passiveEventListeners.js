import { initiateZoomOverflowScroll } from '../toolkit/buttonEvents/facadeWorkers/zoomWorker';

function assignWheelEvents() {
  const canvasWrapperParentElement = document.getElementById('canvas-wrapper-parent');
  canvasWrapperParentElement.addEventListener('wheel', initiateZoomOverflowScroll, { passive: true });
}

function assignPassiveEventListeners() {
  assignWheelEvents();
}

export { assignPassiveEventListeners as default };
