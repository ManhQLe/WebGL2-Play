#version 300 es
precision mediump float;
// From V
in vec4 vcolor;
in vec2 vtexcoord;

out vec4 fragColor;

uniform sampler2D tex;

void main(){
    const float scale = 1.0;
    bvec2 toDiscard = greaterThan(vtexcoord *scale,vec2(0.2,0.2));
    if(all(toDiscard))
        discard;
    fragColor = vcolor * texture(tex,vtexcoord);
}