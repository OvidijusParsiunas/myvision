import { getScrollbarWidth } from '../globalStyle/style';

function isHorizontalScrollPresent(parentElement) {
  return parentElement.scrollWidth > parentElement.clientWidth;
}

function isElementHeightFullyVisibleInParent(childElement, parentElement) {
  const childBoundingRect = childElement.getBoundingClientRect();
  const parentBoundingRect = parentElement.getBoundingClientRect();
  if (childBoundingRect.top < parentBoundingRect.top) {
    return false;
  }
  if ((isHorizontalScrollPresent(parentElement)
    && childBoundingRect.bottom > parentBoundingRect.bottom - getScrollbarWidth())
    || (childBoundingRect.bottom > parentBoundingRect.bottom)) {
    return false;
  }
  return true;
}

function scrollIntoViewIfNeededPolyfill(childElement, parentElement) {
  if (!isElementHeightFullyVisibleInParent(childElement, parentElement)) {
    childElement.scrollIntoView();
  }
}

function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function scrollIntoViewIfNeeded(childElement, parentElement) {
  if (isFirefox()) {
    scrollIntoViewIfNeededPolyfill(childElement, parentElement);
  } else {
    childElement.scrollIntoViewIfNeeded();
  }
}

export { scrollIntoViewIfNeeded as default };
