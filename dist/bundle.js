!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=fabric},function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o);const i={};function s(e,t,n){const o=n.getPointer(t.e);return{radius:5,fill:"#ffffff",stroke:"#333333",strokeWidth:.5,left:o.x,top:o.y,selectable:!0,hasBorders:!1,hasControls:!1,originX:"center",originY:"center",id:e,objectCaching:!1}}i.newPolygon={stroke:"rgba(255,0,0)",strokeWidth:2,fill:"rgba(237, 237, 237, 0.01)",perPixelTargetFind:!0,hasBorders:!1,hasControls:!1,lockMovementY:!0,lockMovementX:!0,shapeName:"polygon",selectable:!0},i.newTempPolygon={stroke:"#333333",strokeWidth:.8,fill:"#cccccc",opacity:.3,selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1},i.newPolygonOverride={perPixelTargetFind:!0,hasBorders:!1,hasControls:!1,lockMovementY:!0,lockMovementX:!0,shapeName:"polygon",selectable:!0},i.newLine={strokeWidth:1.1,fill:"#999999",stroke:"#999999",class:"line",originX:"center",originY:"center",selectable:!1,hasBorders:!1,hasControls:!1,evented:!1,objectCaching:!1},i.firstCircle={fill:"red"},i.newCircle=s;let a=!1,l=null,c=null;function u(e,t,n,o){l=n,c=o;const r=document.getElementById("labelNamePopUp");r.style.display="block";const i=document.getElementById("canvas-wrapper").getBoundingClientRect(),s=i.top,u=i.left;r.style.top=`${t+s}px`,r.style.left=`${e+u}px`,a=!0}function d(){a&&(c.remove(l),a=!1,document.getElementById("labelNamePopUp").style.display="none")}function f(e){e.discardActiveObject(),e.renderAll(),e.forEachObject(e=>{e.selectable=!1}),e.defaultCursor="crosshair",e.hoverCursor="crosshair"}function h(e){e.defaultCursor="default",e.hoverCursor="move",e.forEachObject(e=>{e.selectable=!0}),function(e){e.__eventListeners&&(e.__eventListeners["mouse:down"]=[],e.__eventListeners["mouse:over"]=[],e.__eventListeners["mouse:out"]=[],e.__eventListeners["mouse:move"]=[],e.__eventListeners["mouse:up"]=[])}(e),function(e){e.on("mouse:over",t=>{t.target&&t.target._objects&&(t.target._objects[0].set("fill","rgba(255,0,0,0.2)"),e.renderAll())}),e.on("mouse:out",t=>{t.target&&t.target._objects&&("bndBox"===t.target.shapeName?t.target._objects[0].set("fill","rgba(255,0,0,0"):"polygon"===t.target.shapeName&&t.target._objects[0].set("fill","rgba(255,0,0,0.01)"),e.renderAll())})}(e)}window.labelShape=function(){const e=document.getElementById("label-title").value;document.getElementById("labelNamePopUp").style.display="none";const t=new r.a.Text(e,function(e){return{fontSize:10,fill:"yellow",left:e.left,top:e.top,width:e.width,height:e.height}}(l));if("bndBoxTemp"===l.shapeName){const e=new r.a.Group([l,t],function(e){return{left:e.left,top:e.top,width:e.width,height:e.height,stroke:"rgba(255,0,0)",strokeWidth:2,fill:"rgba(255,0,0,0.1)",shapeName:"bndBox"}}(l));c.add(e)}else if("polygon"===l.shapeName){const e=new r.a.Group([l,t],i.newPolygonOverride);c.add(e)}a=!0,c.remove(l)};let g=null,m=!1,p=!1;const b={};function w(){d(),g.remove(g.getActiveObject())}const v=99,y=999999;let x=null,_=[],C=[],j=!0,P=null,k=!1;function B(){C.forEach(e=>{x.remove(e)}),x.remove(k).remove(P)}function L(e){e.target&&e.target.id&&e.target.id===_[0].id&&function(e){const t=[];_.forEach(e=>{t.push({x:e.left,y:e.top}),x.remove(e)}),B();const n=new r.a.Polygon(t,i.newPolygon);x.add(n),P=null,k=null,j=!1;const o=x.getPointer(e.e);u(o.x,o.y,n,x),h(x)}(e),j&&function(e){const t=Math.floor(Math.random()*(y-v+1))+v,n=(new Date).getTime()+t,o=x.getPointer(e.e),s=new r.a.Circle(i.newCircle(n,e,x));0===_.length&&s.set(i.firstCircle);let a=[o.x,o.y,o.x,o.y];const l=new r.a.Line(a,i.newLine);if(k){(a=k.get("points")).push({x:o.x,y:o.y});const e=new r.a.Polygon(a,i.newTempPolygon);x.remove(k),x.add(e),k=e,x.renderAll()}else{const e=[{x:o.x,y:o.y}],t=new r.a.Polygon(e,i.newTempPolygon);k=t,x.add(t)}P=l,_.push(s),C.push(l),x.add(l),x.add(s),x.selection=!1}(e)}function O(e){x=e,j=!0,_.forEach(e=>{x.remove(e)}),B(),_=[],C=[],k=null,P=null,d(),x.discardActiveObject(),f(x)}let A=null;function M(){A.on("mouse:down",()=>{!function(){if(m){p=!0;const e=g.getPointer(g.e);b.origX=e.x,b.origY=e.y,b.rect=new r.a.Rect(function(e,t){return{left:e.origX,top:e.origY,width:t.x-e.origX,height:t.y-e.origY,stroke:"rgba(255,0,0)",strokeWidth:2,fill:"rgba(255,0,0,0)",shapeName:"bndBoxTemp"}}(b,e)),g.add(b.rect)}}()}),A.on("mouse:move",e=>{!function(e){if(!p)return;const t=g.getPointer(e.e);b.origX>t.x&&b.rect.set({left:Math.abs(t.x)}),b.origY>t.y&&b.rect.set({top:Math.abs(t.y)}),b.rect.set({width:Math.abs(b.origX-t.x)}),b.rect.set({height:Math.abs(b.origY-t.y)}),g.renderAll()}(e)}),A.on("mouse:up",e=>{!function(e){if(p){m=!1,p=!1,b.rect.setCoords(),b.rect.selectable=!1,h(g);const t=g.getPointer(e.e);u(t.x,t.y,b.rect,g)}}(e)})}function W(){A.on("mouse:down",e=>{L(e)}),A.on("mouse:move",e=>{!function(e){if(P&&"line"===P.class){const t=x.getPointer(e.e);P.set({x2:t.x,y2:t.y});const n=k.get("points");n[_.length]={x:t.x,y:t.y},k.set({points:n}),x.renderAll()}x.renderAll()}(e)}),A.on("mouse:over",e=>{e.target&&e.target.selectable?A.hoverCursor="move":A.hoverCursor="crosshair"})}function E(){A.__eventListeners&&(A.__eventListeners["mouse:down"]=[],A.__eventListeners["mouse:over"]=[],A.__eventListeners["mouse:out"]=[],A.__eventListeners["mouse:move"]=[],A.__eventListeners["mouse:up"]=[])}function N(){E(),(g=A).backgroundImage&&(d(),m=!0,g.discardActiveObject(),f(g)),M()}function T(){E(),O(A),W()}const U={uploaded:!1,name:null},X={};let I=null;function Y(e,t){t?function(e,t){I.setWidth(t.width),I.setHeight(t.height),r.a.Image.fromURL(e.src,e=>{I.setBackgroundImage(e,I.renderAll.bind(I),{scaleX:I.width/e.width,scaleY:I.height/e.height})})}(e,t):function(e){I.setWidth(e.width),I.setHeight(e.height),I.setBackgroundColor({source:e.src},()=>{I.renderAll()})}(e)}function $(e){const t={},n=X.maximumCanvasWidth/e.width;return t.width=X.maximumCanvasWidth,t.height=e.height*n,t}function H(){U.uploaded=!0;const e=this;if(X.maximumCanvasHeight<e.height){let t=function(e){const t={},n=X.maximumCanvasHeight/e.height;return t.height=X.maximumCanvasHeight,t.width=e.width*n,t}(e);X.maximumCanvasWidth<t.width&&(t=$(t)),Y(e,t)}else if(X.maximumCanvasWidth<e.width){Y(e,$(e))}else Y(e)}function R(e){const t=new Image;t.src=e.target.result,t.onload=H}function S(e){if(d(),e.files&&e.files[0]){const t=new FileReader;U.name=e.files[0].name,t.onload=R,t.readAsDataURL(e.files[0])}}function F(e){I=e,X.maximumCanvasHeight=window.innerHeight-54,X.maximumCanvasWidth=window.innerWidth-110}function z(e){return function e(t){let n="";return Object.keys(t).forEach(o=>{"object"==typeof t[o]?n+=`<${o}>${e(t[o])}</${o}>`:n+=`<${o}>${t[o]}</${o}>`}),n}(e)}let D=null;function G(e){const t=document.createElement("a"),n=new Blob([e],{type:"text/plain"});return t.setAttribute("href",window.URL.createObjectURL(n)),t.setAttribute("download",`${new RegExp("^([^.]+)").exec(U.name)[0]}.xml`),t.dataset.downloadurl=["text/plain",t.download,t.href].join(":"),t.draggable=!0,t.classList.add("dragout"),t}function q(){if(d(),D.backgroundColor){!function(e){G(e).click()}(z(function(e,t){const n={};return n.annotations=function(e,t){return{folder:"Unknown",filename:t.name,path:"Unknown",source:{database:"Unknown"},size:{width:e.getWidth(),height:e.getHeight(),depth:1},segmented:0}}(e,t),n.annotations.object=function(e){let t={};return e.forEachObject(e=>{const n=e._objects[0],o=e._objects[1].text;t={name:o,pose:"Unspecified",truncated:1,difficult:0,bndbox:{xmin:n.left,ymin:n.top,xmax:n.left+n.width,ymax:n.top+n.height}}}),t}(e),n}(D,U)))}}!function(){const e=new r.a.Canvas("c",{selection:!1});r.a.Object.prototype.transparentCorners=!1,A=e,F(e),function(e){D=e}(e)}(),window.createNewBndBox=N,window.createNewPolygon=T,window.removeBndBox=w,window.uploadImage=S,window.downloadXML=q}]);