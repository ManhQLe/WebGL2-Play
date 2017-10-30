#version 300 es
precision mediump float;
// From Vertex shader
in vec3 fnorm;
in vec3 fpos;
in vec2 vtexcoord;

out vec4 fragColor;

struct LightStruct{
    vec4 Pos;
    vec4 Li;
};

struct MaterialStruct {
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float Shininess;
};

uniform vec3 EyePos;
uniform LightStruct Lights[5];
uniform int NofLight;
uniform MaterialStruct Material;

uniform sampler2D tex;
uniform sampler2D leTex;

vec4 PhongModel(int LightIdx,vec3 Position,vec3 Norm){
    vec3 s;
    if(Lights[LightIdx].Pos.w == 1.0)
        s = normalize(vec3(Lights[LightIdx].Pos) - Position);
    else
        s = normalize(vec3(Lights[LightIdx].Pos));
    vec3 v = normalize(EyePos - Position);
    vec3 n = normalize(Norm);
    vec3 h = normalize(v + s);

    vec4 I = Lights[LightIdx].Li;

    return 
        I * vec4(
            Material.Ka + Material.Kd*max(dot(s,n),0.0) +
            Material.Ks * pow( max(dot(h,n),0.0), Material.Shininess)
        ,1.0);
}


void main(){
    vec4 vcolor;
    for(int i = 0;i<NofLight;i++)
        vcolor += PhongModel(i,fpos,fnorm);
    vec4 texColor = texture(tex,vtexcoord);
    vec4 leColor = texture(leTex,vtexcoord);
    if(leColor.a <0.15)
        discard;
    vec4 finalTex= mix(texColor,leColor,leColor.a);
    fragColor = vcolor * finalTex;
}