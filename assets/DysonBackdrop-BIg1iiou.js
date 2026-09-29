var F=Object.defineProperty;var P=(t,a,r)=>a in t?F(t,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[a]=r;var G=(t,a,r)=>P(t,typeof a!="symbol"?a+"":a,r);import{a as s,j as e}from"./framework-CwUKD8Eh.js";import{W as V,k as A,u as C,l as B,m as T,f as I,M as U,v as D,n as W,o as O,q as $,T as H,w as J,x as K,r as Q,I as X,s as Y,G as Z,t as q,e as ee,y as te,h as z,D as re}from"./three-core-Du5vf3YN.js";import{t as ae}from"./index-CB5Zqxve.js";import{e as se,c as ne,u as oe,a as ie}from"./three-adapter-BfLAKu2U.js";function ce(t){return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}const le=`
  varying vec3 vSurface;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vSurface = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vView = -view.xyz;
    gl_Position = projectionMatrix * view;
  }
`,de=`
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.13, 0.27, 0.41));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                   mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                   mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float n = 0.0, amplitude = 0.53;
    for (int i = 0; i < 4; i++) {
      n += noise(p) * amplitude;
      p = p * 2.07 + vec3(7.1, 3.7, 1.8);
      amplitude *= 0.48;
    }
    return n;
  }
`,ue=`
  uniform float uTime;
  varying vec3 vSurface;
  varying vec3 vNormal;
  varying vec3 vView;
  ${de}
  void main() {
    vec3 p = vSurface * 5.8 + vec3(0.0, uTime * 0.025, 0.0);
    float flow = fbm(p + fbm(p * 1.7) * 2.4);
    float cells = noise(p * 8.0 + flow * 3.0);
    float veins = smoothstep(0.43, 0.66, flow + cells * 0.15);
    vec3 col = mix(vec3(0.72, 0.13, 0.012), vec3(2.1, 1.02, 0.22), veins);
    col += vec3(1.1, 0.68, 0.23) * pow(cells, 5.0);
    float facing = max(dot(normalize(vNormal), normalize(vView)), 0.0);
    col *= 0.53 + 0.47 * pow(facing, 0.35);
    col += vec3(1.0, 0.35, 0.03) * pow(1.0 - facing, 3.0) * 0.3;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`,me=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,he=`
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p), angle = atan(p.y, p.x);
    float waves = sin(angle * 13.0 + uTime * 0.06 + sin(angle * 7.0)) * 0.5 + 0.5;
    float filaments = pow(0.5 + 0.5 * sin(angle * 41.0 + sin(angle * 17.0) * 3.0), 5.0);
    float halo = exp(-max(r - 0.275, 0.0) * 9.5) * 0.21;
    float rim = exp(-abs(r - 0.285) * 68.0) * 0.46;
    float rays = exp(-max(r - 0.28, 0.0) * (13.0 - 5.0 * waves)) * filaments * 0.25;
    float alpha = (halo + rim + rays) * smoothstep(0.235, 0.285, r) * (1.0 - smoothstep(0.65, 1.0, r));
    gl_FragColor = vec4(mix(vec3(1.0, 0.23, 0.025), vec3(1.0, 0.76, 0.3), rim), alpha);
    #include <colorspace_fragment>
  }
`,fe=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 local = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      local = instanceMatrix * local;
      n = mat3(instanceMatrix) * n;
    #endif
    vec4 view = modelViewMatrix * local;
    vNormal = normalize(normalMatrix * n);
    vView = -view.xyz;
    gl_Position = projectionMatrix * view;
  }
