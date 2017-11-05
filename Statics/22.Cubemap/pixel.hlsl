#version 300 es
precision mediump float;

// From Vertex shader
in vec2 vtexcoord;
in vec3 fnorm;
in vec3 fpos;
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

vec4 PhongModel(vec3 s,vec4 I,vec3 v,vec3 Norm){
  
    vec3 n = normalize(Norm);
    vec3 h = normalize(v + s);

    return 
        I * vec4(
            Material.Ka + Material.Kd*max(dot(s,n),0.0) +
            Material.Ks * pow( max(dot(h,n),0.0), Material.Shininess)
        ,1.0);
}

vec2 Face(vec3 v){
    float m = max(abs(v.x),max(abs(v.y),abs(v.z)));
   
    if(m==abs(v.x))
        return vec2(m/v.x * 1.0,m);
    if(m==abs(v.y))
        return vec2(m/v.y * 2.0,m);
    if(m==abs(v.z))
        return vec2(m/v.z * 3.0,m);
}

void main(){
    vec4 vcolor;

    vec3 v = normalize(EyePos-fpos);
    vec3 r = reflect(-v,fnorm);
    vec2 F = Face(r);
    
    vec2 map;
    if(F.x == 1.0){
        map.x = 0.5 *(1.0 - r.z/F.y);
        map.y = 0.5 *(1.0 - r.y/F.y);
    }
    if(F.x == -1.0){
        map.x = 0.5 *(1.0 - r.z/F.y);
        map.y = 0.5 *(1.0 + r.y/F.y);
    }
    if(F.x == 2.0){
        map.x = 0.5 *(1.0 + r.x/F.y);
        map.y = 0.5 *(1.0 + r.z/F.y);
    }
    if(F.x == -2.0){
        map.x = 0.5 *(1.0 - r.x/F.y);
        map.y = 0.5 *(1.0 + r.z/F.y);
    }
    if(F.x == 3.0){
        map.x = 0.5 *(1.0 + r.x/F.y);
        map.y = 0.5 *(1.0 - r.y/F.y);
    }
    if(F.x == -3.0){
        map.x = 0.5 *(1.0 + r.x/F.y);
        map.y = 0.5 *(1.0 + r.y/F.y);
    }
    
    


    for(int i = 0;i<NofLight;i++)
    {
        vec3 s;
        if(Lights[i].Pos.w == 1.0)
            s = vec3(Lights[i].Pos) - fpos;
        else
            s = vec3(Lights[i].Pos);
        
        vcolor += PhongModel(s,Lights[i].Li,v,fnorm);
    }
    vec4 texColor = texture(tex,map);

    fragColor = vcolor * texColor;
}