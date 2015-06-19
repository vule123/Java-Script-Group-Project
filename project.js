var gl = null;
var canvas = null;
var textCanvas = null;

// global variables
// array of cubes
var alley = null;
var otherAlleys = null;
// camera
var camera = null;
// projection
var ball = null;
var pins = null;
var leftGutter = null;
var rightGutter = null;
var otherGutters = null;
var logos = [];
var blackPlane = null;

// Geometry constants
var cameraInitPosition = vec3(0, 8, 20);
var gutterWidth = 0.3048 * 10.0;
var alleyModelCenter = vec4(0, 0, 0, 1);
var alleyWidth = 1.0668 * 10.0;
var alleyLength = 21.336 * 10.0 * 0.6;
var alleyVertices = [   vec4(-1, 0, 1, 1),
                        vec4(-1, 0, -1, 1),
                        vec4(1, 0, -1, 1),
                        vec4(-1, 0, 1, 1),
                        vec4(1, 0, -1, 1),
                        vec4(1, 0, 1, 1)];
var alleyNormals = [vec4(0.0, 1.0, 0.0, 1.0),
                    vec4(0.0, 1.0, 0.0, 1.0),
                    vec4(0.0, 1.0, 0.0, 1.0),
                    vec4(0.0, 1.0, 0.0, 1.0),
                    vec4(0.0, 1.0, 0.0, 1.0),
                    vec4(0.0, 1.0, 0.0, 1.0)];
var alleyTexCoords = [  vec2(1, 1),
                        vec2(0, 1),
                        vec2(0, 0),
                        vec2(1, 1),
                        vec2(0, 0),
                        vec2(1, 0)];
var alleyMaterial = new Material(   vec3(0.2, 0.2, 0.2),
                                    vec3(0.9, 0.9, 0.9),
                                    vec3(0.3, 0.3, 0.3),
                                    200,
                                    "reflective",
                                    {
                                        diffuse_texture: "texture-alley-diffuse"
                                    });
var otherAlleyCenters = [   vec3(   - (alleyWidth * 2 + gutterWidth * 4),
                                    0,
                                    - alleyLength / 2),
                            vec3(   - (alleyWidth + gutterWidth * 2),
                                    0,
                                    - alleyLength / 2),
                            vec3(   alleyWidth + gutterWidth * 2,
                                    0,
                                    - alleyLength / 2),
                            vec3(   alleyWidth * 2 + gutterWidth * 4,
                                    0,
                                    - alleyLength / 2)];

var otherGutterCenters = [  vec3(   - (alleyWidth * 2.5 + gutterWidth * 4.5),
                                    0,
                                    - alleyLength / 2),
                            vec3(   - (alleyWidth * 1.5 + gutterWidth * 3.5),
                                    0,
                                    - alleyLength / 2),
                            vec3(   - (alleyWidth * 1.5 + gutterWidth * 2.5),
                                    0,
                                    - alleyLength / 2),
                            vec3(   - (alleyWidth * 0.5 + gutterWidth * 1.5),
                                    0,
                                    - alleyLength / 2),
                            vec3(   alleyWidth * 0.5 + gutterWidth * 1.5,
                                    0,
                                    - alleyLength / 2),
                            vec3(   alleyWidth * 1.5 + gutterWidth * 2.5,
                                    0,
                                    - alleyLength / 2),
                            vec3(   alleyWidth * 1.5 + gutterWidth * 3.5,
                                    0,
                                    - alleyLength / 2),
                            vec3(   alleyWidth * 2.5 + gutterWidth * 4.5,
                                    0,
                                    - alleyLength / 2)
                            ];
var gutterMaterial = new Material(  vec3(0.2, 0.2, 0.2),
                                    vec3(0.9, 0.9, 0.9),
                                    vec3(0.1, 0.1, 0.1),
                                    200,
                                    "texture",
                                    {
                                        diffuse_texture: "texture-gutter-diffuse"
                                    });

var logoSize = (alleyWidth + 2 * gutterWidth);
var logoCenters = [ vec3(- 2 * logoSize, logoSize * 0.65, - alleyLength),
                    vec3(- logoSize, logoSize * 0.65, - alleyLength),
                    vec3(0, logoSize * 0.65, - alleyLength),
                    vec3(logoSize, logoSize * 0.65, - alleyLength),
                    vec3(2 * logoSize, logoSize * 0.65, - alleyLength)];
var logoVertices = alleyVertices;
var logoNormals = alleyNormals;
var logoTexCoords = [   vec2(0, 0),
                        vec2(0, 1),
                        vec2(1, 1),
                        vec2(0, 0),
                        vec2(1, 1),
                        vec2(1, 0)];
var logoMaterial = new Material(vec3(0.4, 0.4, 0.4),
                                vec3(0.9, 0.9, 0.9),
                                vec3(0.3, 0.3, 0.3),
                                200,
                                "texture",
                                {
                                    diffuse_texture: "texture-logo-diffuse"
                                });

var blackPlaneSize = 2 * alleyLength;
var blackPlaneCenter = vec3(0, blackPlaneSize / 2, - (alleyLength + 0.01));
var blackPlaneVertices = alleyVertices;
var blackPlaneNormals = alleyNormals;
var blackPlaneTexCoords = [ vec2(0, 0),
                            vec2(0, 0.01),
                            vec2(0.01, 0.01),
                            vec2(0, 0),
                            vec2(0.01, 0.01),
                            vec2(0.01, 0)];
