var _vertices = [];
for (var j = 0; j < 2; j++) {
    for (var i = 0; i < 11; i++) {
        var x = i * 0.2 - 1;
        var z = j * (-2) + 1;
        _vertices.push(vec4(x, - Math.sqrt(1 - x*x), z, 1));
    }
}
// array of gutterVertices, 2 triangles form a face
var gutterVertices = [];
for(var i = 1; i <= 10; i++) {
    gutterVertices.push(_vertices[i - 1]);
    gutterVertices.push(_vertices[i]);
    gutterVertices.push(_vertices[10 + i]);
    gutterVertices.push(_vertices[i]);
    gutterVertices.push(_vertices[11 + i]);
    gutterVertices.push(_vertices[10 + i]);
}

var gutterModelCenter = vec4(0, 0, 0, 1);
var gutterNormals = [];
for(var i = 0; i < gutterVertices.length; i++) {
    var n0 = gutterModelCenter[0] - gutterVertices[i][0];
    var n1 = gutterModelCenter[1] - gutterVertices[i][1];
    gutterNormals.push(vec4(n0, n1, 0, 1));
}

var _texCoords = [  vec2(0, 0),
                    vec2(0.1, 0),
                    vec2(0.2, 0),
                    vec2(0.3, 0),
                    vec2(0.4, 0),
                    vec2(0.5, 0),
                    vec2(0.6, 0), 
                    vec2(0.7, 0),
                    vec2(0.8, 0),
                    vec2(0.9, 0),
                    vec2(1, 0),
                    vec2(0, 1),
                    vec2(0.1, 1),
                    vec2(0.2, 1),
                    vec2(0.3, 1),
                    vec2(0.4, 1),
                    vec2(0.5, 1),
                    vec2(0.6, 1), 
                    vec2(0.7, 1),
                    vec2(0.8, 1),
                    vec2(0.9, 1),
                    vec2(1, 1)];
var gutterTexCoords = [];
for(var i = 1; i <= 10; i++) {
    gutterTexCoords.push(_texCoords[i - 1]);
    gutterTexCoords.push(_texCoords[i]);
    gutterTexCoords.push(_texCoords[10 + i]);
    gutterTexCoords.push(_texCoords[i]);
    gutterTexCoords.push(_texCoords[11 + i]);
    gutterTexCoords.push(_texCoords[10 + i]);
}
_vertices = undefined;
_texCoords = undefined;
