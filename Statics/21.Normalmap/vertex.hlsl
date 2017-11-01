#version 300 es
layout(location = 0) in vec3 pos;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec3 tangent;

uniform mat4 MatCamera;
uniform mat4 MatProj;

out vec2 vtexcoord;
out vec3 fnorm;
out vec3 fpos;
out vec3 ftan;

void main(){
    vtexcoord = texcoord;  
    fnorm = normal;   
    ftan = tangent;
    fpos = pos;
    gl_Position = MatProj * MatCamera * vec4(pos,1.0);
    
}