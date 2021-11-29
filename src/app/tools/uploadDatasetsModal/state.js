import {
  COCO_JSON_FORMAT, VGG_JSON_FORMAT, CSV_FORMAT, VOC_XML_FORMAT, YOLO_TXT_FORMAT,
} from './consts.js';

const availableFormats = [
  COCO_JSON_FORMAT,
  VGG_JSON_FORMAT,
  CSV_FORMAT,
  VOC_XML_FORMAT,
  YOLO_TXT_FORMAT,
];
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

function getAvailableFormats() {
  return availableFormats;
}

function setAllStatesToDefault() {
  currentlySelectedFormat = defaultState;
  reuseAlreadyUploadedImages = false;
}

export {
  setFormatState,
  getFormatState,
  getAvailableFormats,
  setAllStatesToDefault,
  setReuseAlreadyUploadedImagesState,
  getReuseAlreadyUploadedImagesState,
};
