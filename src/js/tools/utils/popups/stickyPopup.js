function calculateElementOffset(element) {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function setPopUpPosition(element, elementButton) {
  const divOffset = calculateElementOffset(elementButton);
  element.style.top = `${divOffset.top}px`;
}

function setStickyPopupProperties(element, elementButton, stickyProperties) {
  const settingPopupBottom = element.getBoundingClientRect().bottom;
  if (!stickyProperties.isPopupSticky) {
    if (settingPopupBottom + 5 > document.body.scrollHeight) {
      element.style.top = '';
      element.style.bottom = '5px';
      stickyProperties.stickCoordinates = settingPopupBottom + 10;
      stickyProperties.isPopupSticky = true;
    }
  }
  if (stickyProperties.isPopupSticky
      && stickyProperties.stickCoordinates < document.body.scrollHeight) {
    setPopUpPosition(element, elementButton);
    element.style.bottom = '';
    stickyProperties.isPopupSticky = false;
  }
}

export { setStickyPopupProperties, setPopUpPosition };
