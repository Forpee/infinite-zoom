uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

void main()
{
    vec4 color=texture2D(uTexture,vUv);
    
    gl_FragColor=color;
    // gl_FragColor=vec4(1.,0.,0.,1.);
    
}