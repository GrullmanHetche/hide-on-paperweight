"use client";

import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// A solid hemisphere, not a hollow vessel: light enters the convex face,
// travels through glass (IOR 1.52), then leaves its flat base onto the paper.
const fragmentSource = `
precision highp float;
varying vec2 uv;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
vec3 paper(vec3 p) {
  float grain = (noise(floor(p.xz * 720.0)) - 0.5) * 0.012;
  float shade = smoothstep(-1.8, 1.4, p.x + p.z * 0.65) * 0.048;
  return vec3(0.957, 0.941, 0.898) - shade + grain;
}
vec3 room(vec3 ray) {
  // Soft daylight from a single rectangular window. The rest of the room
  // contributes restrained, warm reflections rather than a glowing outline.
  vec3 color = mix(vec3(0.19, 0.23, 0.22), vec3(0.78, 0.79, 0.75), smoothstep(-0.4, 0.9, ray.y));
  vec3 windowDirection = normalize(vec3(-0.65, 0.95, 0.9));
  vec3 side = normalize(cross(windowDirection, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(side, windowDirection);
  float ahead = dot(ray, windowDirection);
  vec2 projected = vec2(dot(ray, side), dot(ray, up)) / max(ahead, 0.001);
  float window = (1.0 - smoothstep(0.27, 0.32, abs(projected.x)))
    * (1.0 - smoothstep(0.48, 0.55, abs(projected.y))) * step(0.0, ahead);
  color = mix(color, vec3(5.5, 5.45, 5.25), window);
  // A faint reflected silhouette gives the edge optical depth.
  float silhouette = exp(-pow((ray.x - 0.55) * 6.0, 2.0)) * (1.0 - smoothstep(-0.2, 0.45, ray.y));
  return color * (1.0 - silhouette * 0.22);
}
float fresnel(float cosine) {
  return 0.043 + 0.957 * pow(1.0 - clamp(cosine, 0.0, 1.0), 5.0);
}
vec3 baseBounce(vec3 base, vec3 ray) {
  vec3 bounce = reflect(ray, vec3(0.0, 1.0, 0.0));
  float b = dot(base, bounce);
  float d = max(0.0, b*b - dot(base, base) + 1.0);
  vec3 exitPoint = base + bounce * (-b + sqrt(d));
  vec3 exitRay = refract(bounce, -normalize(exitPoint), 1.52);
  if (length(exitRay) < 0.01) return room(reflect(bounce, normalize(exitPoint)));
  if (exitRay.y < -0.01) {
    return paper(exitPoint + exitRay * ((-0.035 - exitPoint.y) / exitRay.y));
  }
  return room(exitRay);
}
void main() {
  vec3 camera = vec3(0.0, 5.8, 3.8);
  vec3 target = vec3(0.0, 0.38, 0.0);
  vec3 forward = normalize(target - camera);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);
  vec3 ray = normalize(forward * 6.7 + right * uv.x * 1.13 + up * uv.y * 1.13);
  float b = dot(camera, ray);
  float discriminant = b*b - dot(camera, camera) + 1.0;
  if (discriminant < 0.0) { gl_FragColor = vec4(0.0); return; }
  float distance = -b - sqrt(discriminant);
  vec3 point = camera + ray * distance;
  if (point.y < 0.0) { gl_FragColor = vec4(0.0); return; }
  vec3 normal = normalize(point);
  vec3 inside = refract(ray, normal, 1.0 / 1.52);
  float baseDistance = -point.y / inside.y;
  vec3 base = point + inside * baseDistance;
  vec3 outgoing = refract(inside, vec3(0.0, 1.0, 0.0), 1.52);
  float baseReflection = fresnel(-inside.y);
  vec3 transmitted;
  if (length(outgoing) < 0.01) {
    transmitted = baseBounce(base, inside);
    baseReflection = 1.0;
  } else {
    vec3 ground = base + outgoing * (-0.035 / outgoing.y);
    transmitted = paper(ground);
  }
  // Base reflections are most visible at the curved lower edge, without
  // drawing concentric rims or making an artificial white inset border.
  vec3 internalReflection = baseBounce(base, inside);
  transmitted = mix(transmitted, internalReflection, baseReflection * 0.48);
  float thickness = clamp(baseDistance, 0.0, 2.0);
  transmitted *= exp(-vec3(0.011, 0.004, 0.008) * thickness);
  vec3 reflected = room(reflect(ray, normal));
  float surfaceReflection = fresnel(dot(-ray, normal));
  vec3 color = mix(transmitted, reflected, surfaceReflection);
  // Window reflections also scatter a little through polished glass.
  float glint = pow(max(dot(reflect(ray, normal), normalize(vec3(-0.65, 0.95, 0.9))), 0.0), 90.0);
  color = mix(color, vec3(1.0, 0.997, 0.975), glint * 0.45);
  float edge = smoothstep(0.0, 0.023, sqrt(discriminant));
  float baseEdge = smoothstep(0.0, 0.009, point.y);
  gl_FragColor = vec4(color, edge * baseEdge);
}`;

export function GlassDome() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const gl = element.getContext("webgl", { alpha: true, antialias: true, preserveDrawingBuffer: true });
    if (!gl) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    const buffer = gl.createBuffer();
    if (!gl.getProgramParameter(program, gl.LINK_STATUS) || !buffer) {
      gl.deleteShader(vertex); gl.deleteShader(fragment); gl.deleteProgram(program);
      return;
    }
    const draw = () => {
      const size = Math.min(720, Math.round(280 * window.devicePixelRatio));
      element.width = size;
      element.height = size;
      gl.viewport(0, 0, size, size);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      element.dataset.rendered = "true";
    };
    draw();
    const restore = () => { element.dataset.rendered = "false"; };
    element.addEventListener("webglcontextlost", restore);
    return () => {
      element.removeEventListener("webglcontextlost", restore);
      gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    };
  }, []);
  return <span className="glass-dome" aria-hidden="true">
    <span className="glass-fallback" />
    <canvas ref={canvas} className="glass-optics" width={400} height={400} />
  </span>;
}
