let format = '';
let reuseAlreadyUploadedImages = false;

function setFormatState(formatState) {
  format = formatState;
}

function setReuseAlreadyUploadedImagesState(reuseAlreadyUploadedImagesState) {
  reuseAlreadyUploadedImages = reuseAlreadyUploadedImagesState;
}

function getFormatState() {
  return format;
}

function getReuseAlreadyUploadedImagesState() {
  return reuseAlreadyUploadedImages;
}

function setAllStatesToDefault() {
  format = '';
  reuseAlreadyUploadedImages = false;
}

export {
  setFormatState,
  getFormatState,
  setAllStatesToDefault,
  setReuseAlreadyUploadedImagesState,
  getReuseAlreadyUploadedImagesState,
};
