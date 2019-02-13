imageUploaded = false;

function readURL(input) {
       removeBndBxIfLabelNamePending();
       if (input.files && input.files[0]) {
           let maximumCanvasHeight = window.innerHeight - 54;
           let maximumCanvasWidth = window.innerWidth - 110;
           var reader = new FileReader();
           imageName = input.files[0].name;
           reader.onload = function (e) {
             var image = new Image();
             image.src = e.target.result;
             image.onload = function(){
               imageUploaded = true;
               if(maximumCanvasHeight < this.height){
                 let canvas2 = document.createElement("canvas");
                 let heightRatio = maximumCanvasHeight / this.height;
                 canvas2.height = maximumCanvasHeight;
                 canvas2.width = this.width * heightRatio;
                 if(maximumCanvasWidth < canvas2.width){
                   let widthRatio = maximumCanvasWidth / this.width;
                   canvas2.width = maximumCanvasWidth;
                   canvas2.height = canvas2.height * widthRatio;
                 }
                 canvas2.getContext("2d").drawImage(this, 0, 0, canvas2.width, canvas2.height);
                 canvas.setWidth(canvas2.width);
                 canvas.setHeight(canvas2.height);
                 canvas.setBackgroundColor({ source: canvas2.toDataURL() }, function () {
                         canvas.renderAll();
                 })
               }
               else if(maximumCanvasWidth < this.width){
                 let canvas2 = document.createElement("canvas");
                 let widthRatio = maximumCanvasWidth / this.width;
                 canvas2.width = maximumCanvasWidth;
                 canvas2.height = canvas2.height * widthRatio;
                 canvas2.getContext("2d").drawImage(this, 0, 0, canvas2.width, canvas2.height);
                 canvas.setWidth(canvas2.width);
                 canvas.setHeight(canvas2.height);
                 canvas.setBackgroundColor({ source: canvas2.toDataURL() }, function () {
                         canvas.renderAll();
                 })
               }
               else{
                 canvas.setWidth(this.width);
                 canvas.setHeight(this.height);
                 canvas.setBackgroundColor({ source: e.target.result }, function () {
                         canvas.renderAll();
                 })
               }
             }
           };
           reader.readAsDataURL(input.files[0]);
       }
   }
