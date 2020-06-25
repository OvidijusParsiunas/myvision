<h1 align="center">Vision.ai<nolink></h1>

<p align="center"> 
    <img width="300" src="./presenting 5.png" alt="Logo">
</p>

Description:

Vision.ai<nolink> is a free online image annotation tool used for generating computer vision based ML training data. It is designed with the user in mind, offering features to speed up the labelling process and reduce the complexity of large ML projects.

Features:

Draw polygons and bounding boxes to label your objects:

To simplify the polygon manipulation process, Vision.ai<nolink> provides extensive features to edit, remove and add new points to your existing and currently drawn polygons:

Supported dataset formats:

|       Format          | COCO JSON | VGG JSON | TensorFlow CSV | VOC XML | YOLO TXT |
|:---------------------:|:---------:|:--------:|:--------------:|:-------:|:--------:|
| **Bounding Box**      |     ✓     |    ✓    |        ✓       |     ✓   |    ✓    |
| **Polygon**           |     ✓     |    ✓    |        ✗       |     ✗   |    ✗    |


Annotating objects can be a difficult task... You can skip all the hard work and use a pre-trained machine learning model to automatically annotate the objects for you. Vision.ai<nolink> leverages the popular 'COCO-SSD' model to generate bounding boxes for your images and by operating locally on your browser, retain all data within the privacy of your computer.


You can import existing annotation projects and continue working on them in Vision.ai<nolink>. This process can also be used to convert datasets from one format to another:


Setup guide

#webpack installation
npm install --save-dev webpack
npm install --save-dev webpack-cli

#start webpack (win)
.\node_modules\.bin\webpack

#start eslint (win)
.\node_modules\.bin\eslint .
or
npx eslint .
