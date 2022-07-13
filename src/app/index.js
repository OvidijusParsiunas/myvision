import { registerHotKeys } from './keyEvents/keyboard/hotKeys';
import registerWindowMouseEvents from './keyEvents/mouse/registerEvents';
import { findUserOS } from './tools/OS/OSManager';
import { constructCanvas } from './canvas/canvas';
import initialiseToolkit from './tools/toolkit/init';
import initialiseLabellerModal from './tools/labellerModal/buttons';
import { initialiseUploadDatasetsModal } from './tools/uploadDatasetsModal/views/viewManager';
import { initialiseMachineLearningModal } from './tools/machineLearningModal/views/viewManager';
import initialiseExportDatasetsPopup from './tools/exportDatasetsPopup/init';
import { initialiseSettingsPopup } from './tools/settingsPopup/init';
import assignPassiveEventListeners from './tools/passiveEventListeners/passiveEventListeners';
import initialiseShapeManipulationDeltas from './canvas/objects/deltaValueSetters/initialiseShapeManipulationDeltas';
import initialiseDragAndDropFunctionality from './tools/dragAndDrop/dragAndDrop';
import initialiseLabelListFunctionality from './tools/labelList/init';
import initialiseRemoveImagesModal from './tools/imageList/removeImages/modal/init';
import { applyStyling } from './tools/globalStyling/style';
import { initialiseImageSwitchPanelFunctionality } from './tools/imageSwitchPanel/style';
import { initialisePulseAnimationCancelling } from './tools/utils/buttons/pulseAnimation';
import { generateOutput } from './tools/exportDatasetsPopup/fileTypes/COCOJSON';
import { onSingleFileLoad } from './tools/imageList/uploadImages/uploadImages';
import { drawShapesViaCoordinates } from './canvas/utils/drawShapesViaCoordinates/drawShapesViaCoordinates';
import { assembleShape } from './tools/uploadDatasetsModal/views/uploadDatasets/finalObjectAssemblers/COCOJSONFinalObjectAssembler';
// for some reason it identifies the OS itself, not the browser.
// probably for hot keys bindings
findUserOS();

// blocks UI with existing html element if size is smaller;
// assigns global vars to canvas wrapper, zoom wrapper, left/right sidebars
// sets screen size delta and mutates buttons to smaller if screen is small
applyStyling();

// first fabric global object import happens here
// adds transparent corner in fabric global config
// creates two new canvases and assigns them to global vars
// assigns some containers for canvases
constructCanvas();

// registers keyDown and keyUp global events to corresponding handlers
registerHotKeys();

// finds toolkit button's dom elements
// assigns styles based on state to buttons, initial ones
// binds functions for particular events that are triggered by buttons using global window obj
initialiseToolkit();

// sets dom nodes selections to global vars
// initialize selection global vars from dom nodes
// grabs variables from initial labels list and creates html nodes for options selection
initialiseLabellerModal();


// initializes styles of settings popup
// assigns settings popup event handlers
// assigns dom nodes to local vars
// assigns event handlers to settings pop-up
initialiseSettingsPopup();

// registers important events related to mouse over  canvas
// ... and etc. probably for crosshair displaying os alike
registerWindowMouseEvents();


// assigns dom nodes to local vars
// assigns event handlers
initialiseExportDatasetsPopup();


initialiseUploadDatasetsModal();


initialiseMachineLearningModal();


assignPassiveEventListeners();


initialiseRemoveImagesModal();




initialiseLabelListFunctionality();


initialiseDragAndDropFunctionality();


initialiseImageSwitchPanelFunctionality();


initialisePulseAnimationCancelling();

initialiseShapeManipulationDeltas();

window.setCanvasImage = (url, imageName, cb) => {
    onSingleFileLoad({ name: imageName }, { target: { result: url } }, cb);
};

window.loadLabels = (annotations, categories, imageName) => {
    const shapes = {
        boundingBoxes: [],
        polygons: [],
    };
    annotations.forEach(anno => {
        const item = assembleShape(anno, categories, imageName);
        if (item.type === 'boundingBox') {
            shapes.boundingBoxes.push(item);
        } else {
            shapes.polygons.push(item)
        }
    });
    setTimeout(() => {
        drawShapesViaCoordinates(shapes, false, false);
    }, 0);
};
window.loadData = (shapes) => {
    drawShapesViaCoordinates(shapes, false, true);
}

window.generateOutput = generateOutput;


const categories = [
    {
        "id": 0,
        "name": "dolphin",
        "supercategory": "none"
    },
    {
        "id": 1,
        "name": "chicken",
        "supercategory": "none"
    },
    {
        "id": 2,
        "name": "cat",
        "supercategory": "none"
    },
    {
        "id": 3,
        "name": "dog",
        "supercategory": "none"
    },
    {
        "id": 4,
        "name": "eye",
        "supercategory": "none"
    },
    {
        "id": 5,
        "name": "ear",
        "supercategory": "none"
    },
    {
        "id": 6,
        "name": "six",
        "supercategory": "none"
    },
    {
        "id": 8,
        "name": "eight",
        "supercategory": "none"
    },
    {
        "id": 7,
        "name": "eight",
        "supercategory": "none"
    }
];