var blackPlaneMaterial = new Material(  vec3(0.4, 0.4, 0.4),
                                        vec3(0.0, 0.0, 0.0),
                                        vec3(0.0, 0.0, 0.0),
                                        200,
                                        "texture",
                                        {
                                            diffuse_texture: "texture-logo-diffuse"
                                        });

var ballData = new ObjFile(obj_ball_v, obj_ball_vt, obj_ball_vn, obj_ball_fv, obj_ball_fvt, obj_ball_fvn);
var ballModelDiameter = 21.97;
var ballModelCenter = vec4(-0.274167, 10.870105, -5.0427795, 1);
var ballDiameter = 0.22 * 10.0;
var ballMaterial = new Material(vec3(0.2, 0.2, 0.2),
                                vec3(0.9, 0.9, 0.9),
                                vec3(0.8, 0.8, 0.8),
                                50,
                                "texture",
                                {
                                    diffuse_texture: "texture-ballpin-diffuse"
                                });
var ballSpeed = 7.6 * 10.0;
var ballRotateAngle = (ballSpeed / (Math.PI * ballDiameter)) * 360 / 60;
var ballStartPoint = vec3(-0.1, 0, -4);

var pinData = new ObjFile(obj_pin_v, obj_pin_vt, obj_pin_vn, obj_pin_fv, obj_pin_fvt, obj_pin_fvn);
var pinModelHeight = 7.576433;
var pinModelDiameter = 2.608691;
var pinModelCenter = vec4(0, pinModelHeight / 2, 0, 1);
var pinHeight = 0.380 * 10.0;

// See http://bowling.about.com/od/bowlingcenters/qt/pin_rack_dimensions.htm
var pinLayoutStart = 0.9 * alleyLength;
var pinLayoutA = 0.3048 * 10.0;
var pinLayoutB = 0.52705 * 10.0;
var pinCenters = [  vec3(0.0, 0, - pinLayoutStart),
                    vec3(- pinLayoutA * 0.5, 0, - (pinLayoutStart + pinLayoutB * 0.5)),
                    vec3(pinLayoutA * 0.5, 0, - (pinLayoutStart + pinLayoutB * 0.5)),
                    vec3(- pinLayoutA, 0, - (pinLayoutStart + pinLayoutB)),
                    vec3(0, 0, - (pinLayoutStart + pinLayoutB)),
                    vec3(pinLayoutA, 0, - (pinLayoutStart + pinLayoutB)),
                    vec3(- pinLayoutA * 1.5, 0, - (pinLayoutStart + pinLayoutB * 1.5)),
                    vec3(- pinLayoutA * 0.5, 0, - (pinLayoutStart + pinLayoutB * 1.5)),
                    vec3(pinLayoutA * 0.5, 0, - (pinLayoutStart + pinLayoutB * 1.5)),
                    vec3(pinLayoutA * 1.5, 0, - (pinLayoutStart + pinLayoutB * 1.5)),
                    ];
var pinMaterial = new Material( vec3(0.2, 0.2, 0.2),
                                vec3(0.9, 0.9, 0.9),
                                vec3(0.1, 0.1, 0.1),
                                500,
                                "texture",
                                {
                                    diffuse_texture: "texture-ballpin-diffuse"
                                });
// light source
var lightLocation = vec4(0.0, 120.0, - alleyLength * 0.3, 1.0);
var lightColor = vec3(1.0, 1.0, 1.0);
var light = new Light();

var playerTranslateStep = 0.15;
var maxAttempts = 2;
var gameState = {
                    ballMove: false,
                    gutterFallRemainFrame: -1,
                    gutterFallRemainYDiff: 0,
                    nPinsDown: 0,
                    nAttempts: 0,
                    stopped: false,
                    text: "Let's bowling!",
                    text2: "",
                    throwPoint: vec3(ballStartPoint),
                };

var reflection_matrix = function (Nx, Ny, Nz, D) {
    var m = mat4(1 - 2*Nx*Nx,    -2*Nx*Ny,    -2*Nx*Nz, -2*Nx*D,
                    -2*Nx*Ny, 1 - 2*Ny*Ny,    -2*Ny*Nz, -2*Ny*D,
                    -2*Nx*Nz,    -2*Ny*Nz, 1 - 2*Nz*Nz, -2*Nz*D,
                            0,          0,           0,       1);
    return m;
};

/* 
 * vec4_to_vec3()
 * Transform a vec4 (homogeneous cood) to vec3 (cartesion cood)
 */
var vec4_to_vec3 = function (v4) {
    return scale_vec(v4[3], vec3(v4.slice(0, 3)));
};


/* 
 * mv_mult()
 * Multiply matrix and vector
 * Args:
 *      m: MxN matrix
 *      v: Nx1 vector
 */
var mv_mult = function (m, v) {
    if (!m.matrix || m.length === 0) {
        throw "mv_mult(): m is not a matrix";
    } else if (v.length === undefined || v.length === 0) {
        throw "mv_mult(): v is not a vector";
    } else if (m[0].length !== v.length) {
        throw "mv_mult(): dimensionality disagrees";
    }
    var M = m.length;
    var N = m[0].length;
    var v_out = new Array(M);
    for (var i = 0; i < M; i++) {
        v_out[i] = 0.0;
     for (var j = 0 ; j < N; j++) {
            v_out[i] += m[i][j] * v[j];
        }
    }
    return v_out;
};

