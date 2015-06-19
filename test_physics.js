var rigidBodies = null;
var lastTimestamp = null;
var step = 0.01;
var timeAcceleration = 1;

var timestamp = function timestamp() {
    "use strict";

    return (window.performance && window.performance.now) ? window.performance.now() : new Date().getTime();
};

window.onload = function init () {
    "use strict";

    var c = document.getElementById("myCanvas");
    c.width = c.height = 300;
    var ctx = c.getContext("2d");

    rigidBodies = [];
    rigidBodies.push(new CylinderRigidBody(vec3(50, 0, 110),    // position
                                            10, // mass
                                            30  // radius
                                            ));
    rigidBodies[0].v = vec3(200, 0, 0);

    var positions = [   vec3(150, 0, 100),
                        vec3(180, 0,  85),
                        vec3(180, 0, 115),
                        vec3(210, 0,  70),
                        vec3(210, 0, 100),
                        vec3(210, 0, 130),
                        vec3(240, 0,  55),
                        vec3(240, 0,  85),
                        vec3(240, 0, 115),
                        vec3(240, 0, 145)
                        ];
    for (var i = 0; i < positions.length; i++) {
        rigidBodies.push(new CylinderRigidBody(positions[i],    // position
                                            1,  // mass
                                            10  // radius
                                            ));
    }
    rigidBodies.push(new WallRigidBody(1, 0, 0, 0));
    rigidBodies.push(new WallRigidBody(-1, 0, 0, 300));
    rigidBodies.push(new WallRigidBody(0, 0, 1, 0));
    rigidBodies.push(new WallRigidBody(0, 0, -1, 300));


    lastTimestamp = timestamp() * timeAcceleration;
    frame();
};

var frame = function frame () {
    "use strict";

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    var now = timestamp() * timeAcceleration;
    var dt = (now - lastTimestamp) / 1000;
    while (dt >= step) {
        update(step);
        dt -= step;
        lastTimestamp += step * 1000;
    }

    for (var i = 0; i < rigidBodies.length; i++) {
        rigidBodies[i].render(ctx);
    }
    requestAnimFrame(frame);
};

var update = function (dt) {
    var collision_pairs = [];
    for (var i = 0; i < rigidBodies.length; i++) {
        for (var j = i + 1; j < rigidBodies.length; j++) {
            if (rigidBodies[i].is_collided_with(rigidBodies[j])) {
                collision_pairs.push([i, j]);
            }
        }
    }
    for (var k = 0; k < collision_pairs.length; k++) {
        var i = collision_pairs[k][0];
        var j = collision_pairs[k][1];
        rigidBodies[i].get_collided_by(rigidBodies[j]);
        rigidBodies[j].get_collided_by(rigidBodies[i]);
        // fuck;
    }
    for (var i = 0; i < rigidBodies.length; i++) {
        rigidBodies[i].update(dt);
    }
};