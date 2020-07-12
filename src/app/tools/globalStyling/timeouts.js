let keyDownEventTimeout = 0;

function setKeyDownEventTimeOut(isFirefox) {
  keyDownEventTimeout = isFirefox ? 10 : 0;
}

function getKeyDownEventTimeout() {
  return keyDownEventTimeout;
}

export { setKeyDownEventTimeOut, getKeyDownEventTimeout };
