import { getScrollbarWidth } from '../globalStyling/style.js';
import IS_FIREFOX from './browserType.js';

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

function scrollIntoViewIfNeeded(childElement, parentElement) {
  if (IS_FIREFOX) {
    scrollIntoViewIfNeededPolyfill(childElement, parentElement);
  } else {
    childElement.scrollIntoViewIfNeeded();
  }
}

export { scrollIntoViewIfNeeded as default };
