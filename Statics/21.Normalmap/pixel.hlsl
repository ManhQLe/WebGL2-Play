#version 300 es
precision mediump float;

// From Vertex shader
in vec3 fnorm;
in vec3 fpos;
in vec3 ftan;
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
uniform sampler2D normalTex;

vec4 PhongModel(vec3 s,vec4 I,vec3 v,vec3 Norm){
  
    vec3 n = normalize(Norm);
    vec3 h = normalize(v + s);

    return 
        I * vec4(
            Material.Ka + Material.Kd*max(dot(s,n),0.0) +
            Material.Ks * pow( max(dot(h,n),0.0), Material.Shininess)
        ,1.0);
}


void main(){
    vec4 vcolor;
    
    vec3 binormal = normalize( cross( fnorm, ftan ) );
    mat3 toObjectLocal = mat3(
    ftan.x, binormal.x, fnorm.x,
    ftan.y, binormal.y, fnorm.y,
    ftan.z, binormal.z, fnorm.z );
    vec3 v = normalize(toObjectLocal*(EyePos-fpos));

    vec4 norm = texture(normalTex,vtexcoord);

    for(int i = 0;i<NofLight;i++)
    {
        vec3 s;
        if(Lights[i].Pos.w == 1.0)
            s = vec3(Lights[i].Pos) - fpos;
        else
            s = vec3(Lights[i].Pos);
        s = normalize(toObjectLocal*s);
        
        vcolor += PhongModel(s,Lights[i].Li,v,norm.xyz);
    }
    vec4 texColor = texture(tex,vtexcoord);

    fragColor = vcolor * texColor;
}