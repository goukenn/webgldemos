"use strict";
(function(){

   var _NS = igk.system.createNS("igk.webgl", {
        polygonObject : function($vertices, $indices, textCoord){
            var gl;
            var texture = 0; 
            this.setgl = function($gl){
                gl = gl;
            };
            this.getVertices = function(){
                // console.debug("vertices", $vertices);
                return $vertices;
            };
            this.getIndices = function(){
                // console.debug("indices", $indices);
                return $indices;
            };
            this.initialize = function(gl){
                //demo create object
                var img = document.getElementById("text");
                if (img){
                    texture = _NS.texture2D.create(gl,  img);
                }

            };
            this.getTexture = function(){
                return texture;
            };
            
            this.render = function(gl){
                // settings
                gl.enable(gl.CULL_FACE);//cullFace
                gl.enable(gl.DEPTH_TEST);
                gl.frontFace(gl.CW);
                gl.cullFace(gl.BACK); 

                gl.drawElements(gl.TRIANGLES, $indices.length, gl.UNSIGNED_SHORT, 0);
 
            }
        }
    });
})();