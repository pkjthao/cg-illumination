#version 300 es
precision mediump float;

// Input
in vec3 model_position;
in vec3 model_normal;
in vec2 model_uv;

// Uniforms
// material
uniform vec3 mat_color; // Ka = Kd
uniform vec3 mat_specular; // Ks
uniform float mat_shininess; // exponent n
uniform sampler2D mat_texture;
// camera
uniform vec3 camera_position;
// lights
uniform vec3 ambient; // Ia
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec4 FragColor;

void main() {
    // ambient lighting intensity
    vec3 I_ambient = ambient * mat_color;

    // diffuse lighting intensity
    vec3 normalized_surface_normal = noramlize(model_normal);
    vec3 normalized_light_direction = normalize(light_positions[0] - model_position);
    vec3 I_diffuse = light_colors[0] * mat_color * dot(normalized_surface_normal, normalized_light_direction);

    // specular lighting intensity
    vec3 normalized_reflected_light_direction = normalize(2 * dot(normalized_surface_normal, normalized_light_direction) * normalized_surface_normal - normalized_light_direction);
    vec3 normalized_view_direction = noramlize(camera_position - model_position);
    vec3 I_specular = light_colors[0] * mat_specular * pow(dot(normalized_reflected_light_direction, normalized_view_direction), mat_shininess);
    
    // combined
    vec3 combined = I_ambient + I_diffuse + I_specular;

    // Color
    FragColor = vec4(combined, 1.0);
    //FragColor = vec4(mat_color * texture(mat_texture, model_uv).rgb, 1.0);
}
