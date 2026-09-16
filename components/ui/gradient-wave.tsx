"use client";

import { useEffect, useRef } from "react";

type DeformSettings = {
  incline?: number;
  offsetTop?: number;
  offsetBottom?: number;
  noiseFreq?: [number, number];
  noiseAmp?: number;
  noiseSpeed?: number;
  noiseFlow?: number;
  noiseSeed?: number;
};

export type GradientWaveProps = {
  colors?: string[];
  enabled?: boolean;
  isPlaying?: boolean;
  className?: string;
  shadowPower?: number;
  darkenTop?: boolean;
  noiseSpeed?: number;
  noiseFrequency?: [number, number];
  deform?: DeformSettings;
};

type WaveRuntime = {
  start: () => void;
  stop: () => void;
  destroy: () => void;
};

const defaultColors = ["#eef5fa", "#c5e2f5", "#ffffff", "#dce5eb"];
const defaultFrequency: [number, number] = [0.0001, 0.0009];
const defaultDeform: DeformSettings = {
  incline: 0.5,
  noiseAmp: 250,
  noiseFlow: 5,
};

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_intensity;
  uniform float u_darken_top;
  uniform float u_shadow_power;
  uniform vec2 u_frequency;
  uniform vec3 u_color_0;
  uniform vec3 u_color_1;
  uniform vec3 u_color_2;
  uniform vec3 u_color_3;

  float random(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    float a = random(cell);
    float b = random(cell + vec2(1.0, 0.0));
    float c = random(cell + vec2(0.0, 1.0));
    float d = random(cell + vec2(1.0, 1.0));

    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * noise(point);
      point = point * 2.03 + vec2(17.1, 9.2);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 flowPoint = vec2(
      uv.x * aspect * u_frequency.x + u_time * 0.16,
      uv.y * u_frequency.y - u_time * 0.1
    );
    float organic = fbm(flowPoint);
    float ripple = sin(uv.x * 5.6 + u_time * 0.32) * 0.055;
    float shapedY = uv.y + (organic - 0.5) * 0.34 * u_intensity + ripple;

    float waveOne = smoothstep(0.16, 0.5, shapedY);
    float waveTwo = smoothstep(
      0.38,
      0.72,
      shapedY + sin(uv.x * 7.2 - u_time * 0.24) * 0.055
    );
    float waveThree = smoothstep(
      0.57,
      0.9,
      shapedY + (organic - 0.5) * 0.12
    );

    vec3 color = mix(u_color_0, u_color_1, waveOne);
    color = mix(color, u_color_2, waveTwo * 0.72);
    color = mix(color, u_color_3, waveThree * 0.62);

    float sheenLine = 0.42 + ripple + (organic - 0.5) * 0.18 * u_intensity;
    float sheen = 1.0 - smoothstep(0.0, 0.055, abs(uv.y - sheenLine));
    color += vec3(0.055, 0.105, 0.145) * sheen;

    if (u_darken_top > 0.5) {
      color *= 1.0 - pow(uv.y, u_shadow_power) * 0.12;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

function normalizeColor(hexCode: number): [number, number, number] {
  return [
    ((hexCode >> 16) & 255) / 255,
    ((hexCode >> 8) & 255) / 255,
    (255 & hexCode) / 255,
  ];
}

function parseColor(color: string): [number, number, number] {
  const normalized = color.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((character) => `${character}${character}`).join("")
    : normalized;
  return normalizeColor(Number.parseInt(expanded, 16));
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Não foi possível criar o shader do gradiente.");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Falha ao compilar o shader.";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createWaveRuntime(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  colors: string[],
  shadowPower: number,
  darkenTop: boolean,
  noiseSpeed: number,
  noiseFrequency: [number, number],
  deform: DeformSettings,
): WaveRuntime {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("WebGL não está disponível.");
  const context: WebGLRenderingContext = gl;

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Não foi possível criar o gradiente.");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Falha ao montar o gradiente.");
  }

  const buffer = gl.createBuffer();
  if (!buffer) throw new Error("Não foi possível criar a superfície do gradiente.");
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");
  const intensityLocation = gl.getUniformLocation(program, "u_intensity");
  const darkenTopLocation = gl.getUniformLocation(program, "u_darken_top");
  const shadowPowerLocation = gl.getUniformLocation(program, "u_shadow_power");
  const frequencyLocation = gl.getUniformLocation(program, "u_frequency");
  const colorLocations = [0, 1, 2, 3].map((index) =>
    gl.getUniformLocation(program, `u_color_${index}`),
  );

  const palette = Array.from({ length: 4 }, (_, index) =>
    parseColor(colors[index] ?? colors.at(-1) ?? defaultColors[index]),
  );
  colorLocations.forEach((location, index) => {
    gl.uniform3fv(location, palette[index]);
  });

  const frequencyX = Math.max(1.7, noiseFrequency[0] * 18000);
  const frequencyY = Math.max(2.6, noiseFrequency[1] * 4800);
  const intensity = Math.min(1.15, Math.max(0.3, (deform.noiseAmp ?? 250) / 300));
  const speed = Math.max(0.08, noiseSpeed * 100000);
  gl.uniform1f(intensityLocation, intensity);
  gl.uniform1f(darkenTopLocation, darkenTop ? 1 : 0);
  gl.uniform1f(shadowPowerLocation, shadowPower);
  gl.uniform2f(frequencyLocation, frequencyX, frequencyY);

  let running = false;
  let animationFrame = 0;
  let previousFrame = 0;
  let elapsed = 0;

  function resize() {
    const bounds = container.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      context.viewport(0, 0, width, height);
    }
  }

  function render(time: number) {
    resize();
    context.useProgram(program);
    context.uniform2f(resolutionLocation, canvas.width, canvas.height);
    context.uniform1f(timeLocation, time);
    context.drawArrays(context.TRIANGLES, 0, 6);
  }

  function tick(timestamp: number) {
    if (!running) return;
    const delta = timestamp - previousFrame;
    if (delta >= 1000 / 24) {
      elapsed += Math.min(delta, 100) * 0.001 * speed;
      previousFrame = timestamp;
      render(elapsed);
    }
    animationFrame = window.requestAnimationFrame(tick);
  }

  const resizeObserver = new ResizeObserver(() => render(elapsed));
  resizeObserver.observe(container);
  render(0);

  return {
    start() {
      if (running) return;
      running = true;
      previousFrame = performance.now();
      animationFrame = window.requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      window.cancelAnimationFrame(animationFrame);
    },
    destroy() {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    },
  };
}

