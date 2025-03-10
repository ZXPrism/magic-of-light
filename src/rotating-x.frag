// Copyright (c) 2025 ZXP4 | https://github.com/ZXPrism/magic-of-light
// Licensed under the MIT License. See the repo for details.

#version 460 core

uniform vec3 iResolution;            // viewport resolution (in pixels)
uniform float iTime;                 // shader playback time (in seconds)
uniform float iTimeDelta;            // render time (in seconds)
uniform float iFrameRate;            // shader frame rate
uniform int iFrame;                  // shader playback frame

const float ANIM_SPEED = 2.0;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float RING_NUM = 50.0 * (1.5 + sin(0.5 * ANIM_SPEED * iTime));

    float width = iResolution.x, height = iResolution.y;
    float len = min(width, height);

    vec2 T = iResolution.xy * 0.5;
    mat2 center_coord_frame = mat2(2.0 / len, 0, 0, 2.0 / len);
    mat2 ring_coord_frame = mat2(RING_NUM, 0, 0, RING_NUM);

    float theta = 45.0 / 180.0 * 3.14159 + ANIM_SPEED * iTime;
    mat2 rotate = transpose(mat2(cos(theta), sin(theta), -sin(theta), cos(theta)));

    vec2 coord = rotate * ring_coord_frame * center_coord_frame * (fragCoord - T);

    // adding some non-linearity
    coord.x = 100.0 / coord.x;
    coord.y = 100.0 / coord.y;

    int ring_id = int(max(abs(coord.x), abs(coord.y)));
    if(ring_id % 2 == 0) {
        float t = float(ring_id) / RING_NUM;
        fragColor = (1.0 - t) * vec4(1.0) + t * vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        fragColor = vec4(vec3(0.0, 0.0, 0.0), 1.0);
    }
}
