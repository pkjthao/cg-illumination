#version 300 es
precision mediump float;

// Input
in vec3 model_position;
in vec3 model_normal;
in vec2 model_uv;

// Uniforms
// material
uniform vec3 mat_color;
uniform vec3 mat_specular;
uniform float mat_shininess;
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
    // take lines of codes out the loop that don't need loop
    for (int i=0; i<num_lights; i++) {
        vec3 model_color = mat_color * texture(mat_texture, model_uv).rgb;

        // ambient lighting intensity
        vec3 I_ambient = ambient * model_color;

        // diffuse lighting intensity
        vec3 normalized_surface_normal = normalize(model_normal);
        vec3 normalized_light_direction = normalize(light_positions[i] - model_position);
        vec3 I_diffuse = light_colors[i] * model_color * dot(normalized_surface_normal, normalized_light_direction);

        // specular lighting intensity
        vec3 normalized_reflected_light_direction = normalize(2.0 * max(dot(normalized_surface_normal, normalized_light_direction), 0.0) * normalized_surface_normal - normalized_light_direction);
        vec3 normalized_view_direction = normalize(camera_position - model_position);
        vec3 I_specular = light_colors[i] * mat_specular * pow(max(dot(normalized_reflected_light_direction, normalized_view_direction), 0.0), mat_shininess);
        
        // combined
        vec3 combined = I_ambient + I_diffuse + I_specular;

        // Color
        FragColor = min(vec4(1.0, 1.0, 1.0, 1.0), vec4(combined, 1.0));
    }
}