// Cube objects
function Cube() {
    // the center of the cube
    this.center = null;
    // transformation for texture
    this.textureTransform = mat3();
    // transformation for the cube               
    this.transformation = mat4();
    this.total_transformation = mat4();
    this.boundingBody = null;

    // Methods
    // Cube.init()
    this.init = function (geometry_data, center, material, rigidBody) {
        this.center = center;
        this.modelCenter = center;
        this.material = material;

        if (geometry_data instanceof ObjFile) {
            this.vertexArray = geometry_data.f_vertices;
            this.normalArray = geometry_data.f_normals;
            this.textureCoord = geometry_data.f_texcoords;
        } else {
            this.vertexArray = geometry_data[0];
            this.normalArray = geometry_data[1];
            this.textureCoord = geometry_data[2];
        }
        this.boundingBody = rigidBody;
    }
    
    this.reset = function(position, s) {
        this.transformation = mat4();
        this.total_transformation = mat4();
        this.center = this.modelCenter;
        this.translation(-this.center[0], -this.center[1], -this.center[2]);
        this.scale(s, s, s)
        this.translation(position[0], position[1], position[2]);
        this.boundingBody.pos = vec3(position[0], 0, position[2]);
        this.boundingBody.v = vec3(0, 0, 0);
        this.boundingBody.a = vec3(0, 0, 0);
    }
    
    // transform from object coordinate to world coordinate
    this.combine = function(another_trans) {
        this.total_transformation = mult(another_trans, this.total_transformation);
        return this.total_transformation;
    }
    this.animation = function (description) {
        var old_pos;
        if (this.boundingBody) {
            old_pos = vec3( this.boundingBody.pos[0],
                            this.boundingBody.pos[1],
                            this.boundingBody.pos[2]);
            this.boundingBody.update(0.016);
        }
        // do spinning
        if (description.type === "ball") {
            var spin_angle = description.spin_angle;
            var spin_axis = description.spin_axis;
            this.translation(-this.center[0], -this.center[1], -this.center[2]);
            this.rotation(spin_angle, spin_axis);
            this.translation(this.center[0], this.center[1], this.center[2]);
        } else if (description.type === "pin") {
            var v_magnitude = length(this.boundingBody.v);
            if (v_magnitude > 0) {
                var v = scale_vec(1 / v_magnitude, this.boundingBody.v);
                this.translation(-this.center[0], -this.center[1], -this.center[2]);
                this.rotation(- v[0] * v_magnitude, [0, 0, 1]);
                this.rotation(v[2] * v_magnitude, [1, 0, 0]);
                this.translation(this.center[0], this.center[1], this.center[2]);
            }
        }
        if (this.boundingBody) {
            // this should be put after spinning
            this.translation(this.boundingBody.pos[0] - old_pos[0],
                             0,
                             this.boundingBody.pos[2] - old_pos[2]);
        }
    };
    // update transformation
    this.update = function () {
        this.total_transformation = this.combine(this.transformation);
        this.center = mv_mult(this.transformation, this.center);
        this.transformation = mat4();
    };
    
    // calculate the transformation matrix from the translate operation
    this.translation = function (x, y, z) {
        this.transformation = mult(translate(x, y, z), this.transformation);
    }
    // ball.rotation()
    this.rotation = function (theta, axis) {
        this.transformation = mult(rotate(theta, axis), this.transformation);
    }
    // calculate the transformation matrix from the scale operation
    this.scale = function (x, y, z) {
        this.transformation = mult(scale(x, y, z), this.transformation);
    }
    this.draw_reflection = function (objects) {
        var program = gl.getParameter(gl.CURRENT_PROGRAM);

        var n = vec4(   this.normalArray[0][0], this.normalArray[0][1],
                        this.normalArray[0][2], 0.0);
        n = mv_mult(this.total_transformation, n);
        n = normalize(n, true);
        var D = - n[0] * this.center[0] - n[1] * this.center[1]
                - n[2] * this.center[2];
        var rmat = reflection_matrix(n[0], n[1], n[2], D);

        this.material.bind_reflection(rmat);
        for (var i = 0; i < objects.length; i++) {
            objects[i].bind();
            objects[i].draw();
        }
        this.material.unbind_reflection();
    };
    // Cube.bind()
    this.bind = function () {
        var program = gl.getParameter(gl.CURRENT_PROGRAM);
        
        // bind normal position
        var nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normalArray), gl.STATIC_DRAW);
        var normalLoc = gl.getAttribLocation(program, "vNormal");
        gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(normalLoc);
        
        var colorLoc = gl.getAttribLocation(program, "vColor");
        if (colorLoc !== -1) {
            gl.disableVertexAttribArray(colorLoc);
        }
        
        // bind vertex position
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertexArray), gl.STATIC_DRAW);
        var positionLoc = gl.getAttribLocation(program, "vPosition");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);  

        // bind texture coordinates
        var texCordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.textureCoord), gl.STATIC_DRAW);
        var texCordLoc = gl.getAttribLocation(program, "vTexCoord");
        gl.enableVertexAttribArray(texCordLoc);
        gl.vertexAttribPointer(texCordLoc, 2, gl.FLOAT, false, 0, 0);
                
        var modelLoc = gl.getUniformLocation(program, "modelMatrix");
        gl.uniformMatrix4fv(modelLoc, false, new Float32Array(flatten(this.total_transformation)));
        
        this.material.bind(light);
    };
    this.draw = function () {
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length);
    };
}

/*
 * Transformation
 * A wrapper object of transformation matrix
 * NOTE: all transformations will be applied IN THE ORDER that they appears.
 */
