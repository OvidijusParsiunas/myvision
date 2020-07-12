let userOS = null;
const availableOSs = ['Win', 'Linux', 'Mac'];
const DEFAULT_OS = 'Win';

function findUserOS() {
  userOS = availableOSs.find(os => navigator.appVersion.indexOf(os) !== -1) || DEFAULT_OS;
}

function getUserOS() {
  return userOS;
}

export { findUserOS, getUserOS };
