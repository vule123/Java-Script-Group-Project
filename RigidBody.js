var CylinderRigidBody = function (init_pos_, mass_, radius_) {
    "use strict";

    this.mass = mass_;
    this.pos = vec3(init_pos_[0], init_pos_[1], init_pos_[2]);
    this.radius = radius_;      // radius of cylinder
    this.v = vec3(0, 0, 0);     // velocity
    this.a = vec3(0, 0, 0);     // acceleration
    var impulses = [];

    this.get_collided_by = function (another) {
        var e = 1.0;    // coefficient of restitution
        var v_AB = subtract(this.v, another.v);
        if (another instanceof CylinderRigidBody) {
            var n = normalize(subtract(this.pos, another.pos));
            var c = - (1 + e) * this.mass * another.mass / (this.mass + another.mass);
        } else if (another instanceof WallRigidBody) {
            var n = normalize(vec3(another.A, another.B, another.C));
            var c = - (1 + e) * this.mass;
        }

        var imp = scale_vec(c * dot(v_AB, n), n);
        impulses.push(imp);
    };

    this.update = function (dt) {
        for (var i = 0; i < impulses.length; i++) {
            this.v = add(this.v, scale_vec(1 / this.mass, impulses[i]));
        }
        impulses = [];
        this.pos = add(this.pos, scale_vec(dt, this.v));
        this.v = add(this.v, scale_vec(dt, this.a));
    };

    this.render = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[2], this.radius, 0, 2 * Math.PI);  // (x, z)
        ctx.stroke();
    };

    this.is_collided_with = function (another) {
        if (another instanceof CylinderRigidBody) {
            var dist = length(subtract(this.pos, another.pos))
            if (dist >= (this.radius + another.radius)) {
                return false;
            } else {
                var v_AB = subtract(this.v, another.v);
                var n = subtract(this.pos, another.pos);

                return dot(v_AB, n) < 0;
            }
        } else if (another instanceof WallRigidBody) {
            var n = vec3(another.A, another.B, another.C);
            var l = length(n);
            var dist = (dot(this.pos, n) + another.D) / l;
            return (0 < dist && dist < this.radius);
        } else {
            no_such_function;
        }
    };
};

var WallRigidBody = function (A, B, C, D) {
    "use strict";

    // A x + B y + C z + D > 0
    this.A = A;
    this.B = B;
    this.C = C;
    this.D = D;
    this.v = vec3(0, 0, 0);

    this.get_collided_by = function (another) {
        return;
    };

    this.update = function (dt) {
        return;
    };

    this.render = function (ctx) {
        return;
    };

    this.is_collided_with = function (another) {
        if (another instanceof CylinderRigidBody) {
            return another.is_collided_with(this);
        } else {
            return false;
        }
    };
}
