<br />

<!-- do a long readme -->
<p align="center"> 
    <img style="margin-left: -25px" width="70%" src="./readme/images/logo with text 35.png" alt="Logo">
    <!-- <img style="margin-left: -25px" width="70%" src="./readme/logo with text 31.png" alt="Logo">     -->
    <!-- <img width="300" src="./readme/presenting 76.png" alt="Logo">     -->
</p>

## Description

MyVision is a free online image annotation tool used for generating computer vision based ML training data. It is designed with the user in mind, offering features to speed up the labelling process and help maintain workflows with large datasets.

## Features

Draw bounding boxes and polygons to label your objects:
<p align="center">
    <img width="830" src="./readme/gifs/2020-07-06 23-41-06.gif" alt="Logo">
</p>

Polygon manipulation is enriched with additional features to edit, remove and add new points:

<p align="center">
    <img width="830" src="./readme/gifs/ezgif.com-gif-maker 3.gif" alt="Logo">
</p>

Supported dataset formats:

<p align="center">
    <img width="90%" style="margin-left: 5%" src="./readme/images/table3.png" alt="Logo">    
</p>

Annotating objects can be a difficult task... You can skip all the hard work and use a pre-trained machine learning model to automatically annotate the objects for you. MyVision leverages the popular 'COCO-SSD' model to generate bounding boxes for your images and by operating locally on your browser - retain all data within the privacy of your computer:

<p align="center">
    <img width="830" src="./readme/gifs/2020-07-08 00-13-39.gif" alt="Logo">
</p>

You can import existing annotation projects and continue working on them in MyVision. This process can also be used to convert datasets from one format to another:

<p align="center">
    <img width="830" src="./readme/gifs/ezgif.com-gif-maker 4.gif" alt="Logo">
</p>

## Languages

MyVision is available in [English](./README.md) and [Chinese (Mandarin)](./README.cn.md).

## Local setup
<!-- link to the file or bring the screen up to there -->
No setup is required to run this project, open the [index.html](public/index.html) file and you are all set! However, if you want to make changes or contribute to this repository, please follow the instructions below:

```
# Requirements: Node version 10+ and NPM version 6+

# Install node dependencies:
$ npm install

# Run the project in watch mode:
$ npm run watch

# All changes should be made in the src directory and observed in publicDev
```

## Citation
```
@MISC{MyVision,
   author = {Ovidijus Parsiunas},
   title = {{MyVision}},
   howpublished = {\url{https://github.com/OvidijusParsiunas/myvision}},
   year = {2019},
}
```
