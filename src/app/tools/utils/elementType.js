function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

export { isElement as default };