var Transformation = function Transformation () {
    this.mat = mat4();  // init to Identity matrix

    this.reset = function () {
        this.mat = mat4();
    };

    this.rotate = function (angle, axis) {
        this.mat = mult(rotate(angle, axis), this.mat);
        return this;
    };

    this.translate = function (dx, dy, dz) {
        this.mat = mult(translate(dx, dy, dz), this.mat);
        return this;
    };

    this.scale = function (a, b, c) {
        if (b === undefined && c === undefined) {
            b = a;
            c = a;
        }
        this.mat = mult(scale(a, b, c), this.mat);
        return this;
    };

    // combine with another transformation
    this.combine = function (another_trans) {
        this.mat = mult(another_trans.mat, this.mat);
        return this;
    };

    // apply the transformation to a vector
    this.apply_to = function (vector) {
        return mv_mult(this.mat, vector);
    };

    this.clone = function () {
        var ret = new Transformation();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                ret.mat[i][j] = this.mat[i][j];
            }
        }
        return ret;
    }
};  // End of Transformation constructor

var Camera = function Camera (description) {
    this.canvas_width = description.canvas_width;
    this.canvas_height = description.canvas_height;
    this.mode = description.mode;
    this.position = null;   // vec3
    this.xz_heading = null; // float
    this.pitch = null;      // float
    this.at = null;         // vec3
    this.up = null;         // vec3
    this.transformation = new Transformation();
    this.projection = description.projection;

    this.reset = function () {
        this.position = vec4_to_vec3(description.init_position);
        if (this.mode === "flight") {
            this.xz_heading = description.init_xz_heading;
            this.pitch = description.init_pitch;
        } else {
            // look_at
            this.at = description.init_at;
            this.up = description.init_up;
        }
        this.projection.reset();
    };
    this.reset();

    /* 
     * Camera.yaw()
     * Args:
     *      degree: > 0 for left, < 0 for right
     */
    this.yaw = function (degree) {
        if (mode !== "flight") {
            console.log("Camera.yaw(): not flight mode.");
            return;
        }
        this.xz_heading += degree;
    };

    /* 
     * Camera.move()
     * Args:
     *      direction: up/down/left/right/forward/backward
     *      d: distance
     */
    this.move = function (direction, d) {
        if (this.mode !== "flight") {
            console.log("Camera.yaw(): not flight mode.");
            return;
        }
        var delta = null;
        if (direction === "up" || direction === "down") {
            delta = (direction === "up" ? vec3(0,  d, 0)
                                        : vec3(0, -d, 0));
        } else {
            var v = null;
            switch (direction) {
                case "forward":
                    v = vec4( 0, 0, -d, 1);
                    break;
                case "backward":
                    v = vec4( 0, 0,  d, 1);
                    break;
                case "left":
                    v = vec4(-d, 0,  0, 1);
                    break;
                case "right":
                    v = vec4( d, 0,  0, 1);
                    break;
            }
            delta = new Transformation().rotate(this.xz_heading, [0, 1, 0])
                                        .apply_to(v);
            delta = vec4_to_vec3(delta);
        }
        this.position = add(this.position, delta);
    };  // End of Camera.move()

    this.view_transformation = function () {
        var t = new Transformation();
        if (this.mode === "flight") {
            t.translate(-this.position[0], -this.position[1], -this.position[2])
                .rotate(-this.xz_heading, [0, 1, 0])
                .rotate(-this.pitch, [1, 0, 0]);
        } else {
            t.mat = lookAt(this.position, this.at, this.up);
        }
        return t;
    };

    /* 
     * Camera.update()
     * Update camera position and heading, then bind the updated matrices to shaders.
     */
    this.update = function () {
        var program = gl.getParameter(gl.CURRENT_PROGRAM);

        // UPDATE: update position
        var old_position = vec4(this.position, 1);
        this.position = this.transformation.apply_to(old_position);
        this.position = vec4_to_vec3(this.position);
        if (this.mode === "flight") {
            // UPDATE flight mode: update heading
            var v1 = new Transformation().rotate(this.xz_heading, [0, 1, 0])
                                            .apply_to(vec4(0, 0, -1, 0));
            var v2 = normalize(this.transformation.apply_to(v1));
            this.xz_heading = (Math.atan(v2[0] / v2[2]) / Math.PI) * 180.0;
            if (v2[2] > 0)
                this.xz_heading += 180.0;
        } else {
            // UPDATE look_at mode: update at and up vectors
            this.at = this.transformation.apply_to(vec4(this.at, 1.0));
            this.at = vec3(this.at);
            this.up = this.transformation.apply_to(vec4(this.up, 0.0));
            this.up = vec3(this.up);
        }
        this.transformation.reset();
    };

    this.bind = function () {
        var program = gl.getParameter(gl.CURRENT_PROGRAM);

        // BIND
        var mat = this.view_transformation().mat;
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false,
                            new Float32Array(flatten(mat)));
        gl.uniform3fv(gl.getUniformLocation(program, "cameraPosition"),
                        this.position);
        this.projection.update_and_bind();

        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
                        light.position);
    }

};  // End of Camera constructor

