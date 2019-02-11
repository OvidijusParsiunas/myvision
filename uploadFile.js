imageUploaded = false;

function readURL(input) {
       removeBndBxIfLabelNamePending();
       if (input.files && input.files[0]) {
           var reader = new FileReader();
           imageName = input.files[0].name;
           reader.onload = function (e) {
             var image = new Image();
             image.src = e.target.result;
             image.onload = function(){
               imageUploaded = true;
               canvas.setWidth(this.width);
               canvas.setHeight(this.height);
               canvas.setBackgroundColor({ source: e.target.result }, function () {
                       canvas.renderAll();
               })
             }
           };
           reader.readAsDataURL(input.files[0]);
       }
   }
