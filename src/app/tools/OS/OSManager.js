let userOS = null;
const availableOSs = ['Win', 'Linux', 'Mac'];
const DEFAULT_OS = 'Win';

function findUserOS() {
  const corsshairLineX = document.getElementById('crosshair-line-x');
  const corsshairLineV = document.getElementById('crosshair-line-v');
  document.getElementById('zoom-overflow-wrapper-parent').addEventListener('mousemove', (event) => {
    const top = `${event.pageY}px`;
    corsshairLineX.style.top = top;
    const left = `${event.pageX}px`;
    corsshairLineV.style.left = left;
  });
  document.getElementById('canvas-absolute-container-2').addEventListener('mousemove', (event) => {
    const top = `${event.pageY - 0.3}px`;
    corsshairLineX.style.top = top;
    const left = `${event.pageX + 0.7}px`;
    corsshairLineV.style.left = left;
  });
  document.getElementById('canvas-absolute-container-1').addEventListener('mousemove', (event) => {
    const top = `${event.pageY - 0.3}px`;
    corsshairLineX.style.top = top;
    const left = `${event.pageX + 0.7}px`;
    corsshairLineV.style.left = left;
  });

  userOS = availableOSs.find(os => navigator.appVersion.indexOf(os) !== -1) || DEFAULT_OS;
}

function getUserOS() {
  return userOS;
}

export { findUserOS, getUserOS };