`,ve=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec2 cells = vUv * vec2(5.0, 8.0);
    vec2 edge = min(fract(cells), 1.0 - fract(cells));
    vec2 aa = max(fwidth(cells), vec2(0.008));
    float grid = 1.0 - min(smoothstep(0.025, 0.025 + aa.x, edge.x), smoothstep(0.025, 0.025 + aa.y, edge.y));
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float glint = pow(max(dot(reflect(-normalize(vec3(-0.6, 0.8, 1.0)), normalize(vNormal)), normalize(vView)), 0.0), 24.0);
    vec3 col = mix(vec3(0.008, 0.055, 0.12), vec3(0.018, 0.27, 0.38), facing);
    col *= 0.8 + 0.2 * sin(floor(cells.y) * 1.7 + floor(cells.x) * 2.9);
    col = mix(col, vec3(0.09, 0.46, 0.55), grid * 0.65);
    col += vec3(0.35, 0.8, 0.9) * glint * 0.8;
    col += vec3(0.015, 0.11, 0.18) * pow(1.0 - facing, 3.0);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;function pe({quality:t}){const a=s.useRef(null),r=s.useRef(null),c=s.useMemo(()=>{const d=[],n=new te,o=new z,i=new z(0,0,1),l=t==="high"?9:7,h=t==="high"?64:44;for(let u=0;u<l;u++){const m=-1.08+u*2.16/(l-1);for(let f=0;f<h;f++){const p=f/h*Math.PI*2+u%2*.028;if((f+u*3)%19<3||Math.cos(p)>.5&&Math.abs(m)<.58)continue;o.set(Math.sin(p)*Math.cos(m),Math.sin(m),Math.cos(p)*Math.cos(m)),n.quaternion.setFromUnitVectors(i,o);const v=Math.PI*2*2.48*Math.cos(m)/h*.87,y=2.48*2.16/(l-1)*.8;n.position.copy(o).multiplyScalar(2.48),n.scale.set(v,y,.035),n.updateMatrix();const x=n.matrix.clone();n.position.copy(o).multiplyScalar(2.501),n.scale.set(v*.87,y*.9,1),n.updateMatrix(),d.push({frame:x,sail:n.matrix.clone()})}}return d},[t]);return s.useLayoutEffect(()=>{!a.current||!r.current||(c.forEach((d,n)=>{a.current.setMatrixAt(n,d.frame),r.current.setMatrixAt(n,d.sail)}),a.current.instanceMatrix.needsUpdate=!0,r.current.instanceMatrix.needsUpdate=!0,a.current.computeBoundingSphere(),r.current.computeBoundingSphere())},[c]),e.jsxs(e.Fragment,{children:[e.jsxs("instancedMesh",{ref:a,args:[void 0,void 0,c.length],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{color:"#63808c",metalness:.72,roughness:.35})]},`框架-${t}`),e.jsxs("instancedMesh",{ref:r,args:[void 0,void 0,c.length],children:[e.jsx("planeGeometry",{}),e.jsx("shaderMaterial",{vertexShader:fe,fragmentShader:ve,side:re})]},`帆面-${t}`)]})}function _({radius:t,rotation:a,arc:r=Math.PI*2,quality:c}){const d=c==="high"?160:80;return e.jsxs("group",{rotation:a,children:[e.jsxs("mesh",{children:[e.jsx("torusGeometry",{args:[t,.048,6,d,r]}),e.jsx("meshStandardMaterial",{color:"#78919b",metalness:.8,roughness:.29})]}),e.jsxs("mesh",{position:[0,0,.043],children:[e.jsx("torusGeometry",{args:[t,.009,4,d,r]}),e.jsx("meshBasicMaterial",{color:"#76cfdb",toneMapped:!1})]}),e.jsxs("mesh",{children:[e.jsx("torusGeometry",{args:[t-.095,.023,5,d,r]}),e.jsx("meshStandardMaterial",{color:"#a3875a",metalness:.65,roughness:.38})]}),Array.from({length:16},(n,o)=>{const i=o/16*r;return e.jsxs("mesh",{position:[Math.cos(i)*(t-.046),Math.sin(i)*(t-.046),0],rotation:[0,0,i],children:[e.jsx("boxGeometry",{args:[.15,.064,.086]}),e.jsx("meshStandardMaterial",{color:"#82959d",metalness:.65,roughness:.4})]},o)})]})}function xe({quality:t}){const a=s.useMemo(()=>{const r=ce(80321),c=t==="high"?1500:650,d=new Float32Array(c*3),n=new Float32Array(c*3),o=new ee;for(let i=0;i<c;i++)d.set([(r()-.5)*55,(r()-.5)*35,-8-r()*20],i*3),o.set(r()>.84?"#ecc393":"#8eb8d6").multiplyScalar(.3+r()*.8),n.set([o.r,o.g,o.b],i*3);return{positions:d,colors:n}},[t]);return e.jsxs("points",{children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",args:[a.positions,3]}),e.jsx("bufferAttribute",{attach:"attributes-color",args:[a.colors,3]})]}),e.jsx("pointsMaterial",{size:.033,sizeAttenuation:!0,vertexColors:!0,transparent:!0,opacity:.8,depthWrite:!1})]})}function ge({quality:t,active:a,visible:r,lost:c,onReady:d,onFailure:n,onLost:o,onRestored:i}){const{gl:l,viewport:h,size:u,invalidate:m,setFrameloop:f}=oe(),p=s.useRef(null),v=s.useRef(null),y=s.useRef(!1),x=s.useRef(!1),b=s.useRef(0),M=s.useMemo(()=>({uTime:{value:0}}),[]),w=u.width/u.height<.9,N=w?Math.min(h.width/5.6,h.height/8)*.9:Math.min(1.17,h.height/6.5,h.width/9);return s.useLayoutEffect(()=>{const g=l.domElement,j=l.debug.onShaderError,S=()=>{x.current=!0,f("never"),n()},L=R=>{R.preventDefault(),y.current=!1,f("never"),o()},E=()=>{x.current=!1,i(),m()};return l.debug.onShaderError=S,g.addEventListener("webglcontextlost",L),g.addEventListener("webglcontextrestored",E),()=>{l.debug.onShaderError=j,g.removeEventListener("webglcontextlost",L),g.removeEventListener("webglcontextrestored",E)}},[l,m,n,o,i,f]),s.useLayoutEffect(()=>{f(!r||c?"never":a?"always":"demand"),r&&!c&&m()},[a,r,c,t,m,f]),ie(({scene:g,camera:j},S)=>{if(!(x.current||c||!r||l.getContext().isContextLost()))try{a&&(b.current+=Math.min(S,.05)),M.uTime.value=b.current,p.current&&(p.current.rotation.y=.38+b.current*.022,p.current.rotation.z=-.28+Math.sin(b.current*.045)*.035),v.current&&(v.current.rotation.y=b.current*.015),l.render(g,j),!y.current&&!x.current&&(y.current=!0,d())}catch{x.current=!0,f("never"),n()}},1),e.jsxs(e.Fragment,{children:[e.jsx(xe,{quality:t}),e.jsx("ambientLight",{intensity:.55,color:"#7797bb"}),e.jsx("directionalLight",{position:[-3,6,6],intensity:3.5,color:"#b3d9ed"}),e.jsx("directionalLight",{position:[4,-2,-4],intensity:4,color:"#cf9b5d"}),e.jsxs("group",{position:[h.width*(w?.12:.235),h.height*(w?.24:.025),0],scale:N,children:[e.jsx("pointLight",{color:"#ffbb59",intensity:22,distance:8,decay:2}),e.jsxs("mesh",{ref:v,children:[e.jsx("sphereGeometry",{args:[.89,t==="high"?72:40,t==="high"?48:28]}),e.jsx("shaderMaterial",{vertexShader:le,fragmentShader:ue,uniforms:M})]}),e.jsxs("mesh",{position:[0,0,0],renderOrder:2,children:[e.jsx("planeGeometry",{args:[6.3,6.3]}),e.jsx("shaderMaterial",{vertexShader:me,fragmentShader:he,uniforms:M,transparent:!0,depthWrite:!1,blending:q,toneMapped:!1})]}),e.jsxs("group",{ref:p,rotation:[-.26,.38,-.28],children:[e.jsx(pe,{quality:t}),e.jsx(_,{radius:2.61,rotation:[Math.PI/2,0,0],quality:t}),e.jsx(_,{radius:2.78,rotation:[.48,.65,.15],quality:t,arc:Math.PI*1.73}),e.jsx(_,{radius:2.53,rotation:[.12,-.72,1.3],quality:t,arc:Math.PI*1.42}),[-.87,.87].map(g=>e.jsx("group",{position:[0,Math.sin(g)*2.48,0],children:e.jsxs("mesh",{rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[Math.cos(g)*2.48,.026,5,t==="high"?120:64]}),e.jsx("meshStandardMaterial",{color:"#718c97",metalness:.75,roughness:.4})]})},g))]})]})]})}class k extends s.Component{constructor(){super(...arguments);G(this,"state",{failed:!1})}static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(){this.props.onFailure()}render(){return this.state.failed?null:this.props.children}}function ye(t){const a=s.useRef(null),r=s.useRef(t),c=s.useRef(null),{quality:d,onFailure:n}=t;return s.useLayoutEffect(()=>{var o;r.current=t,(o=c.current)==null||o.call(c)},[t]),s.useEffect(()=>{if(!a.current)return;const o=a.current,i=document.createElement("canvas");i.setAttribute("aria-label",ae("戴森球与恒星背景")),i.style.width="100%",i.style.height="100%",o.appendChild(i);let l;try{l=new V({canvas:i,alpha:!0,antialias:d==="high",powerPreference:"low-power",stencil:!1})}catch{i.remove(),n();return}se({Group:Z,Mesh:Y,InstancedMesh:X,Points:Q,BoxGeometry:K,PlaneGeometry:J,TorusGeometry:H,SphereGeometry:$,BufferGeometry:O,BufferAttribute:W,MeshStandardMaterial:D,MeshBasicMaterial:U,ShaderMaterial:I,PointsMaterial:T,AmbientLight:B,DirectionalLight:C,PointLight:A});const h=ne(i);let u=!1,m=!1;const f={onReady:()=>{u||r.current.onReady()},onFailure:()=>{u||r.current.onFailure()},onLost:()=>{u||r.current.onLost()},onRestored:()=>{u||r.current.onRestored()}},p=()=>{!u&&m&&h.render(e.jsx(k,{onFailure:f.onFailure,children:e.jsx(ge,{...r.current,...f})}))};c.current=p;const v=()=>({width:o.clientWidth,height:o.clientHeight,top:0,left:0}),y=()=>Math.min(window.devicePixelRatio||1,d==="high"?1.5:1),x=()=>{if(u||!m)return;const M=r.current;h.configure({size:v(),dpr:y(),frameloop:!M.visible||M.lost?"never":M.active?"always":"demand"}).catch(f.onFailure)},b=new ResizeObserver(x);return h.configure({gl:l,camera:{position:[0,0,11],fov:38,near:.1,far:80},dpr:y(),size:v(),frameloop:"never",events:()=>({enabled:!1,priority:0})}).then(()=>{u||(m=!0,p(),b.observe(o),window.addEventListener("resize",x))}).catch(()=>{u||n()}),()=>{u=!0,c.current=null,b.disconnect(),window.removeEventListener("resize",x),h.unmount(),l.dispose(),i.remove()}},[d,n]),e.jsx("div",{ref:a,className:"dyson-backdrop__surface"})}function _e({motion:t,quality:a}){const[r,c]=s.useState(()=>typeof document<"u"&&!document.hidden),[d,n]=s.useState(!1),[o,i]=s.useState(!1),[l,h]=s.useState(!1),u=s.useCallback(()=>n(!0),[]),m=s.useCallback(()=>{i(!0),n(!1)},[]),f=s.useCallback(()=>{h(!0),n(!1)},[]),p=s.useCallback(()=>h(!1),[]);return s.useEffect(()=>{const v=()=>c(!document.hidden);return document.addEventListener("visibilitychange",v),v(),()=>document.removeEventListener("visibilitychange",v)},[]),s.useEffect(()=>{if(!l)return;const v=window.setTimeout(m,6e3);return()=>window.clearTimeout(v)},[l,m]),e.jsxs("div",{className:"dyson-backdrop","aria-hidden":"true","data-quality":a,"data-renderer":o?"static":l?"recovering":d?"webgl":"loading",children:[e.jsx("div",{className:"dyson-backdrop__nebula"}),e.jsx("div",{className:`dyson-backdrop__fallback${d&&!o&&!l?" dyson-backdrop__fallback--hidden":""}`,children:e.jsxs("div",{className:"dyson-backdrop__static-system",children:[e.jsx("div",{className:"dyson-backdrop__static-core"}),e.jsx("div",{className:"dyson-backdrop__static-sails"}),e.jsx("div",{className:"dyson-backdrop__static-orbit"}),e.jsx("div",{className:"dyson-backdrop__static-orbit dyson-backdrop__static-orbit--cross"})]})}),!o&&e.jsx("div",{className:"dyson-backdrop__canvas",style:{opacity:d&&!l?1:0},children:e.jsx(k,{onFailure:m,children:e.jsx(ye,{motion:t,quality:a,active:t&&r&&!l,visible:r,lost:l,onReady:u,onFailure:m,onLost:f,onRestored:p})})}),e.jsx("div",{className:"dyson-backdrop__shade"})]})}export{_e as default};
