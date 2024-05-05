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
    // vec4 world_pos = world * vec4(position, 1.0);

    // height displacement steps:
    // This process involves modifying individual vertices' y-coordinate.
    // This process is useful for taking a standard plane and shifting each
    // vertex up/down some amount, thus creating uneven surface (often used for
    // terrain creation). You will use a grayscale texture as our heightmap
    // that will control the vertex displace as follows:
    // d = 2.0 ⋅ scale ⋅ (gray - 0.5)
    // This effectively will do the following:
    // - Black: shift vertex down in the y direction "scale" units
    // - 50% Gray: vertex remains unchanged
    // - White: shift vertex up in the y direction "scale" units
    // One challenge with modifying the vertices of a model is that
    // it can mess with the normal vector directions. To compute the
    // normal vector for a vertex when doing height displacement, you
    // need to determine where 2 "nerby" vertices will be located. This
    // can be done by sampling the heightmap texture using slightly
    // different UV coordinates (neighbor 1 - slightly right;
    // neighbor 2 - slightly above). Once you know the positions
    // of the 2 nearby points, you use the following equations
    // to calculate the normal vector:
    // - tangent = neighbor1_pos - position
    // - bitangent = neighbor2_pos - position
    // - normal = normalize(tangent X bitangent)


    // Pass diffuse and specular illumination onto the fragment shader
    diffuse_illum = vec3(0.0, 0.0, 0.0);
    specular_illum = vec3(0.0, 0.0, 0.0);

    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world_pos;
}
