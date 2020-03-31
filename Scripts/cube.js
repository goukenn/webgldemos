function VerticeColor(){
    var color = {r:0, g:0, b:0, a:1};
    var vertex = {x:0, y:0, z:0, q:1};
    var texture={s:1, r:0, q:0, t:0};

    return [
        vertext.x, vertex.y, vertex.z, color.r, color.r, color.b, color.a
    ];
}

(function (){

    var cubeVertices = [
        -0.5, 0.5, -0.5, 1.0, 0.0, 0.0, //0
         0.5, 0.5, -0.5, 1.0, 0.0, 0.0, //1
         0.5, -0.5, -0.5, 1.0, 0.0, 0.0, //3
        -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, //2

 

    ];
    var cubeIndices = [
        // face1
        0, 1, 2,
        2, 1, 3,
        // face2
        1, 4, 3,
        3, 4, 5,
        // face 3
        6, 7, 4,
        4, 7, 8,
        // face 4
        8, 9, 11,
        11,9, 10,
        // face 5
        5, 11, 13,
        13,11, 12,
        // face 6
        4, 8 , 5,
        5, 8, 11
    ];


    

})();

