import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';

const BASE_URL = import.meta.env.BASE_URL || '/';

class Renderer {
    constructor(canvas, engine, material_callback, ground_mesh_callback) {
        this.canvas = canvas;
        this.engine = engine;
        this.scenes = [
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
        ];
        this.active_scene = 0;
        this.active_light = 0;
        this.shading_alg = 'gouraud';

        this.scenes.forEach((scene, idx) => {
            scene.materials = material_callback(scene.scene);
            scene.ground_mesh = ground_mesh_callback(scene.scene, scene.ground_subdivisions);
            this['createScene'+ idx](idx);
        });

        window.addEventListener("keypress", a => {
            if (String.fromCharCode(a.keyCode) === 'a') {
                this.scenes[this.active_scene].lights[this.active_light].position.x -= 1;
            } else if (String.fromCharCode(a.keyCode) === 'd') {
                this.scenes[this.active_scene].lights[this.active_light].position.x += 1;
            } else if (String.fromCharCode(a.keyCode) === 'f') {
                this.scenes[this.active_scene].lights[this.active_light].position.y -= 1;
            } else if (String.fromCharCode(a.keyCode) === 'r') {
                this.scenes[this.active_scene].lights[this.active_light].position.y += 1;
            } else if (String.fromCharCode(a.keyCode) === 'w') {
                this.scenes[this.active_scene].lights[this.active_light].position.z -= 1;
            } else if (String.fromCharCode(a.keyCode) === 's') {
                this.scenes[this.active_scene].lights[this.active_light].position.z += 1;
            }
            //console.log(this.active_scene);
            console.log(this.scenes[this.active_scene].lights[this.active_light].position);
        });
    }

