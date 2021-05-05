#version 300 es

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846
#define log2 0.30102999566

#define ITER 1000

#define COLORS 0.12  // color repeat speed
#define COLORS_2 0.5 // color intesity (between 0. and 1.)

uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_coo;


float runMandelbrot(float cx, float cy) {
    float zx;
    float zy;
    for(int i = 0; i <= ITER; i++){
        float n_zx = (zx * zx) - (zy * zy) + cx;
        zy = (2. * zx * zy) + cy;
        zx = n_zx;

        float Zn = sqrt(zx * zx + zy * zy);

        if(Zn > 4.) {
            return float(i) - (log2/Zn)/log2;
        }
    }
    return -1.;
}


vec4 getTheColors(float iter) {
    if(iter == -1.) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    }

    float i = (float(COLORS) * float(ITER)) * (iter / float(ITER));

    float r = (1. - COLORS_2) + COLORS_2 * cos(i);
    float g = (1. - COLORS_2) + COLORS_2 * cos(i + PI / 3.);
    float b = (1. - COLORS_2) + COLORS_2 * cos(i + 2. * PI / 3.);

    return vec4(r,g,b, 1.0);
}

out vec4 fragColor;

void main(void)
{
    float w = u_resolution.x;
    float h = u_resolution.y;
    float x = gl_FragCoord.x - w/2.;
    float y = gl_FragCoord.y - h/2.;

    float cx = x/w/u_zoom + u_coo.x;
    float cy = (y/h/u_zoom + u_coo.y) * h/w;

    fragColor = getTheColors(runMandelbrot(cx, cy));
}
