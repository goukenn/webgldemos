"use strict";
(function(){

    function _init_texture(txt){
        
        igk.defineProperty(this, "id", {get: function(){ return txt; }});
    };

   

    var _NS =  igk.system.createNS("igk.webgl",{
        texture2D: function(texture){
            _init_texture.apply(this, [texture]);
        }
    }); 

    igk.appendProperties(_NS.texture2D.prototype, {
        bind: function(gl){  
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.id);
        },
        unloadContent : function(gl){
            gl.deleteTexture(this.id);
        },
        load: function(gl, img){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            //setup graphics
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,256,256,0, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT  );
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );		

            // non power of 2 texture must be clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        },
        toString: function(){
            return "texture2D";
        }
    });


    igk.appendProperties(igk.webgl.texture2D, {
        create: function(gl, ob){
            
            //create a texture
            var _w = 0;
            var _h = 0;
            if (ob.tagName){
                switch(ob.tagName.toLowerCase()){
                    case "img":
                        // console.log("create image texture");
                        _h = ob.width;
						_w = ob.height;
                        break;
                    case "video":
                        console.log("create videos texture");
                        _h = ob.videoHeight;
						_w = ob.videoWidth;
                        break;
                    }
            } else {
               if (('x' in ob) && ('y' in ob)){
                    var canvas = createElement("canvas");
                    canvas.width = ob.x;
                    canvas.height = ob.y;
                    ctx = canvas.getContext("2d");
                    ctx.flush();                    
                    ob = canvas;
               } else {
                   return null;
               }
            }
            var ver = gl.getParameter(gl.VERSION); 
            // console.debug("glversion : ", ver);    
            // console.debug("width : ", _w);    
            // console.debug("height : ", _h);    
            var m_texture = gl.createTexture();
            var _o = new _NS.texture2D(m_texture);
            _o.bind(gl);
            _o.load(gl, ob);
            return _o;
        }
    });
})();
