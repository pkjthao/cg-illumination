#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
// projection 3D to 2D
uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
// height displacement
uniform vec2 ground_size;
uniform float height_scalar;
uniform sampler2D heightmap;
// material
uniform float mat_shininess;
uniform vec2 texture_scale;
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

// Ka and Kd are the same

void main() {
    // Get initial position of vertex (prior to height displacement)
    vec4 world_pos = world * vec4(position, 1.0);

    // Pass vertex position onto the fragment shader
    vec3 model_position = world_pos.xyz;
    // Pass vertex normal onto the fragment shader
    vec3 model_normal = vec3(0.0, 1.0, 0.0);
    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Pass diffuse and specular illumination onto the fragment shader
    vec3 newPosition = (world*vec4(position, 1.0)).xyz;
    vec3 N = normalize(model_normal);


    // ---height displacement---
    float gray = texture(heightmap, model_uv).r;
    model_position.y += 2.0 * height_scalar * (gray - 0.5);
    // uv for 2 nearby points
    float increment = 0.1;
    vec2 neighbor1_uv = vec2(model_uv.x + increment, model_uv.y); // slightly to the right (little increment in u)
    vec2 neighbor2_uv = vec2(model_uv.x, model_uv.y + increment); // slightly above (little increment in v)
    // pos for 2 nearby points
    vec3 neighbor1_pos = vec3(model_position.x + ground_size.x * increment, model_position.y, model_position.z);
    vec3 neighbor2_pos = vec3(model_position.x, model_position.y + ground_size.y * increment, model_position.z);
    //

    vec3 tangent = neighbor1_pos - model_position;
    vec3 bitangent = neighbor2_pos - model_position;
    model_normal = normalize(cross(tangent, bitangent));



    for (int i = 0; i < num_lights; i++) {
        vec3 L = normalize(light_positions[i] - newPosition);
        vec3 R = normalize(2.0 * dot(N,L) * N-L);
        vec3 V = normalize(camera_position - newPosition);
        diffuse_illum += vec3(light_colors[i] * max(dot(N, L), 0.0));
        specular_illum += vec3(light_colors[i]  * pow(max(dot(R, V), 0.0), mat_shininess));
    }

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * vec4(model_position, 1.0);
}
