// Import necessary functions and styles for working with image lists,
// machine learning modals, and drawing images on the canvas.
import { removeNoImagesFoundOnMLModalStyle } from '../../machineLearningModal/views/initiateMachineLearning/style';
import {
  addSingleImageToList,
  addImageFromMultiUploadToList,
  getImageIdByName,
} from '../imageList';
import { onImageLoad } from './drawImageOnCanvas';

// Function to check if the image format is valid
// Based on the provided code, this function only checks if the image type includes 'image/'
function isFormatValid(imageMetadata) {
  // Check if the image type includes 'image/'
  return imageMetadata.type.includes('image/');
}

// Function to check if an image can be uploaded
// An image can be uploaded if its format is valid and it doesn't already exist in the image list
function canUpload(imageMetadata) {
  return isFormatValid(imageMetadata) && getImageIdByName(imageMetadata.name) === null;
}

// Function to handle loading and processing multiple images
// This function creates an Image object, sets its source to the uploaded image,
// and adds it to the image list if it's the first image or if it can be uploaded
function onMultiFileLoad(imageMetadata, isfirstImage, e) {
  const image = new Image();
  image.src = e.target.result;

  if (isfirstImage) {
    // If this is the first image, set the onload event to onImageLoad
    image.onload = onImageLoad;
  }

  addImageFromMultiUploadToList(imageMetadata, image, isfirstImage);
  removeNoImagesFoundOnMLModalStyle();
}

// Function to upload and process multiple images
// This function iterates through the uploaded files, checks if they can be uploaded,
// and processes them using the onMultiFileLoad function
function uploadMultipleImages(uploadData) {
  for (let i = 0; i < uploadData.files.length; i += 1) {
    if (canUpload(uploadData.files[i])) {
      const reader = new FileReader();
      const isfirstImage = i === 0;
      reader.onload = onMultiFileLoad.bind(this, uploadData.files[i], isfirstImage);
      reader.readAsDataURL(uploadData.files[i]);
    }
  }
}

// Function to handle loading and processing a single image
// This function creates an Image object, sets its source to the uploaded image,
// and adds it to the image list if it can be uploaded
function onSingleFileLoad(imageMetadata, e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
  addSingleImageToList(imageMetadata, image);
  removeNoImagesFoundOnMLModalStyle();
}

// Function to upload and process a single image
// This function checks if the image can be uploaded and processes it using the onSingleFileLoad function
function uploadSingleImage(uploadData) {
  if (canUpload(uploadData.files[0])) {
    const reader = new FileReader();
    reader.onload = onSingleFileLoad.bind(this, uploadData.files[0]);
    reader.readAsDataURL(uploadData.files[0]);
  }
}

// Function to upload and process images
// This function checks if there are any uploaded files
// If there is only one file, it calls uploadSingleImage, otherwise it calls uploadMultipleImages
function uploadImages(uploadData) {
  if (uploadData.files && uploadData.files.length > 0) {
    if (uploadData.files.length === 1) {
      uploadSingleImage(uploadData);
    } else {
      uploadMultipleImages(uploadData);
    }
  }
  // You may want to add an onerror handler here to handle any errors during the upload process
}

// Export the uploadImages function as the default export
export { uploadImages as default };
