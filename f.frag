#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_vikki;
out vec4 outColor;

float randomWave(vec2 uv) {
	
	float w = sin((u_time) + uv.x) * 0.25;
	w += sin(w / 4.34 + u_time/2.0) * 0.31;
	w += cos(w) /4.13 * 0.2;  
	
	return w;

}

float wavyGlowingLine(vec2 uv) {
	//remapping to -1 <-> 1
	//uv = (uv - 0.5) * 2.0;
	
	float distFromMiddle = length(abs(uv.y));
    //acts more as a scalant/size
    float brightness = 0.01;
    
    float light = (brightness / (distFromMiddle));
	
	return light;

}

vec3 ultraGlowingLine(vec3 col, vec2 uv) {
	
	vec3 cCol = vec3(1.0 - col.r, 1.0 - col.g, 1.0 - col.b);
	
	float glowLine = wavyGlowingLine(uv);
	vec3 greenGlowLine = glowLine / cCol;
	return greenGlowLine;

}

float circle(vec2 uv, vec2 origin, float size) {

	float dist = distance(origin, uv);
	dist = smoothstep(dist, dist+0.03, size);//step(dist, size);
	return dist;
	

}

vec3 circleWithTex(vec2 uv, vec2 origin, float size) {
	//size: 0.3
	vec3 col = vec3(0.0);
	
	float dist = distance(origin, uv);
	dist = smoothstep(dist, dist+0.03, size);
	float texX = smoothstep(origin.x - size, origin.x + size, dist * uv.x);
	float texY = smoothstep(origin.y - size, origin.y + size, dist * uv.y);
	vec2 coords = vec2(texX, texY);
	vec4 vikki = texture(u_vikki, coords);
	
	
	//col += (dist * vec3(0.15, 0.6, 0.8));
	//Step is for cleaning so that things outside texCircle are black
	col += vikki.rgb * step(size, dist);
	
	return col;


}


void main()
{
    vec2 uv = gl_FragCoord.xy/u_resolution;
    //vec4 vikki = texture(u_vikki, uv);
    //setting right aspect ratio
    float ar = u_resolution.x / u_resolution.y;
    uv.x = uv.x * ar;
    uv = (uv - 0.5) * 2.0;
    //uv = abs(uv);
    
    uv.y += randomWave(uv); 
    
    vec3 col = vec3(0.0);
    
    //float middleLine = step(0.499, uv.y) * (1.0 - step(0.501, uv.y));
    
    //float distFromMiddle = length(abs(uv.y));
    //acts more as a scalant/size
    //float brightness = 0.01;
    
    //float light = (brightness / (distFromMiddle));
    float glowLine = wavyGlowingLine(abs(uv));
    
    float upDist = distance(glowLine, uv.y);
    
    vec3 greenGlowLine = glowLine * vec3(0.1, 0.8, 0.4);
    vec3 ugl = ultraGlowingLine(vec3(0.1, 0.8, 0.4), uv);
    col += greenGlowLine;
    
    float c = circle(vec2(uv.x - (sin(u_time)/2.0), uv.y + (cos(u_time))), vec2(glowLine, glowLine), 0.3);
    vec2 coords = smoothstep(c, c, vec2(c));
    //col += texture(u_vikki, coords).rgb;
    col += c * vec3(0.15, 0.6, 0.8);
    
    vec3 ss = circleWithTex(vec2(uv.x-1.0 - (sin(u_time)/2.0), uv.y + (cos(u_time)))*0.8, vec2(glowLine, glowLine), 0.4);
    
    outColor = vec4(ss + greenGlowLine,1.0);
}