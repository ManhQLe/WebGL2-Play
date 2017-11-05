#version 300 es
layout(location = 0) in vec3 pos;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normal;

uniform mat4 MatCamera;
uniform mat4 MatProj;

out vec2 vtexcoord;
out vec3 fnorm;
out vec3 fpos;

void main(){
    vtexcoord = texcoord;  
    fnorm = normal;   
    fpos = pos;
    gl_Position = MatProj * MatCamera * vec4(pos,1.0);
    
}