const annotations = [
    {
        "id": 0,
        "image_id": 0,
        "category_id": 2,
        "segmentation": [
            [
                462.89,
                114.88,
                630.39,
                114.88,
                630.39,
                323.41,
                462.89,
                323.41
            ]
        ],
        "area": 34928.77,
        "bbox": [
            462.89,
            114.88,
            167.5,
            208.53
        ],
        "isCrowd": 0
    },
    {
        "id": 1,
        "image_id": 0,
        "category_id": 6,
        "segmentation": [
            [
                1471.66,
                320.9,
                1592.92,
                320.9,
                1563.54,
                530.33,
                1525.52,
                520.54
            ]
        ],
        "area": 16229.25,
        "bbox": [
            1471.66,
            320.9,
            121.26,
            209.43
        ],
        "isCrowd": 0
    },
    {
        "id": 2,
        "image_id": 0,
        "category_id": 3,
        "segmentation": [
            [
                1297.18,
                63.23,
                1536.3,
                63.23,
                1536.3,
                334.15,
                1297.18,
                334.15
            ]
        ],
        "area": 64782.39,
        "bbox": [
            1297.18,
            63.23,
            239.11,
            270.91
        ],
        "isCrowd": 0
    },
    {
        "id": 3,
        "image_id": 0,
        "category_id": 3,
        "segmentation": [
            [
                774.23,
                164.82,
                967.49,
                164.82,
                967.49,
                380.77,
                774.23,
                380.77
            ]
        ],
        "area": 41734.49,
        "bbox": [
            774.23,
            164.82,
            193.26,
            215.95
        ],
        "isCrowd": 0
    },
    {
        "id": 4,
        "image_id": 0,
        "category_id": 5,
        "segmentation": [
            [
                558.63,
                575.44,
                627.18,
                553.41,
                639.42,
                546.06,
                663.9,
                543.61,
                698.17,
                546.06,
                715.31,
                558.3,
                727.55,
                575.44,
                730,
                587.68,
                730,
                602.37,
                737.34,
                624.4,
                739.79,
                641.54,
                742.24,
                658.68,
                744.69,
                670.92,
                744.69,
                685.61,
                744.69,
                702.74,
                739.79,
                717.43,
                730,
                729.67,
                717.76,
                739.46,
                705.52,
                741.91,
                690.83,
                739.46,
                673.69,
                734.57,
                661.45,
                724.78,
                644.31,
                722.33,
                629.62,
                719.88,
                619.83,
                719.88,
                605.14,
                719.88,
                595.35,
                719.88,
                580.66,
                729.67,
                578.21,
                744.36,
                578.21,
                754.15,
                583.11,
                773.74,
                583.11,
                790.88,
                580.66,
                810.46,
                558.63,
                820.25,
                536.6,
                822.7,
                524.35,
                812.91,
                517.01,
                798.22,
                517.01,
                788.43,
                524.35,
                766.39,
                529.25,
                754.15,
                514.56,
                756.6,
                504.77,
                761.5,
                502.32,
                773.74,
                502.32,
                785.98,
                502.32,
                800.67,
                487.63,
                800.67,
                472.94,
                785.98,
                465.6,
                766.39,
                465.6,
                754.15,
                470.5,
                739.46,
                470.5,
                727.22,
                450.91,
                727.22,
                436.22,
                727.22,
                404.4,
                732.12,
                384.81,
                732.12,
                379.91,
                707.64,
                379.91,
                688.05,
                382.36,
                673.37,
                387.26,
                651.33,
                397.05,
                626.85,
                416.64,
                604.82,
                428.88,
                595.03,
                448.46,
                587.68,
                480.29,
                568.1,
                512.11,
                570.54,
                531.7,
                565.65,
                541.49,
                563.2
            ]
        ],
        "area": 64227.68,
        "bbox": [
            379.91,
            543.61,
            364.78,
            279.09
        ],
        "isCrowd": 0
    },
    {
        "id": 5,
        "image_id": 0,
        "category_id": 5,
        "segmentation": [
            [
                952.47,
                717.13,
                974.5,
                878.7,
                1023.47,
                878.7,
                998.99,
                802.81,
                1013.67,
                768.54,
                1021.02,
                844.43,
                1057.74,
                824.84,
                1062.64,
                766.09,
                1096.91,
                766.09,
                1096.91,
                886.05,
                1187.49,
                886.05,
                1204.63,
                783.23,
                1199.73,
                753.85,
                1199.73,
                699.99,
                1251.14,
                709.78,
                1248.7,
                788.12,
                1287.87,
                785.67,
                1273.18,
                638.79,
                1241.35,
                572.69,
                1189.94,
                577.58,
                1084.67,
                572.69,
                1003.88,
                570.24,
                940.23,
                609.41,
                915.75,
                668.16,
                915.75,
                751.4,
                935.33,
                770.98,
            ]
        ],
        "area": -82772.07,
        "bbox": [
            915.75,
            570.24,
            372.11,
            315.8,
        ],
        "isCrowd": 0,
    }
];

function run() {
    setCanvasImage(
        'https://images.unsplash.com/photo-1657658153344-3fa560150950?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        'antelope',
        () => {
            loadLabels(annotations, categories, 'antelope');
            window.editShapes();
        }
    );

}
window.appl = run;
