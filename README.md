<p align="center"> 
    <img style="margin-left: -30px" width="500" src="./logo with text 23.png" alt="Logo">    
    <!-- <img width="300" src="./presenting 76.png" alt="Logo">     -->
</p>
<br>

## Description

MyVision is a free online image annotation tool used for generating computer vision based ML training data. It is designed with the user in mind, offering features to speed up the labelling process and help maintain workflows with large datasets.

## Features

Draw polygons and bounding boxes to label your objects:
<p align="center">
    <img width="1000" src="./2020-06-26%2021-48-26%20(1).gif" alt="Logo">
</p>

Polygon manipulation is enriched with extensive features to edit, remove and add new points:

<p align="center"> 
    <img width="1000" src="./2020-06-26%2022-30-03.gif" alt="Logo">
</p>

Supported dataset formats:

|| &nbsp;&nbsp;&nbsp;COCO JSON&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;VGG JSON&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;TensorFlow CSV&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;VOC XML&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;YOLO TXT&nbsp;&nbsp;&nbsp;|
|:---------------:|:-:|:-:|:-:|:-:|:-:|
| **Bounding Box**|✓|✓|✓|✓|✓|
| **Polygon**     |✓|✓|✗|✗|✗|

<br />
Annotating objects can be a difficult task... You can skip all the hard work and use a pre-trained machine learning model to automatically annotate the objects for you. MyVision leverages the popular 'COCO-SSD' model to generate bounding boxes for your images and by operating locally on your browser - retain all data within the privacy of your computer.


You can import existing annotation projects and continue working on them in MyVision. This process can also be used to convert datasets from one format to another:


## Local setup

No setup is required to run this project. However, if you want to make changes or contribute to this repository, please follow the outlined instructions:

Prerequisites: `Node version 8+` and `NPM version 6+`:


```
# Install node dependencies:
$ npm install

# Run the project in watch mode:
$ npm run watch
```
