<h1 align="center">MyVision.ai<nolink></h1>

<p align="center"> 
    <img width="300" src="./presenting 5.png" alt="Logo">
</p>

## Description

MyVision is a free online image annotation tool used for generating computer vision based ML training data. It is designed with the user in mind, offering features to speed up the labelling process and reduce the complexity of large ML projects.

## Features

Draw polygons and bounding boxes to label your objects:

To simplify the polygon manipulation process, MyVision provides extensive features to edit, remove and add new points to your existing and currently drawn polygon shapes:

Supported dataset formats:

|                       | COCO JSON | VGG JSON | TensorFlow CSV | VOC XML | YOLO TXT |
|:---------------------:|:---------:|:--------:|:--------------:|:-------:|:--------:|
| **Bounding Box**      |     ✓     |    ✓    |        ✓       |     ✓   |    ✓    |
| **Polygon**           |     ✓     |    ✓    |        ✗       |     ✗   |    ✗    |


&nbsp;&nbsp;&nbsp;&nbsp;|       Format          | Bounding Box | Polygon |
&nbsp;&nbsp;&nbsp;&nbsp;|:---------------------:|:------------:|:-------:|
&nbsp;&nbsp;&nbsp;&nbsp;| **COCO JSON**         |       ✓      |    ✓   |
&nbsp;&nbsp;&nbsp;&nbsp;| **VGG JSON**          |       ✓      |    ✓   |
&nbsp;&nbsp;&nbsp;&nbsp;| **TensorFlow CSV**    |       ✓      |    ✗   |
&nbsp;&nbsp;&nbsp;&nbsp;| **VOC XML**           |       ✓      |    ✗   |
&nbsp;&nbsp;&nbsp;&nbsp;| **YOLO TXT**          |       ✓      |    ✗   |


Annotating objects can be a difficult task... You can skip all the hard work and use a pre-trained machine learning model to automatically annotate the objects for you. MyVision leverages the popular 'COCO-SSD' model to generate bounding boxes for your images and by operating locally on your browser - retain all data within the privacy of your computer.


You can import existing annotation projects and continue working on them in MyVision. This process can also be used to convert datasets from one format to another:


## Local setup

No setup is required to run this project. However, if you want to make changes or contribute to this repository, please follow the outlined instructions:

#webpack installation
npm install --save-dev webpack
npm install --save-dev webpack-cli

#start webpack (win)
.\node_modules\.bin\webpack

#start eslint (win)
.\node_modules\.bin\eslint .
or
npx eslint .

Potentially remove the readme title