var Projection = function Projection (description) {
    this.mode = description.mode;
    var perspective_fovy = null;
    var ortho_geometry = null;  // [left, right, bottom, top]
    var projection_mat = null;

    this.reset = function () {
        if (this.mode === "perspective") {
            var aspect = description.fov_width / description.fov_height;
            perspective_fovy = 60;
            projection_mat = perspective(   perspective_fovy,
                                            aspect,
                                            description.init_near,
                                            description.init_far);
            
        } else {
            // ortho
            ortho_geometry = description.init_geometry;
            projection_mat = ortho( ortho_geometry[0],
                                    ortho_geometry[1],
                                    ortho_geometry[2],
                                    ortho_geometry[3],
                                    description.init_near,
                                    description.init_far);
        }
    };
    this.reset();

    this.adjust_fovy = function(cmd, delta) {
        if (cmd === "narrower") {
            perspective_fovy -= delta;
            if (perspective_fovy < 30) {
                perspective_fovy = 30;
            }
        } else if (cmd === "wider") {
            perspective_fovy += delta;
            if (perspective_fovy > 120) {
                perspective_fovy = 120;
            }
        }
    };

    /*
     * Projection.update_and_bind()
     * Update the projection matrix, and bind the matrix to shaders.
     */
    this.update_and_bind = function () {
        var program = gl.getParameter(gl.CURRENT_PROGRAM);

        if (this.mode === "perspective") {
            var aspect = description.fov_width / description.fov_height;
            projection_mat = perspective(   perspective_fovy,
                                            aspect,
                                            description.init_near,
                                            description.init_far);
        } else {
            // ortho
            projection_mat = ortho( ortho_geometry[0],
                                    ortho_geometry[1],
                                    ortho_geometry[2],
                                    ortho_geometry[3],
                                    description.init_near,
                                    description.init_far);
        }
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false,
                            new Float32Array(flatten(projection_mat)));
    };

};  // End of Projection constructor