export function GradientWave({
  colors = defaultColors,
  enabled = true,
  isPlaying = true,
  className = "",
  shadowPower = 8,
  darkenTop = false,
  noiseSpeed = 0.00001,
  noiseFrequency = defaultFrequency,
  deform = defaultDeform,
}: GradientWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<WaveRuntime | null>(null);
  const colorKey = colors.join("|");
  const frequencyX = noiseFrequency[0];
  const frequencyY = noiseFrequency[1];
  const noiseAmp = deform.noiseAmp;

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    try {
      runtimeRef.current = createWaveRuntime(
        canvas,
        container,
        colorKey.split("|"),
        shadowPower,
        darkenTop,
        noiseSpeed,
        [frequencyX, frequencyY],
        { ...deform, noiseAmp },
      );
    } catch {
      container.dataset.fallback = "true";
    }

    return () => {
      runtimeRef.current?.destroy();
      runtimeRef.current = null;
    };
  }, [colorKey, darkenTop, deform, enabled, frequencyX, frequencyY, noiseAmp, noiseSpeed, shadowPower]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlayback = () => {
      if (isPlaying && !reducedMotion.matches && !document.hidden) runtimeRef.current?.start();
      else runtimeRef.current?.stop();
    };

    updatePlayback();
    reducedMotion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      runtimeRef.current?.stop();
    };
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className={`gradient-wave ${className}`.trim()}
      aria-hidden="true"
    >
      {enabled ? <canvas ref={canvasRef} /> : null}
    </div>
  );
}
