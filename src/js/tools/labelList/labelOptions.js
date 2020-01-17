let defaultShapeColorIndex = 0;
let maxUsedLabelIndex = 0;

const defaultShapeColors = [
  'hsl(0, 100%, 48%',
  'hsl(321, 94%, 34%',
  'hsl(175,75%,51%',
  'hsl(241,86%,49%',
  'hsl(64,99%,40%',
  'hsl(45,77%,53%',
  'hsl(106, 85%, 49%',
  'hsl(355, 80%, 56%',
  'hsl(154, 98%, 54%',
  'hsl(182, 46%, 60%',
  'hsl(7, 93%, 41%',
  'hsl(220, 65%, 39%',
  'hsl(121, 60%, 39%',
  'hsl(220, 100%, 48%',
  'hsl(21, 65%, 33%',
  'hsl(82, 100%, 33%',
  'hsl(294, 100%, 37%',
];

const defaultLabelOptions = [
  { text: 'dog', default: true, color: { highlight: 'red', default: 'hsl(130, 100%, 50%)' } },
  { text: 'cat', default: true, color: { highlight: 'black', default: 'grey' } },
  { text: 'chicken', default: true, color: { highlight: 'blue', default: 'purple' } },
  { text: 'dolphin', default: true, color: 'yellow' },
  { text: 'panda', default: true, color: 'purple' },
];

const labelOptions = defaultLabelOptions;

let limitLabelOptions = true;
let numberOfRemovedOptions = 0;
const maxLabelOptions = 6;

function getNewShapeColor() {
  const palletteColor = defaultShapeColors[defaultShapeColorIndex];
  defaultShapeColorIndex += 1;
  return palletteColor;
}

function terminateLimitIfUsingDefault(id) {
  if (limitLabelOptions) {
    const selectedOption = labelOptions[id];
    let contains = false;
    for (let i = 0; i < labelOptions.length; i += 1) {
      if (selectedOption.text === labelOptions[i].text && labelOptions[i].default === true) {
        contains = true;
        break;
      }
    }
    if (contains) {
      limitLabelOptions = false;
    }
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
  return Math.floor(Math.random() * (70 - 40) + 40);
}

function randomSaturationValue() {
  return Math.floor(Math.random() * (100 - 70) + 70);
}

function randomHueValue() {
  return Math.floor(Math.random() * (360 - 0) + 0);
}

function getDefaultShapeColor() {
  const rawHslColor = getNewShapeColor();
  const defaultFill = `${rawHslColor},0.01)`;
  const highlightFill = `${rawHslColor},0.3)`;
  const strokeFill = `${rawHslColor})`;
  const labelOptionFill = `${rawHslColor},0.28)`;
  return {
    default: defaultFill,
    highlight: highlightFill,
    stroke: strokeFill,
    label: labelOptionFill,
  };
}

function getRandomlyGeneratedShapeColor() {
  const hue = randomHueValue();
  const saturation = randomSaturationValue();
  const lightness = randomLightnessValue();
  const defaultFill = `hsl(${hue},${saturation}%,${lightness}%,0.01)`;
  const highlightFill = `hsl(${hue},${saturation}%,${lightness}%,0.3)`;
  const strokeFill = `hsl(${hue},${saturation}%,${lightness}%)`;
  const labelOptionFill = `hsl(${hue},${saturation}%,${lightness}%, 0.25)`;
  return {
    default: defaultFill,
    highlight: highlightFill,
    stroke: strokeFill,
    label: labelOptionFill,
  };
}

function generateRandomHSLColor() {
  if (defaultShapeColorIndex < 17) {
    return getDefaultShapeColor();
  }
  return getRandomlyGeneratedShapeColor();
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
    if (maxUsedLabelIndex <= foundAtIndex) { maxUsedLabelIndex = foundAtIndex; }
    sendLabelOptionToFront(foundAtIndex);
  } else {
    const color = generateRandomHSLColor();
    maxUsedLabelIndex += 1;
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

function getMaxUsedLabelIndex() {
  return maxUsedLabelIndex - 1;
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

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

shuffle(defaultShapeColors);

export {
  getLabelOptions, getNewShapeColor, getMaxUsedLabelIndex,
  addToLabelOptions, sendLabelOptionToFront, getLabelColor,
};
