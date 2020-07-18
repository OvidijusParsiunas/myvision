function highlightDefaultIcon(element) {
  element.childNodes[1].style.display = 'none';
  element.childNodes[3].style.display = '';
}

function dimDefaultIcon(element) {
  element.childNodes[1].style.display = '';
  element.childNodes[3].style.display = 'none';
}

function highlightActiveIcon(element) {
  element.childNodes[5].style.display = 'none';
  element.childNodes[7].style.display = '';
}

function dimActiveIcon(element) {
  element.childNodes[5].style.display = '';
  element.childNodes[7].style.display = 'none';
}

function switchToDefaultIcon(activeEditLabelButton) {
  activeEditLabelButton.childNodes[1].style.display = '';
  activeEditLabelButton.childNodes[5].style.display = 'none';
}

function switchToActiveIcon(element) {
  element.childNodes[1].style.display = 'none';
  element.childNodes[5].style.display = '';
}

function switchToHighlightedActiveIcon(element) {
  element.childNodes[3].style.display = 'none';
  element.childNodes[7].style.display = '';
}

function switchToHighlightedDefaultIcon(activeEditLabelButton) {
  activeEditLabelButton.childNodes[3].style.display = '';
  activeEditLabelButton.childNodes[7].style.display = 'none';
}

function switchToHighlightedDefaultVisibilityIcon(element) {
  element.childNodes[3].style.display = '';
  element.childNodes[7].style.display = 'none';
}

export {
  dimActiveIcon,
  dimDefaultIcon,
  switchToActiveIcon,
  switchToDefaultIcon,
  highlightActiveIcon,
  highlightDefaultIcon,
  switchToHighlightedActiveIcon,
  switchToHighlightedDefaultIcon,
  switchToHighlightedDefaultVisibilityIcon,
};
