const defaultLabelOptions = [
  { text: 'dog', color: { highlight: 'red', default: 'hsl(130, 100%, 50%)' } },
  { text: 'cat', color: { highlight: 'black', default: 'grey' } },
  { text: 'chicken', color: { highlight: 'blue', default: 'purple' } },
  { text: 'dolphin', color: 'yellow' },
  { text: 'panda', color: 'purple' },
];

const labelOptions = defaultLabelOptions;

let limitLabelOptions = true;
let numberOfRemovedOptions = 0;
const maxLabelOptions = 6;

function terminateLimitIfUsingDefault(id) {
  const selectedOption = labelOptions[id];
  let contains = false;
  for (let i = 0; i < labelOptions.length; i += 1) {
    if (selectedOption.text === labelOptions[i].text) {
      contains = true;
      break;
    }
  }
  if (contains) {
    limitLabelOptions = false;
  }
}

function sendLabelOptionToFront(id) {
  terminateLimitIfUsingDefault(id);
  const firstObjectRef = labelOptions[id];
  for (let i = id; i > 0; i -= 1) {
    labelOptions[i] = labelOptions[i - 1];
  }
  labelOptions[0] = firstObjectRef;
}

function randomLightnessValue() {
  return Math.floor(Math.random() * (80 - 50) + 50);
}

function randomSaturationValue() {
  return Math.floor(Math.random() * (100 - 70) + 70);
}

function randomHueValue() {
  return Math.floor(Math.random() * (320 - 0) + 0);
}

function generateRandomHSLColor() {
  // Returns an array of 3 values for rgb
  const hue = randomHueValue();
  const saturation = randomSaturationValue();
  const lightness = randomLightnessValue();
  const defaultFill = `hsl(${hue},${saturation}%,${lightness}%,0.01)`;
  const highlightFill = `hsl(${hue},${saturation}%,${lightness}%,0.3)`;
  const strokeFill = `hsl(${hue},${saturation}%,${lightness}%)`;
  return { default: defaultFill, highlight: highlightFill, stroke: strokeFill };
}

function addToLabelOptions(text) {
  let foundAtIndex;
  for (let i = 0; i < labelOptions.length; i += 1) {
    if (labelOptions[i].text === text) {
      foundAtIndex = i;
      break;
    }
  }
  if (foundAtIndex !== undefined) {
    sendLabelOptionToFront(foundAtIndex);
  } else {
    const color = generateRandomHSLColor();
    labelOptions.unshift({ text, color });
    if (limitLabelOptions && (labelOptions.length > maxLabelOptions)) {
      labelOptions.pop();
      numberOfRemovedOptions += 1;
      if (numberOfRemovedOptions === 5) {
        limitLabelOptions = false;
      }
    }
  }
}

function getLabelOptions() {
  return labelOptions;
}

function getLabelColor(text) {
  for (let i = 0; i < labelOptions.length; i += 1) {
    if (labelOptions[i].text === text) {
      return labelOptions[i].color;
    }
  }
  return { highlight: 'hsl(0, 100%, 50%, 0.2)', default: 'hsl(0, 100%, 50%, 0.01)' };
}

export {
  addToLabelOptions, getLabelOptions,
  sendLabelOptionToFront, getLabelColor,
};
