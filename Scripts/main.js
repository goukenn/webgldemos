"use strict";

(function () {
    if (!igk) {
        return;
    }
    // extension 
    igk.appendProperties(Array.prototype, {
		toFloat32Array: function () {
			return new Float32Array(this);
		},
	});

    if (!Array.concat){
        Array.concat = function(){
            var tab = [];
            for(var i = 0; i < arguments.length ; i++){
                var ctab = arguments[i];
                for(var j = 0; j < ctab.length ; j++){
                    tab.push(ctab[j]);
                }
            } 
            return tab;
        };
    }



    var m_contexts = [];
    function webgl_init_context() {
        var opts = {
            antialias:true
        };
        return this.o.getContext("webgl", opts) || this.o.getContext("webgl-experimental", opts);
    };
    function webgl_close_context(gl) {
        var c = 0;
        if (gl) {
            c = gl.getExtension('WEBGL_lose_context');
            if (c) { c.loseContext(); }
        }
    };
    function webgl_init() {

        var q = this;
        var canvas = this.add("canvas");
        var gl = webgl_init_context.apply(canvas);
        if (!gl) {
            throw "WebGL Context failed";
        }
        igk.webgl.device = gl;
        canvas.addClass("target fit dispb");
        canvas.closeContext = function () { webgl_close_context(gl); };
        canvas.reg_event("contextmenu", function (e) { e.preventDefault(); e.stopPropagation(); });

        var gl_package = _package_load(canvas, gl, ``);
        var _stop = 0;
        function _exit_context() {
            if (_requestLoop) {
                cancelAnimationFrame(_requestLoop);
                _requestLoop = 0;
            }
            canvas.closeContext();
            _stop = 1;
        };
        // window.onbeforeunload = function(){
        //     console.debug("before unload ");
        //     // igk.ajx.get("/exit", null, function(){}); 
        // };
        // window.onreset = function(){ 
        //     igk.ajx.get("/reset", null, function(){}); 
        // };
        igk.winui.reg_event(window, "beforeunload", function () {
            // hit F5 -  
            if (_requestLoop) {
                cancelAnimationFrame(_requestLoop);
                _requestLoop = 0;
            }
            canvas.closeContext();
            igk.ajx.get("/beforeunload", null, null);
        });
        igk.winui.reg_event(window, "resize", function () {
            _updateSize();
        });


        var _w = 0;
        var _h = 0;
        // definition de parametere d'effacement
        var clearBit = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT;
        var bgColor = { r: 1, g: 0.3, b: 0.1, a: 1 };

        function _updateSize() {
            _w = igk.getNumber(canvas.getComputedStyle("width"));
            _h = igk.getNumber(canvas.getComputedStyle("height"));
            //store the canvas definition view according to css definition        
            canvas.o.width = _w;
            canvas.o.height = _h;
            // bind view port
            gl.viewport(0, 0, _w, _h);
            _render();
        };
        // var boxVertices = [
        //     //
        //     0.0, 0.5, 0.0 , 1.0, 0.0, 0.0,
        //     0.5, -0.5, 0.0 , 1.0, 1.0, 0.0,
        //     -0.5, -0.5, 0.0 , 1.0, 0.0, 1.0
        // ];

        // var boxIndices =[
        //     0, 1, 2
        // ];



        var polygonObject = new igk.webgl.polygonObject([
            //red
            -1.0, -1.0, -1.0, 1.0, 0.0, 0.0,
            1.0, -1.0, -1.0, 1.0, 0.0, 0.0,
            1.0, 1.0, -1.0, 1.0, 0.0, 0.0,
            -1.0, 1.0, -1.0, 1.0, 0.0, 0.0,
            //green
            1.0, -1.0, -1.0, 0.0, 1.0, 0.0,
            1.0, -1.0, 1.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 1.0, 0.0, 1.0, 0.0,
            1.0, 1.0, -1.0, 0.0, 1.0, 0.0,

            1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
            1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
            -1.0, -1.0, 1.0, 0.0, 1.0, 1.0,
            -1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
            //blue
            -1.0, -1.0, 1.0, 0.0, 0.0, 1.0,
            -1.0, -1.0, -1.0, 0.0, 0.0, 1.0,
            -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,
            -1.0, 1.0, 1.0, 0.0, 0.0, 1.0,

            // top
            1.0, 1.0, -1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
            -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
            -1.0, 1.0, -1.0, 1.0, 0.0, 1.0,
            // bottom
            -1.0, -1.0, -1.0, 1.0, 0.0, 1.0,
            -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
            1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
            1.0, -1.0, -1.0, 1.0, 0.0, 1.0

        ], [
            0, 1, 2, // 
            2, 3, 0, // +2, +2, -2

            4, 5, 6,
            6, 7, 4,

            8, 9, 10,
            10, 11, 8,

            12, 13, 14,
            14, 15, 12,
            //top
            16, 17, 18,
            18, 19, 16,
            //bottom
            20, 21, 22,
            22, 23, 20
        ]);

        // 6 face
        var d = []; 
        for(var i = 0; i < 6; i++){
            d = Array.concat(d, [
				0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0
			]);
        }



        gl_package.addObject(polygonObject);


        polygonObject.initialize(gl);


        // creation de programme
        var _program = gl.createProgram();
        var _vshader = gl.createShader(gl.VERTEX_SHADER);
        var _fshader = gl.createShader(gl.FRAGMENT_SHADER);
        // definition de shaders       
        var _s = [
            "precision mediump float;",
            "attribute vec3 inPosition; ",
            "attribute vec3 inColor; ",
            "attribute vec3 inNormal; ",
            "attribute vec2 textCoord; ",
            "uniform mat4 mProjection; ",
            "uniform mat4 mModel; ",
            "uniform mat4 mView; ",
            "uniform mat4 uNormalMatrix; ",
            "varying vec3 fragColor;",   
            "varying vec2 fragTextCoord; ",
            
            "varying vec4 vLighting; ",  
            
            "void main(){",
            "  fragColor = inColor;",
            "  fragTextCoord = textCoord;",
            "	gl_Position = mProjection * mView * mModel * vec4(inPosition, 1.0);",

            "vec3 ambientLight = vec3(0.2, 0.2, 0.5);",
            "vec3 diffuseColor = vec3(0.2, 0.2, 0.5);",
            "vec3 specularColor = vec3(0.2, 0.2, 0.5);",
            "vec3 directionalVector = vec3(1.0, 0.5, -0.5);",
            "vec4 transformedNormal = uNormalMatrix * vec4(inNormal, 1.0);  ", 

            " vLighting = vec4( ambientLight + max(dot(transformedNormal.xyz, directionalVector), 0.0),  1.0); ",  
            "}", ""].join("\n");
        gl.shaderSource(_vshader, _s);
        gl.compileShader(_vshader);

        gl.shaderSource(_fshader, [
            "precision mediump float;",
            "varying vec3 fragColor;",
            "varying vec2 fragTextCoord; ",  
            "varying vec4 vLighting; ",  
            "uniform sampler2D sampler;",  
            "void main(){",
            // "gl_FragColor=  vec4(fragColor, 1.0);",
            "vec3 cl = texture2D(sampler, fragTextCoord).rgb ;// / (fragColor / 1.0);",
            "gl_FragColor =  vec4(cl, 1);",
            // "gl_FragColor= vec4(1, 1 ,1, 1); ",
            " }"].join("\n"));
        gl.compileShader(_fshader);

        // verification Etat de compilation
        if (!gl.getShaderParameter(_vshader, gl.COMPILE_STATUS)) {
            console.error("Error when compiling vertex shader! " + gl.getShaderInfoLog(_vshader));
            return;
        }

        if (!gl.getShaderParameter(_fshader, gl.COMPILE_STATUS)) {
            console.error("Error when compiling fragment shader! " + gl.getShaderInfoLog(_fshader));
            return;
        }

        gl.attachShader(_program, _vshader);
        gl.attachShader(_program, _fshader);


        // link program
        gl.linkProgram(_program);
        if (!gl.getProgramParameter(_program, gl.LINK_STATUS)) {
            console.error("Error when linking program ! ", gl.getProgramInfoLog(_program));
            return;
        }
        // validation de programme
        gl.validateProgram(_program);
        if (!gl.getProgramParameter(_program, gl.VALIDATE_STATUS)) {
            console.error("Error when validate program ! ", gl.getProgramInfoLog(_program));
            return;
        }

        // utilisation du programme ****** if not, uniform not working
        gl.useProgram(_program);
        // passage de paramètre attribute au vertex shader 'inPosition' 
        var _pos = gl.getAttribLocation(_program, "inPosition");
        var _col = gl.getAttribLocation(_program, "inColor");
        var _normal = gl.getAttribLocation(_program, "inNormal");
        var _textCoord = gl.getAttribLocation(_program, "textCoord"); 
        var buffer = gl.createBuffer();
        var indiceBuffer = gl.createBuffer();
        var textCoordBuffer = gl.createBuffer();

        
        // passage de paramètre uniform vertex shader 'inPosition' 
        var _mp = gl.getUniformLocation(_program, "mProjection");
        var _mm = gl.getUniformLocation(_program, "mModel");
        var _mv = gl.getUniformLocation(_program, "mView");
        var _mNormalMatrix = gl.getUniformLocation(_program, "uNormalMatrix");
        var _sampler = gl.getUniformLocation(_program, "sampler");

        var _mpM = new Float32Array(16);
        var _mmM = new Float32Array(16);
        var _mvM = new Float32Array(16);

        // setup matrix definition 
        _mmM = glMatrix.mat4.identity(_mmM);
        _mvM = glMatrix.mat4.lookAt(_mvM, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
        _mpM = glMatrix.mat4.perspective(_mpM, 45 * (Math.PI / 180.0), _w / _h, 0.1, 1000.0);



        gl.uniformMatrix4fv(_mp, false, _mpM); // projection matrix
        gl.uniformMatrix4fv(_mv, false, _mvM); // view matrix
        gl.uniformMatrix4fv(_mm, false, _mmM); // model matrix

        gl.uniformMatrix4fv(_mNormalMatrix, false, _mmM);


        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polygonObject.getVertices()), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(polygonObject.getIndices()), gl.STATIC_DRAW);

        if (_pos != -1){
            gl.vertexAttribPointer(_pos, // in position array to pass position 
                3, // vectices per components 
                gl.FLOAT, // float storage 
                gl.FALSE, // 
                6 * Float32Array.BYTES_PER_ELEMENT, // change 3 to 6 . number of data for single vertex
                0);
            gl.enableVertexAttribArray(_pos);
        }
        if (_col != -1) {
            gl.vertexAttribPointer(
                _col, // attrib array to pass data 
                3, // 3 component per color vertice
                gl.FLOAT, gl.FALSE,
                6 * Float32Array.BYTES_PER_ELEMENT, // change 3 to 6 . number of data for single vertex
                3 * Float32Array.BYTES_PER_ELEMENT); // offset to bind

            gl.enableVertexAttribArray(_col);
        }

        //coord

        gl.bindBuffer(gl.ARRAY_BUFFER, textCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, d.toFloat32Array(), gl.STATIC_DRAW);
        gl.vertexAttribPointer(
                _textCoord, // attrib array to pass data 
                2, // 3 component per color vertice
                gl.FLOAT, gl.FALSE,
                2 * Float32Array.BYTES_PER_ELEMENT, // change 3 to 6 . number of data for single vertex
                0); // offset to bind
        gl.enableVertexAttribArray(_textCoord);


        //bind normalVector
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, [
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,

            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,

            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,

            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,


            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,

            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , 1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1,
            0, 0 , -1
            
        ].toFloat32Array(), gl.STATIC_DRAW);
        gl.vertexAttribPointer(
            _normal, // attrib array to pass data 
            3, // 3 component per color vertice
            gl.FLOAT, gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // change 3 to 6 . number of data for single vertex
            0); // offset to bind

        gl.enableVertexAttribArray(_normal);

 
        // console.debug("textcoord : ", _textCoord, d, "sampler ", _sampler,
        // "texture id : "+polygonObject.getTexture().id);
        // polygonObject.getTexture().bind(gl);
        // bind texture
        gl.uniform1i(_sampler, polygonObject.getTexture().id);// m_texture.id);
        var rotationMatrixX = new Float32Array(16);
        var rotationMatrixY = new Float32Array(16);
        var rotationX = 0;
        var rotationY = 0;
        glMatrix.mat4.identity(rotationMatrixX);
        glMatrix.mat4.identity(rotationMatrixY);
        function _render() {
            if (_h == 0)
                return;

            // setup matrix definition 
            glMatrix.mat4.identity(_mmM);
            glMatrix.mat4.identity(_mvM);
            glMatrix.mat4.identity(_mpM);

            _mvM = glMatrix.mat4.lookAt(_mvM, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
            _mpM = glMatrix.mat4.perspective(_mpM, 45 * (Math.PI / 180.0), _w / _h, 0.1, 1000.0);



            gl.uniformMatrix4fv(_mp, false, _mpM); // projection matrix
            gl.uniformMatrix4fv(_mv, false, _mvM); // view matrix
            gl.uniformMatrix4fv(_mm, false, _mmM); // model matrix


            gl.useProgram(_program);
            rotationY = performance.now() / 1000 / 6 * 2 * Math.PI;
            rotationX = rotationY / 2; // performance.now() / 1000 / 6 * 2 * Math.PI;
            //  glMatrix.mat4.rotate(_mmM, rotationMatrixX, rotationX, [0, 1, 0]);
            glMatrix.mat4.identity(rotationMatrixX);
            glMatrix.mat4.identity(rotationMatrixY);
            glMatrix.mat4.rotate(rotationMatrixX, rotationMatrixX, rotationX, [0, 1, 0]);
            glMatrix.mat4.rotate(rotationMatrixY, rotationMatrixY, rotationY, [1, 0, 0]);

            glMatrix.mat4.multiply(_mmM, rotationMatrixX, rotationMatrixY);

            gl.uniformMatrix4fv(_mm, false, _mmM);


            gl_package.render();

            // // effacer la surface 
            // gl.clearColor(bgColor.r, bgColor.g, bgColor.b, bgColor.a);
            // gl.clear(clearBit);	 


            // // dessin de la forme géométrique
            // gl.drawElements(
            //     gl.TRIANGLES, // type 
            //      boxIndices.length, // total number of data 
            //      gl.UNSIGNED_SHORT, // type of indices data
            //      0 // offset
            //      );


            // var e = gl.getError();
            // if(  e != gl.NO_ERROR){
            //     console.error("something bad append : "+e);
            // }

            // // terminer le dessin
            // gl.flush();
            // gl.finish();  
        };
        //register event - 
        canvas.addEvent("glerror", {});

        //handle event
        canvas.reg_event("glerror", function () {
            _exit_context();
        });

        _updateSize();
        // loop animation 
        var _requestLoop = 0;
        var loop = function () {
            _render();
            if (!_stop)
                _requestLoop = requestAnimationFrame(loop);
        };
        _requestLoop = requestAnimationFrame(loop);



        m_contexts.push(gl);

        //  window._f = igk.html5.webgl.getDefinitions();
    };
    // init component
    igk.winui.initClassControl("igk-webgl-surface", function () {
        webgl_init.apply(this);
    }, {});

    // extending namespace
    var _NS_W = igk.system.createNS("igk.html5.webgl", {
        getConstants: function () {
            if (m_contexts.length == 0)
                return;
            var gl = m_contexts[0];
            var o = {};
            for (var i in gl) {
                if (typeof (gl[i]) == "number") {
                    o[i] = gl[i];
                }
            }
            return o;
        },
        getFunctions: function () {
            if (m_contexts.length == 0)
                return;
            var gl = m_contexts[0];
            var o = {};
            for (var i in gl) {
                if (typeof (gl[i]) == "function") {
                    o[i] = gl[i];
                }
            }
            return o;
        },
        getDefinitions: function () {
            var o = {};
            o.contants = _NS_W.getConstants();
            o.functions = _NS_W.getFunctions();
            return o;
        }
    });


    function _webgl_surface_enviroment() {

        var refObject = 0;
        var clearBit = 0;
        var bgColor = { r: 0.2, g: 0.2, b: 0.2, a: 1 };
        var error = 0;
        var gl = 0;
        var object_i = [];
        var i = 0;
        var objectContainer = {
            render: function () {
                i = 0;
                while (object_i[i]) {
                    object_i[i].render(gl);
                    i++;
                }

            }
        };
        igk.appendProperties(this, {
            load: function (canvas, $gl, src) {
                gl = $gl;
                clearBit = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT;
                refObject = {
                    "loadcontent": function () { },
                    "unloadcontent": function () { },
                    "render": function () {
                        gl.clearColor(bgColor.r, bgColor.g, bgColor.b, bgColor.a);
                        gl.clear(clearBit);

                        // gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
                        objectContainer.render();

                        error = gl.getError();
                        if (error != gl.NO_ERROR) {
                            console.error("something bad append : " + error);
                            igk.winui.events.raise(canvas, "glerror", [gl]);
                        }
                        // terminer le dessin
                        gl.flush();
                        gl.finish();
                    },
                    "init": function () { },
                    "update": function () { }
                };
                //defined function eval vs Function
                var $code = Function("(function(gl, $src, $m){ " + src + "; (function(){ for(var j=0; j< $m.length; j++){ i = $m[j]; if (eval('typeof('+i+')') == 'function') this[i] = eval(i); } })(); }).apply(this, arguments)")
                    .bind(refObject, gl, src, ["loadcontent", "unloadcontent", "render", "update", "init", "close"]);
                $code();
            },
            render: function () {
                if (refObject) {
                    refObject.render();
                }
            },
            addObject: function (obj) {
                object_i.push(obj);
            },
            clearObject: function () {
                object_i.length = 0;
            },
            toString: function () {
                return "{igk-WebGL: Environment}";
            }
        });
    };
    var _package_load = function (gl, src) {
        var e = new _webgl_surface_enviroment();
        e.load(gl, src);
        return e;
    };


})();