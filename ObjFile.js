/*
 *  ObjFile
 *  A class that processes obj_xxx.js file and generate necessaary data strucures
 *  to draw a 3D model.
 *
 *  @constructor ObjFile(v, vt, vn, fv, fvt, fvn)
 *  These arguments corresponds to 6 arrays in obj_xxx.js:
 *      v -> obj_xxx_v
 *      vt -> obj_xxx_vt
 *      vn -> obj_xxx_vn
 *      fv -> obj_xxx_fv
 *      fvt -> obj_xxx_fvt
 *      fvn -> obj_xxx_fvn
 *  
 *  An instance of ObjFile contains the following public attributes: (n is the
 *  number of faces in this model)
 * 
 *  @attrib f_vertices: an vec4 array containing the positions of (3 * n) vertices
 *  @attrib f_texcoords: an vec2 array containing the texture coordinates of
 *      (3 * n) vertices
 *  @attrib f_normals: an vec4 array containing the normals of (3 * n) vertices
 */
var ObjFile = function (v, vt, vn, fv, fvt, fvn) {
    "use strict";

    this.vertices = v;
    this.v_texcoords = vt;
    this.v_normals = vn;
  
    this.f_vertices = [];
    for (var i = 0; i < fv.length; i++) {
        this.f_vertices.push(this.vertices[fv[i][0] - 1]);
        this.f_vertices.push(this.vertices[fv[i][1] - 1]);
        this.f_vertices.push(this.vertices[fv[i][2] - 1]);
    }
    this.f_texcoords = [];
    for (var i = 0; i < fvt.length; i++) {
        this.f_texcoords.push(this.v_texcoords[fvt[i][0] - 1]);
        this.f_texcoords.push(this.v_texcoords[fvt[i][1] - 1]);
        this.f_texcoords.push(this.v_texcoords[fvt[i][2] - 1]);
    }
    this.f_normals = [];
    for (var i = 0; i < fvn.length; i++) {
        this.f_normals.push(this.v_normals[fvn[i][0] - 1]);
        this.f_normals.push(this.v_normals[fvn[i][1] - 1]);
        this.f_normals.push(this.v_normals[fvn[i][2] - 1]);
    }
	/*
	this.get_vertices = function(){
		return this.f_vertices;
	}
	this.get_texCoords = function() {
		return this.f_texcoords;
	}
	this.get_normals = function() {
		return this.f_normals;
	}*/
};
