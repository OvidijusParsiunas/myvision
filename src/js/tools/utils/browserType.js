function isCurrentBrowserFireFox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

const isFireFox = isCurrentBrowserFireFox();

export { isFireFox as default };
