import sys

filename = sys.argv[1]
vertices = []
v_texcoords = []
v_normals = []
faces = []
for l in open(filename, "r"):
    if l.startswith("#"):
        pass
    elif l.startswith("v "):
        # v x y z
        ign, x, y, z = l.split(None, 4 - 1)
        vertices.append( (float(x), float(y), float(z)) )
    elif l.startswith("vt "):
        # vt s t
        ign, s, t = l.split(None, 3 - 1)
        v_texcoords.append( (float(s), float(t)) )
    elif l.startswith("vn "):
        # vn x y z
        ign, x, y, z = l.split(None, 4 - 1)
        v_normals.append( (float(x), float(y), float(z)) )
    elif l.startswith("f "):
        # f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3
        ign, v1, v2, v3 = l.split(None, 4 - 1)
        f = []
        for tri in (v1, v2, v3):
            v, vt, vn = tri.split("/", 3 - 1)
            f.append( (int(v), int(vt), int(vn)) )
        faces.append(tuple(f))

def write_js_array(fd, array, array_name, format):
    fd.write("var %s = [" % array_name)
    first = True
    for t in array:
        if first:
            first = False
        else:
            fd.write(",\n")
        fd.write(format % t)
    fd.write("];\n\n")

js_prefix = sys.argv[2]
filename2 = js_prefix + ".js"

fd = open(filename2, "w")
write_js_array(fd, vertices, "%s_v" % js_prefix, "vec4(%f, %f, %f, 1.0)")
write_js_array(fd, v_texcoords, "%s_vt" % js_prefix, "vec2(%f, %f)")
write_js_array(fd, v_normals, "%s_vn" % js_prefix, "vec4(%f, %f, %f, 1.0)")
fv = [(t[0][0], t[1][0], t[2][0]) for t in faces]
fvt = [(t[0][1], t[1][1], t[2][1]) for t in faces]
fvn = [(t[0][2], t[1][2], t[2][2]) for t in faces]
write_js_array(fd, fv, "%s_fv" % js_prefix, "[%d, %d, %d]")
write_js_array(fd, fvt, "%s_fvt" % js_prefix, "[%d, %d, %d]")
write_js_array(fd, fvn, "%s_fvn" % js_prefix, "[%d, %d, %d]")
fd.close()