window.onload = function init () {
    canvas = document.getElementById("gl-canvas");
    textCanvas = document.getElementById("text-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    if (!program) {
        return;
    }

    gl.useProgram(program);
    
    camera = new Camera({   canvas_width: canvas.width,
                            canvas_height: canvas.height,
                            mode: "flight",
                            init_position: vec4(cameraInitPosition, 1),
                            init_xz_heading: 0,
                            init_pitch: 0,
                            projection: new Projection({mode: "perspective",
                                                        fov_width: canvas.width,
                                                        fov_height: canvas.height,
                                                        init_near: 1,
                                                        init_far: alleyLength + 30
                                                        })
                            });
    
    // initialize the light
    light.init(lightLocation, lightColor);

    // init the main alley
    alleyMaterial.init();
    alley = new Cube();
    alley.init( [alleyVertices, alleyNormals, alleyTexCoords],
                alleyModelCenter,
                alleyMaterial,
                null);
    alley.translation(-alley.center[0], -alley.center[1], -alley.center[2]);
    alley.scale(alleyWidth / 2, 1, alleyLength / 2);
    alley.translation(0, 0, - alleyLength / 2);
    alley.update();

    // init the other alleys
    otherAlleys = [];
    for (var i = 0; i < otherAlleyCenters.length; i++) {
        var otherAlley = new Cube();
        otherAlley.init([alleyVertices, alleyNormals, alleyTexCoords],
                        alleyModelCenter,
                        alleyMaterial,
                        null);
        otherAlley.translation(-otherAlley.center[0], -otherAlley.center[1], -otherAlley.center[2]);
        otherAlley.scale(alleyWidth / 2, 1, alleyLength / 2);
        var c = otherAlleyCenters[i];
        otherAlley.translation(c[0], c[1], c[2]);
        otherAlley.update();
        otherAlleys.push(otherAlley);
    }

    // init logos
    logoMaterial.init();
    logos = [];
    for (var i = 0; i < logoCenters.length; i++) {
        var logo = new Cube();
        logo.init(  [logoVertices, logoNormals, logoTexCoords],
                    alleyModelCenter,
                    logoMaterial,
                    null);
        logo.translation(-logo.center[0], -logo.center[1], -logo.center[2]);
        logo.scale(logoSize / 2, 1, logoSize / 2);
        logo.rotation(90, [1, 0, 0]);
        var c = logoCenters[i];
        logo.translation(c[0], c[1], c[2]);
        logo.update();
        logos.push(logo);
    }

    blackPlaneMaterial.init();
    blackPlane = new Cube();
    blackPlane.init([blackPlaneVertices, blackPlaneNormals, blackPlaneTexCoords],
                    alleyModelCenter,
                    blackPlaneMaterial,
                    null);
    blackPlane.translation(-blackPlane.center[0], -blackPlane.center[1], -blackPlane.center[2]);
    blackPlane.scale(blackPlaneSize / 2, 1, blackPlaneSize / 2);
    blackPlane.rotation(90, [1, 0, 0]);
    blackPlane.translation(blackPlaneCenter[0], blackPlaneCenter[1], blackPlaneCenter[2]);
    blackPlane.update();

    ballMaterial.init();
    ball = new Cube();
    ball.init(  ballData,
                ballModelCenter,
                ballMaterial,
                new CylinderRigidBody(  ballStartPoint,
                                        6.35029,
                                        ballDiameter / 2));
    ball.update();

    pinMaterial.init();
    pins = [];
    for (var i = 0; i < pinCenters.length; i++) {
        var pin = new Cube();
        pin.init(   pinData,
                    pinModelCenter,
                    pinMaterial,
                    new CylinderRigidBody(  pinCenters[i],
                                            1.6,
                                            (pinModelDiameter / 2) * (pinHeight / pinModelHeight)));
        pins.push(pin);
    }

    gutterMaterial.init();
    leftGutter = new Cube();
    leftGutter.init([gutterVertices, gutterNormals, gutterTexCoords],
                    gutterModelCenter,
                    gutterMaterial,
                    new WallRigidBody(1, 0, 0, (alleyWidth + gutterWidth) / 2 - 1));
    leftGutter.translation(-leftGutter.center[0], -leftGutter.center[1], -leftGutter.center[2]);
    leftGutter.scale(gutterWidth / 2, 1, alleyLength / 2);
    leftGutter.translation(- (alleyWidth + gutterWidth) / 2, 0, - alleyLength / 2);
    leftGutter.update();

    rightGutter = new Cube();
    rightGutter.init([gutterVertices, gutterNormals, gutterTexCoords],
                    gutterModelCenter,
                    gutterMaterial,
                    new WallRigidBody(-1, 0, 0, (alleyWidth + gutterWidth) / 2 - 1));
    rightGutter.translation(-rightGutter.center[0], -rightGutter.center[1], -rightGutter.center[2]);
    rightGutter.scale(gutterWidth / 2, 1, alleyLength / 2);
    rightGutter.translation((alleyWidth + gutterWidth) / 2, 0, - alleyLength / 2);
    rightGutter.update();

    otherGutters = [];
    for (var i = 0; i < otherGutterCenters.length; i++) {
        var otherGutter = new Cube();
        otherGutter.init([gutterVertices, gutterNormals, gutterTexCoords],
                        gutterModelCenter,
                        gutterMaterial,
                        null);
        otherGutter.translation(-otherGutter.center[0], -otherGutter.center[1], -otherGutter.center[2]);
        otherGutter.scale(gutterWidth / 2, 1, alleyLength / 2);
        var c = otherGutterCenters[i];
        otherGutter.translation(c[0], c[1], c[2]);
        otherGutter.update();
        otherGutters.push(otherGutter);
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    initGame();

    window.onkeydown = keyPressed;
    render();
}

function resetObjectPositions () {
    camera.position = vec4(cameraInitPosition, 1);
    ball.reset(vec3(ballStartPoint[0], ballDiameter / 2, ballStartPoint[2]),
                ballDiameter / ballModelDiameter);
    for (var i = 0; i < pins.length; i++) {
        pins[i].reset(vec3(pinCenters[i][0], pinHeight / 2, pinCenters[i][2]),
                        pinHeight / pinModelHeight);
    }
}

function initGame () {
    gameState.ballMove = false;
    gameState.nPinsDown = 0;
    gameState.nAttempts = 0;
    gameState.stopped = false;
    gameState.text = "Let's bowling!";
    gameState.text2 = "";
    gameState.throwPoint = vec3(ballStartPoint);
    gameState.gutterFallRemainFrame = -1;
    gameState.gutterFallRemainYDiff = 0;
    gameState.bodies = [ball].concat(pins);

    resetObjectPositions();
    ball.isBall = true;
    ball.disappeared = false;
    ball.collided = null;
    for (var i = 0; i < pins.length; i++) {
        pins[i].isPin = true;
        pins[i].disappeared = false;
        pins[i].collided = null;
    }
};

function changeGameState () {
    var collision_pairs = [];
    for (var i = 0; i < gameState.bodies.length; i++) {
        for (var j = i + 1; j < gameState.bodies.length; j++) {
            var bi = gameState.bodies[i].boundingBody;
            var bj = gameState.bodies[j].boundingBody;
            if (bi.is_collided_with(bj)) {
                collision_pairs.push([i, j]);
            }
        }
    }
    for (var k = 0; k < collision_pairs.length; k++) {
        var i = collision_pairs[k][0];
        var j = collision_pairs[k][1];
        gameState.bodies[i].boundingBody.get_collided_by(gameState.bodies[j].boundingBody);
        gameState.bodies[j].boundingBody.get_collided_by(gameState.bodies[i].boundingBody);
        gameState.bodies[i].collided = gameState.bodies[j];
        gameState.bodies[j].collided = gameState.bodies[i];
    }

    var gutters = [leftGutter, rightGutter];
    for (var i = 0; i < gutters.length; i++) {
        if (ball.boundingBody.is_collided_with(gutters[i].boundingBody)) {
            gameState.gutterFallRemainFrame = 5;
            gameState.gutterFallRemainYDiff = gutters[i].center[1] - ball.center[1];
            var x_diff = gutters[i].center[0] - ball.center[0];
            ball.boundingBody.v[0] = (x_diff * 60) / gameState.gutterFallRemainFrame;
            ball.boundingBody.a[0] = 0;            
            
        }
    }

    if (gameState.gutterFallRemainFrame > 0) {
        var frames = gameState.gutterFallRemainFrame;
        ball.translation(0, gameState.gutterFallRemainYDiff / frames, 0);
        gameState.gutterFallRemainYDiff *= (frames - 1) / frames;
        gameState.gutterFallRemainFrame -= 1;
        if (gameState.gutterFallRemainFrame <= 0) {
            ball.boundingBody.v[0] = 0;
        }
    }

    var p = 0;
    for (var i = 0; i < pins.length; i++) {
        if (pins[i].collided !== null) {
            p += 1;
        }
    }
    gameState.nPinsDown = Math.max(gameState.nPinsDown, p);

    if (gameState.ballMove) {
        if (!gameState.stopped && ball.center[2] < - (alleyLength * 1.02)) { // End of an attempt
            gameState.nAttempts += 1;
            gameState.stopped = true;
        }
        if (gameState.stopped) {
            if (gameState.nPinsDown >= 10) {
                gameState.text = ("Game win: "+ gameState.nAttempts + " attempts");
                gameState.text2 = "Press space bar to restart";
            } else if (gameState.nAttempts >= maxAttempts) {
                gameState.text = ("Game lose: "+ gameState.nPinsDown + " pins down");
                gameState.text2 = "Press space bar to restart";
            } else {
                gameState.text = ("#" + (gameState.nAttempts) +
                                    " attempt, Pin down: " + gameState.nPinsDown);
                gameState.text2 = "Press space bar to continue";
            }
        } else {
            gameState.text = ("#" + (gameState.nAttempts + 1) +
                                " attempt, Pin down: " + gameState.nPinsDown);
            gameState.text2 = "";
        }
        camera.position[2] = Math.max(ball.center[2] + 15, - pinLayoutStart + 15);
    }
    camera.update();

    // Update object states
    alley.update();
    ball.animation({type: "ball",
                    spin_angle: (gameState.ballMove? - ballRotateAngle: 0),
                    spin_axis: [1, 0, 0]
                    });
    ball.update();
    for (var i = 0; i < pins.length; i++) {
        pins[i].animation({type: "pin"});
        pins[i].update();
    }
    leftGutter.update();
    rightGutter.update();
}

// Render objects
function render () {
    setTimeout(function () {
        window.requestAnimationFrame(render);

        changeGameState();

        // ====== DRAWING ======
        // Draw reflection (this will also calculate the reflection for other alleys,
        // because all alleys share the same plane)
        camera.update();
        camera.bind();
        alley.draw_reflection(gameState.bodies.concat(logos));

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var ctx = textCanvas.getContext("2d");
        ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx.font = "32pt Georgia";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(gameState.text, textCanvas.width / 2, 60); 
        ctx.font = "16pt Georgia";
        ctx.fillText(gameState.text2, textCanvas.width / 2, 100); 

        alley.bind();
        alley.draw();
        for (var i = 0; i < otherAlleys.length; i++) {
            otherAlleys[i].bind();
            otherAlleys[i].draw();
        }
        for (var i = 0; i < logos.length; i++) {
            logos[i].bind();
            logos[i].draw();
        }
        blackPlane.bind();
        blackPlane.draw();
        for (var i = 0; i < gameState.bodies.length; i++) {
            if (!gameState.bodies[i].disappeared) {
                gameState.bodies[i].bind();
                gameState.bodies[i].draw();
            }
        }
        leftGutter.bind();
        leftGutter.draw();
        rightGutter.bind();
        rightGutter.draw();
        for (var i = 0; i < otherGutters.length; i++) {
            otherGutters[i].bind();
            otherGutters[i].draw();
        }
    }, 16)
}

// define the functionality of each key pressed 
function keyPressed(event) {
    // check the type of browser and get the key pressed
    var eventObject = window.event ? event : e; // event for IE, e for FireFox
    var keyUnicode = eventObject.charCode ? eventObject.charCode : eventObject.keyCode;
    var Key = String.fromCharCode(keyUnicode);

    if (Key == 'I') { // move the camera forward
        if(!gameState.ballMove)
            camera.move("forward", 1);
    } else if (Key == 'O') { // move the camera backward 
        if(!gameState.ballMove)
            camera.move("backward", 1);
    } else if (Key == ' ') { // throw the ball
        if (gameState.stopped) {
            if (gameState.nPinsDown >= 10 || gameState.nAttempts >= maxAttempts) {
                initGame();
            } else {
                // soft restart
                for (var i = 0; i < gameState.bodies.length; i++) {
                    if (gameState.bodies[i].isPin && gameState.bodies[i].collided !== null) {
                        // make the pin invisible and not colliding with the ball
                        gameState.bodies[i].disappeared = true;
                        gameState.bodies.splice(i, 1);
                        i--;
                    }
                }
                resetObjectPositions();
                gameState.throwPoint = vec3(ballStartPoint);
                gameState.stopped = false;
                gameState.ballMove = false;
                gameState.text2 = "";
            }
        } else if (!gameState.ballMove) {
            gameState.ballMove = true;
            var sign = (ball.center[0] < 0? -1: 1);
            if (Math.abs(ball.center[0]) < 0.2) {
                sign = 0;
            }
            ball.boundingBody.v = vec3(sign * 0.5, 0, - ballSpeed);
            ball.boundingBody.a = vec3(sign * 1.2, 0, 0);
        }
    } else if (Key == 'A') {    // left
        if(!gameState.ballMove) {
            var x = gameState.throwPoint[0] - playerTranslateStep;
            if (x < - (alleyWidth - ballDiameter) / 2) {
                x += playerTranslateStep;
            }
            gameState.throwPoint[0] = x;
            ball.reset(vec3(x, ballDiameter / 2, ballStartPoint[2]),
                        ballDiameter / ballModelDiameter);
        }
    } else if (Key == 'D') {
        if(!gameState.ballMove) {
            var x = gameState.throwPoint[0] + playerTranslateStep;
            if (x > (alleyWidth - ballDiameter) / 2) {
                x -= playerTranslateStep;
            }
            gameState.throwPoint[0] = x;
            ball.reset(vec3(x, ballDiameter / 2, ballStartPoint[2]),
                        ballDiameter / ballModelDiameter);
        }
    }
}

function Material(ambient, diffuse, specular, shininess, shadeType, texture_description) {
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess_ = shininess;
    this.shadeType = shadeType;
    if (this.shadeType === "texture" || this.shadeType === "reflective") {
        this.diffuseTextureId = texture_description.diffuse_texture;
        this.diffuseTexture = null;
    }
    
    // should be called in window.onload
    this.init = function () {
        this.diffuseTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.diffuseTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,
                        document.getElementById(this.diffuseTextureId));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);

        if (this.shadeType ===  "reflective") {
            // create frame buffer
            this.reflectFrameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.reflectFrameBuffer);
            this.reflectFrameBuffer.width = 2048;
            this.reflectFrameBuffer.height = 2048;

            // create texture for reflection
            this.reflectTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.reflectTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                            this.reflectFrameBuffer.width, this.reflectFrameBuffer.height,
                            0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.generateMipmap(gl.TEXTURE_2D);

            // create depth buufer
            var depth_buffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depth_buffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
                                    this.reflectFrameBuffer.width,
                                    this.reflectFrameBuffer.height);

            // attach depth buffer and texture to frame buffer
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.reflectTexture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth_buffer);

            this.dumpTexture = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.dumpTexture);
            this.dumpTexture.width = 1;
            this.dumpTexture.height = 1;

            // rebind the default ones.
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        }
    };

    this.ambientProduct = function (light) {
        if (this.shadeType === "texture" || this.shadeType === "reflective") {
            return mult(this.ambient, light.ambient());
        } else {
            return light.ambient();
        }
    };
    this.diffuseProduct = function (light) {
        if (this.shadeType === "texture" || this.shadeType === "reflective") {
            return light.diffuse();
        } else {
            return mult(this.diffuse, light.diffuse());
        }
    };
    this.specularProduct = function (light) {
        return mult(this.specular, light.specular());
    };
    this.shininess = function () {
        return this.shininess_;
    };
    this.shadeTypeInt = function () {
        return {"constant": 0,
                "phong": 1,
                "texture": 2,
                "reflective": 3
                }[this.shadeType];
    };
    // Material.bind(light)
    this.bind = function (light) {
        var program = gl.getParameter(gl.CURRENT_PROGRAM);

        gl.uniform1i(gl.getUniformLocation(program, "shadingType"), 
                        this.shadeTypeInt());

        var ambientLoc = gl.getUniformLocation(program, "ambientProduct");
        gl.uniform4fv(ambientLoc, vec4(this.ambientProduct(light)));

        var diffuseLoc = gl.getUniformLocation(program, "diffuseProduct");
        gl.uniform4fv(diffuseLoc, vec4(this.diffuseProduct(light)));

        var specularLoc = gl.getUniformLocation(program, "specularProduct");
        gl.uniform4fv(specularLoc, vec4(this.specularProduct(light)));

        var shinLoc = gl.getUniformLocation(program, "shininess");
        gl.uniform1f(shinLoc, this.shininess());

        gl.uniform1i(gl.getUniformLocation(program, "useSpecularTexture"),
                        0);

        // configure the texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.diffuseTexture);
        gl.uniform1i(gl.getUniformLocation(program, "diffuseTexture"),
                        0);
        if (this.shadeType === "reflective") {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.reflectTexture);
            gl.uniform1i(gl.getUniformLocation(program, "reflectTexture"),
                            2);
        } else {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.dumpTexture);
            gl.uniform1i(gl.getUniformLocation(program, "reflectTexture"),
                            2);
        }
    };
    this.bind_reflection = function (rmat) {
        if (this.shadeType !==  "reflective") {
            console.log("Material.bind_reflection(): not reflective material");
        }
        var program = gl.getParameter(gl.CURRENT_PROGRAM);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.reflectFrameBuffer);
        gl.viewport(0, 0, this.reflectFrameBuffer.width, this.reflectFrameBuffer.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniform1i(gl.getUniformLocation(program, "useReflectionMatrix"),
                        1);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "reflectionMatrix"),
                            false, new Float32Array(flatten(rmat)));
    };
    this.unbind_reflection = function () {
        if (this.shadeType !==  "reflective") {
            console.log("Material.unbind_reflection(): not reflective material");
        }
        var program = gl.getParameter(gl.CURRENT_PROGRAM);

        gl.uniform1i(gl.getUniformLocation(program, "useReflectionMatrix"),
                        0);
        gl.bindTexture(gl.TEXTURE_2D, this.reflectTexture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
}

function Light() {
    this.position = vec4();
    this.color = vec3();
    this.lightAmbient = vec3();
    this.lightDiffuse = vec3();
    this.lightSpecular = vec3();
    
    this.init = function (pos, color) {
        // set up the light source
        this.position = pos;
        this.color = color;
        this.lightAmbient = vec3(0.8, 0.8, 0.8);
        this.lightDiffuse = vec3(0.9, 0.9, 0.9);
        this.lightSpecular = vec3(0.7, 0.7, 0.7);
    }
    this.bind = function () {
        var program = gl.getParameter(gl.CURRENT_PROGRAM);
        var lightLoc = gl.getUniformLocation(program, "lightPosition");

        // transform the light position from world coordinate to eye coordinate
        var lightPosition;
        lightPosition = multMV(camera.worldToEye(), this.position);
        gl.uniform4fv(lightLoc, lightPosition);

        this.planet.bind();
    }
    this.ambient = function () {
        return this.lightAmbient;
    }
    this.diffuse = function () {
        return this.lightDiffuse;
    }
    this.specular = function () {
        return this.lightSpecular;
    }
}
