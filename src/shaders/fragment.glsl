uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

void main()
{
    vec4 color=texture2D(uTexture,vUv);
    float border;
    float w=4.;
    vec2 dd=fwidth(vUv);
    vec2 s=smoothstep(dd*(w+.5),dd*(w-.5),vUv);
    vec2 s1=smoothstep(dd*(w+.5),dd*(w-.5),vUv);
    
    border=max(s.x,s.y);
    float border1=max(s1.x,s1.y);
    border=max(border,border1);
    
    // gl_FragColor=color;
    gl_FragColor=vec4(mix(color.rgb,vec3(border),border),1.);
    
}