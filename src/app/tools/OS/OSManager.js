let userOS = null;
const availableOSs = ['Win', 'Linux', 'Mac'];
const DEFAULT_OS = 'Win';

function findUserOS() {
  var box = document.getElementById("box");
  document.getElementById('zoom-overflow-wrapper-parent').addEventListener('mousemove', function(e){
    var left = e.pageX +"px";
    box.style.left = left;
});
document.getElementById('canvas-absolute-container-2').addEventListener('mousemove', function(e){
  var left = e.pageX + 0.7 +"px";
  box.style.left = left;
});
document.getElementById('canvas-absolute-container-1').addEventListener('mousemove', function(e){
  var left = e.pageX + 0.7 +"px";
  box.style.left = left;
});
  userOS = availableOSs.find(os => navigator.appVersion.indexOf(os) !== -1) || DEFAULT_OS;
}

function getUserOS() {
  return userOS;
}

export { findUserOS, getUserOS };
