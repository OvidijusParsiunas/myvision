function isCurrentBrowserFireFox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

const IS_FIREFOX = isCurrentBrowserFireFox();

export { IS_FIREFOX as default };
