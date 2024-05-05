#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv; // texture coordinates

// Uniforms
// projection 3D to 2D
uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
// material
uniform vec2 texture_scale;
uniform float mat_shininess; // exponent n
// camera
uniform vec3 camera_position;
// lights
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec2 model_uv;
out vec3 diffuse_illum;
out vec3 specular_illum;

void main() {
    // initialize the the world space location 
    vec3 newPosition = (world*vec4(position, 1.0)).xyz;


    // Model's normals are already computed through vec3 normal.

    // compute the shading value at each vertex using the light vector "l",
    // the normal vector "n", and the view vector "v"

    // Calculate I_a (Already passed into the fragment shader), I_p * (Norm N dot Norm L), and I_p * (Norm R dot Norm V)^n
    // Ambient Light, Diffuse Light            , and Specular Light

    // all are vector 3s
    // what is N 
    vec3 N = normalize(normal);

    // what is L
    // from the object to the light source
    vec3 L = normalize(light_positions[0] - newPosition);

    // what is R

    vec3 R = normalize(2.0 * dot(N,L) * N-L);

    // what is V
    // when calculating the direction for any vector, you must subtract the distance from
    // the object to the desired vector

    vec3 V = normalize(camera_position);

    // max sets the value to 0 if the dot product is negative
    // Pass diffuse and specular illumination onto the fragment shader
    diffuse_illum = vec3(light_colors[0] * max(dot(N, L), 0.0));
    // change the 0 to the index of the light source to loop over all of the light sources in the scene
    specular_illum = vec3(light_colors[0]  * pow(max(dot(R, V), 0.0), mat_shininess));

    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world * vec4(position, 1.0);
}
