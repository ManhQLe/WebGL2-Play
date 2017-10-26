#version 300 es
precision mediump float;
// From Vertex shader
in vec3 fnorm;
in vec3 fpos;
in vec2 vtexcoord;

out vec4 fragColor;

struct SpotLight{
    vec4 Pos;
    vec4 Li;
    vec3 Dir;
    float Exp;
    float Cutoff;
};

struct MaterialStruct {
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float Shininess;
};

uniform vec3 EyePos;
uniform SpotLight Lights[5];
uniform int NofLight;
uniform MaterialStruct Material;

uniform sampler2D tex;

vec4 PhongModel(int LightIdx,vec3 Position,vec3 Norm){
    vec3 s;
    SpotLight Light = Lights[LightIdx];

    s = normalize(vec3(Light.Pos) - Position);

    float angle = acos(dot(-s,normalize(Light.Dir)));

    float cutoff = radians(Light.Cutoff);
    vec4 I = Light.Li;
    vec4 ambient = I *vec4(Material.Ka,1.0);

    if(angle<cutoff)
    {

        float factor = pow(dot(-s,normalize(Light.Dir)),Light.Exp);
        vec3 v = normalize(EyePos - Position);
        vec3 n = normalize(Norm);
        vec3 h = normalize(v + s);

        return ambient + 
        factor * I * vec4(
             Material.Kd*max(dot(s,n),0.0) +
            Material.Ks * pow( max(dot(h,n),0.0), Material.Shininess)
        ,1.0);
    }
    else
    {
        return vec4(0,1,1,1);
        return ambient;
    }

   
}


void main(){
    vec4 vcolor;
    for(int i = 0;i<NofLight;i++)
    vcolor += PhongModel(i,fpos,fnorm);

    fragColor = vcolor * texture(tex,vtexcoord);
}