#version 300 es
precision mediump float;
// From V
in vec4 vcolor;
in vec2 vtexcoord;

out vec4 fragColor;

uniform sampler2D tex;

void main(){

    fragColor = vcolor * texture(tex,vtexcoord);
}