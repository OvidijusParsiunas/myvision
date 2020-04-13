import { COCO_JSON_FORMAT } from './consts';

const defaultState = COCO_JSON_FORMAT;
let currentlySelectedFormat = defaultState;
let reuseAlreadyUploadedImages = false;

function setFormatState(formatState) {
  currentlySelectedFormat = currentlySelectedFormat === formatState ? defaultState : formatState;
}

function setReuseAlreadyUploadedImagesState(reuseAlreadyUploadedImagesState) {
  reuseAlreadyUploadedImages = reuseAlreadyUploadedImagesState;
}

function getFormatState() {
  return currentlySelectedFormat;
}

function getReuseAlreadyUploadedImagesState() {
  return reuseAlreadyUploadedImages;
}

function setAllStatesToDefault() {
  currentlySelectedFormat = defaultState;
  reuseAlreadyUploadedImages = false;
}

export {
  setFormatState,
  getFormatState,
  setAllStatesToDefault,
  setReuseAlreadyUploadedImagesState,
  getReuseAlreadyUploadedImagesState,
};
