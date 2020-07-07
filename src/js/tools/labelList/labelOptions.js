let defaultShapeColorIndex = 0;
let maxUsedLabelIndex = 0;

const defaultShapeColors = [
  'hsl(0, 100%, 48%',
  'hsl(321, 94%, 34%',
  'hsl(175, 75%, 51%',
  'hsl(241, 86%, 49%',
  'hsl(64, 99%, 40%',
  'hsl(106, 85%, 49%',
  'hsl(355, 80%, 56%',
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
  {
    text: 'dog',
    default: true,
    color: {
      default: 'hsl(82, 93%, 45%, 0.01)', highlight: 'hsl(82, 93%, 45%, 0.3)', stroke: 'hsl(82, 93%, 45%)', label: 'hsl(82, 93%, 45%, 0.25)',
    },
  },
  // default: 'hsl(186, 75%, 51%, 0.01)', highlight: 'hsl(186, 75%, 51%, 0.3)',
  // stroke: 'hsl(186, 75%, 51%)', label: 'hsl(186, 75%, 51%, 0.25)',
  {
    text: 'cat',
    default: true,
    color: {
      default: 'hsl(45, 77%, 53%, 0.01)', highlight: 'hsl(45, 77%, 53%, 0.3)', stroke: 'hsl(45, 77%, 53%)', label: 'hsl(45, 77%, 53%, 0.28)',
    },
  },
  {
    text: 'chicken',
    default: true,
    color: {
      default: 'hsl(338 ,100%, 68%, 0.01)', highlight: 'hsl(338, 100%, 68%, 0.3)', stroke: 'hsl(338, 100%, 68%)', label: 'hsl(338, 100%, 68%, 0.28)',
    },
  },
  {
    text: 'dolphin',
    default: true,
    color: {
      default: 'hsl(198, 98%, 61%, 0.01)', highlight: 'hsl(198, 98%, 61% ,0.3)', stroke: 'hsl(198, 98%, 61%)', label: 'hsl(198, 98%, 61%, 0.25)',
    },
  },
  {
    text: 'panda',
    default: true,
    color: {
      default: 'hsl(21, 70%, 40%, 0.01)', highlight: 'hsl(21, 70%, 40% ,0.3)', stroke: 'hsl(21, 70%, 40%)', label: 'hsl(21, 70%, 40%, 0.25)',
    },
  },
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

function getFirstNewLabelColor() {
  defaultShapeColorIndex += 1;
  return {
    default: 'hsl(154, 98%, 54%,0.01)', highlight: 'hsl(154, 98%, 54%,0.3)', stroke: 'hsl(154, 98%, 54%)', label: 'hsl(154, 98%, 54%,0.28)',
  };
}

function generateRandomHSLColor() {
  if (defaultShapeColorIndex === 0) {
    return getFirstNewLabelColor();
  }
  if (defaultShapeColorIndex < defaultShapeColors.length) {
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
