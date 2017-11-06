#version 300 es
layout(location = 0) in vec3 pos;
layout(location = 1) in vec2 texcoord;
layout(location = 2) in vec3 normal;


uniform mat4 MatCamera;
uniform mat4 MatProj;
uniform mat4 TextureProj;

out vec2 vtexcoord;
out vec3 fnorm;
out vec3 fpos;
out vec3 ftexproj;

void main(){
    vtexcoord = texcoord;  
    fnorm = normal;   
    fpos = pos;
    ftexproj = vec3(TextureProj * vec4(pos,1.0));
    gl_Position = MatProj * MatCamera * vec4(pos,1.0);
    
}