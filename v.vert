#version 300 es
precision mediump float;
#define PI 3.14159265359

layout (location = 0) in vec2 a_position;

out vec2 fTex;

void main() {
	
   gl_Position = vec4(a_position, 0.0, 1);
}