    createScene0(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        // light1 has half diffuse and specular intensity
        let light1 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
        light1.diffuse = new Color3(0.5, 0.5, 0.5);
        light1.specular = new Color3(0.5, 0.5, 0.5);
        current_scene.lights.push(light1);

        // window.addEventListener("keypress", a => {
        //     if (String.fromCharCode(a.keyCode) === 'a') {
        //         current_scene.lights[this.active_light].position.x -= 1;
        //     } else if (String.fromCharCode(a.keyCode) === 'd') {
        //         current_scene.lights[this.active_light].position.x += 1;
        //     } else if (String.fromCharCode(a.keyCode) === 'f') {
        //         current_scene.lights[this.active_light].position.y -= 1;
        //     } else if (String.fromCharCode(a.keyCode) === 'r') {
        //         current_scene.lights[this.active_light].position.y += 1;
        //     } else if (String.fromCharCode(a.keyCode) === 'w') {
        //         current_scene.lights[this.active_light].position.z -= 1;
        //     } else if (String.fromCharCode(a.keyCode) === 's') {
        //         current_scene.lights[this.active_light].position.z += 1;
        //     }
        //     console.log(current_scene.lights[this.active_light].position);
        // });

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.10, 0.65, 0.15),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];
        
        // Create other models
        let sphere = CreateSphere('sphere', {segments: 32}, scene);
        sphere.position = new Vector3(1.0, 0.5, 3.0);
        sphere.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(0.8, 0.8, 0.8),
            mat_shininess: 16,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);

        let box = CreateBox('box', {width: 2, height: 1, depth: 1}, scene);
        box.position = new Vector3(-1.0, 0.5, 2.0);
        box.metadata = {
            mat_color: new Color3(0.75, 0.15, 0.05),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box);


        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    createScene1(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        // light 1 
        let light1 = new PointLight('light1', new Vector3(1.0, 1.0, 5.0), scene);
        light1.diffuse = new Color3(0.5, 0.5, 0.5);
        light1.specular = new Color3(0.5, 0.5, 0.5);
        current_scene.lights.push(light1);

        window.addEventListener("keypress", a => {
            if (String.fromCharCode(a.keyCode) === 'a') {
                current_scene.lights[this.active_light].position.x -= 1;
            } else if (String.fromCharCode(a.keyCode) === 'd') {
                current_scene.lights[this.active_light].position.x += 1;
            } else if (String.fromCharCode(a.keyCode) === 'f') {
                current_scene.lights[this.active_light].position.y -= 1;
            } else if (String.fromCharCode(a.keyCode) === 'r') {
                current_scene.lights[this.active_light].position.y += 1;
            } else if (String.fromCharCode(a.keyCode) === 'w') {
                current_scene.lights[this.active_light].position.z -= 1;
            } else if (String.fromCharCode(a.keyCode) === 's') {
                current_scene.lights[this.active_light].position.z += 1;
            }
            console.log(current_scene.lights[this.active_light].position);
        });

        // Create ground mesh
        let rocky_texture = new Texture(BASE_URL + 'texturemaps/canyon_rgb.jpg', scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/canyon_elev.jpg', scene);
        ground_mesh.scaling = new Vector3(30.0, 1.0, 15.0);
        ground_mesh.metadata = {
            mat_color: new Color3(1.0, 1.0, 1.0),
            mat_texture: rocky_texture,
            mat_specular: new Color3(0.20, 0.20, 0.20),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }

        
        ground_mesh.material = materials['ground_' + this.shading_alg];

        //house
        let house = new Mesh('house', scene);
        let vertex_positions = [
            0.000, 0.000, 0.000, //0
            0.000, 0.000, -1.000, //1
            1.000, 0.000, -1.000, //2
            1.000, 0.000, 0.000, //3
            0.000, 1.000, 0.000, //4
            0.000, 1.000, -1.000, //5
            1.000, 1.000, -1.000, //6
            1.000, 1.000, 0.000, //7
            0.500, 1.500, 0.000, //8
            0.500, 1.500, -1.000, //9
            0.650, 1.000, -0.200, //10 start of chimney, bottom points
            0.650, 1.000, -0.400, //11
            0.850, 1.000, -0.400, //12
            0.850, 1.000, -0.200, //13 
            0.650, 1.500, -0.200, //14 top points
            0.650, 1.500, -0.400, //15
            0.850, 1.500, -0.400, //16
            0.850, 1.500, -0.200, //17
        ];
        let house_indices = [
            0, 1, 2,
            0, 2, 3, //bottom of house
            0, 4, 5,
            0, 5, 1, //left wall
            1, 5, 6,
            1, 6, 2, // back wall
            2, 6, 7,
            2, 7, 3, //right wall
            0, 4, 7,
            0, 7, 3, //front wall
            4, 8, 7, //front roof
            4, 8, 9,
            4, 9, 5, //left roof
            5, 9, 6, //back roof
            6, 9, 8, 
            6, 8, 7, //right root
            10, 14, 15,
            10, 15, 11,
            15, 16, 12,
            15, 12, 11, 
            16, 17, 13, 
            16, 13, 12,
            17, 15, 10,
            17, 10, 13
        ];
        let vertex_normals = [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0
        ];

        let vertex_data = new VertexData();
        vertex_data.positions = vertex_positions;
        vertex_data.indices = house_indices;
        vertex_data.normals = vertex_normals;
        vertex_data.applyToMesh(house);

        // Assign triangle a material and set its transforms
        house.metadata = {
            mat_color: new Color3(0.75, 0.15, 0.05),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        }
        house.material = materials['illum_' + this.shading_alg];
        
        current_scene.models.push(house);

        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    createScene2(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.40, 0.45, 0.15),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];

        let star = new Mesh('star', scene);
        let vertex_positions = [
            0.000, 1.000, 0.000, //0 back points
            0.224, 0.309, 0.000, //1
            -.224, 0.309, 0.000, //2 //
            0.951, 0.309, 0.000, //3
	        0.363, -0.117, 0.000, //4 //
            0.588, -0.809, 0.000, //5
	        0.000, -0.381, 0.000, //6 //
	        -0.588, -0.809, 0.000, //7
           -0.363, -0.118, 0.000, //8 //
           -0.951, 0.309, 0.000, //9
	        -0.224, 0.309, 0.000, //10
            0.000, 1.000, 1.000, //11 top points
            0.224, 0.309, 1.000, //12
            -.224, 0.309, 1.000, //13 //
            0.951, 0.309, 1.000, //14
	        0.363, -0.117, 1.000, //15 //
            0.588, -0.809, 1.000, //16
	        0.000, -0.381, 1.000, //17 //
	        -0.588, -0.809, 1.000, //18
           -0.363, -0.118, 1.000, //19 //
           -0.951, 0.309, 1.000, //20
	        -0.224, 0.309, 1.000, //21
        ];
        let star_indices = [
            0, 1, 2, // back top point
            1, 3, 4, //top right point
            4, 5, 6, //bottm right point
            6, 7, 8, //bottom left point
            8, 9, 10, //top left point
            1, 4, 6,
            1, 6, 2,
            2, 6, 8, //fill middle
            11, 12, 13, //front top point
            12, 14, 15, //top right point
            15, 16, 17, //bottm right point
            17, 18, 19, //bottom left point
            19, 20, 21, //top left point
            12, 15, 17,
            12, 17, 13,
            13, 17, 19, //fill middle
            0, 11, 12, 
            0, 1, 12,
            1, 3, 12,
            12, 3, 4,
            3, 4, 15,
            3, 15, 14,
            4, 15, 16,
            4, 16, 5,
            5, 6, 16,
            6, 16, 17,
            6, 18, 17,
            6, 18, 7,
            8, 7, 19,
            19, 7, 18,
            9, 20, 19,
            9, 19, 8,
            20, 2, 21,
            20, 2, 9,
            0, 11, 21,
            0, 21, 10
        ];

        let vertex_data = new VertexData();
        vertex_data.positions = vertex_positions;
        vertex_data.indices = star_indices;
        vertex_data.applyToMesh(star);

        // Assign triangle a material and set its transforms
        star.metadata = {
            mat_color: new Color3(0.75, 0.15, 0.05),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        }
        star.material = materials['illum_' + this.shading_alg];
        
        current_scene.models.push(star);

    }

    updateShaderUniforms(scene_idx, shader) {
        let current_scene = this.scenes[scene_idx];
        shader.setVector3('camera_position', current_scene.camera.position);
        shader.setColor3('ambient', current_scene.scene.ambientColor);
        shader.setInt('num_lights', current_scene.lights.length);
        let light_positions = [];
        let light_colors = [];
        current_scene.lights.forEach((light) => {
            light_positions.push(light.position.x, light.position.y, light.position.z);
            light_colors.push(light.diffuse);
        });
        shader.setArray3('light_positions', light_positions);
        shader.setColor3Array('light_colors', light_colors);
    }

    getActiveScene() {
        return this.scenes[this.active_scene].scene;
    }
    
    setActiveScene(idx) {
        this.active_scene = idx;
    }

    setShadingAlgorithm(algorithm) {
        this.shading_alg = algorithm;

        this.scenes.forEach((scene) => {
            let materials = scene.materials;
            let ground_mesh = scene.ground_mesh;

            ground_mesh.material = materials['ground_' + this.shading_alg];
            scene.models.forEach((model) => {
                model.material = materials['illum_' + this.shading_alg];
            });
        });
    }

    setHeightScale(scale) {
        this.scenes.forEach((scene) => {
            let ground_mesh = scene.ground_mesh;
            ground_mesh.metadata.height_scalar = scale;
        });
    }

    setActiveLight(idx) {
        console.log(idx);
        this.active_light = idx;
    }
}

export { Renderer }
