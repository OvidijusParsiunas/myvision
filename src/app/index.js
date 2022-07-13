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
import initialiseImageListFunctionality from './tools/imageList/init';
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
    }
];

const annotations = [
    {
        "id": 0,
        "image_id": 0,
        "category_id": 1,
        "segmentation": [
            [
                994.8,
                120.2,
                1189.9,
                120.2,
                1189.9,
                430.34,
                994.8,
                430.34
            ]
        ],
        "area": 60511.41,
        "bbox": [
            994.8,
            120.2,
            195.11,
            310.14
        ],
        "isCrowd": 0
    },
    {
        "id": 1,
        "image_id": 0,
        "category_id": 2,
        "segmentation": [
            [
                901.15,
                192.36,
                1120.85,
                192.36,
                1120.85,
                372.87,
                901.15,
                372.87
            ]
        ],
        "area": 39659.85,
        "bbox": [
            901.15,
            192.36,
            219.71,
            180.51
        ],
        "isCrowd": 0
    },
    {
        "id": 2,
        "image_id": 0,
        "category_id": 3,
        "segmentation": [
            [
                595.3,
                685.93,
                762.79,
                685.93,
                762.79,
                894.46,
                595.3,
                894.46
            ]
        ],
        "area": 34928.36,
        "bbox": [
            595.3,
            685.93,
            167.49,
            208.54
        ],
        "isCrowd": 0
    },
    {
        "id": 3,
        "image_id": 0,
        "category_id": 5,
        "segmentation": [
            [
                1041.41,
                304.38,
                1312,
                304.38,
                1312,
                557.88,
                1041.41,
                557.88
            ]
        ],
        "area": 68594.56,
        "bbox": [
            1041.41,
            304.38,
            270.58,
            253.5
        ],
        "isCrowd": 0
    },
    {
        "id": 4,
        "image_id": 0,
        "category_id": 5,
        "segmentation": [
            [
                474.7,
                675.43,
                692.58,
                705.21,
                706.34,
                835.79,
                734.63,
                1126.52,
                566.44,
                957.21,
                465.53,
                966.37,
                389.84,
                964.08,
                341.68,
                948.05,
                302.69,
                932.01,
                277.45,
                911.4,
                263.69,
                874.75,
                275.17,
                815.18,
                293.52,
                778.53,
                327.92,
                744.17,
                392.13,
                696.05,
                421.95,
                682.31
            ]
        ],
        "area": 121712.98,
        "bbox": [
            263.69,
            675.43,
            470.94,
            451.09
        ],
        "isCrowd": 0
    },
    {
        "id": 5,
        "image_id": 0,
        "category_id": 4,
        "segmentation": [
            [
                702.22,
                413.65,
                941.35,
                413.65,
                941.35,
                684.58,
                702.22,
                684.58
            ]
        ],
        "area": 64787.49,
        "bbox": [
            702.22,
            413.65,
            239.13,
            270.93
        ],
        "isCrowd": 0
    },
    {
        "id": 6,
        "image_id": 0,
        "category_id": 5,
        "segmentation": [
            [
                207.99,
                754.96,
                401.25,
                754.96,
                401.25,
                970.91,
                207.99,
                970.91
            ]
        ],
        "area": 41734.49,
        "bbox": [
            207.99,
            754.96,
            193.26,
            215.95
        ],
        "isCrowd": 0
    }
];

function run() {
    setCanvasImage(
        'https://images.unsplash.com/photo-1657299143020-4f4bbf05174d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1767&q=80',
        'antelope',
        () => {
            console.log("LOADING LABELS")
            loadLabels(annotations, categories, 'antelope');
            window.editShapes();
        }
    );

}
window.appl = run;
