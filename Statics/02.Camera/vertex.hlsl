#version 300 es
layout(location = 0) in vec3 pos;
layout(location = 1) in vec3 color;

uniform mat4 MatWorld;
uniform mat4 MatCamera;
uniform mat4 MatProj;

out vec4 vcolor;
void main(){
    gl_Position = MatProj * MatCamera * MatWorld * vec4(pos,1.0);
    vcolor = vec4(color,1.0);
}