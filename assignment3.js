import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

export class Assignment3 extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
            // Fill in as many additional shape instances as needed in this key/value table.
            //        (Requirement 1)
            sun: new defs.Subdivision_Sphere(4), // Use a sphere that is subdivided 4 times.
            planet1: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
            planet2: new defs.Subdivision_Sphere(3),
            planet3: new defs.Subdivision_Sphere(4),
            planet3_ring: new defs.Torus(45, 45),
            planet4: new defs.Subdivision_Sphere(4),
            planet4_moon: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(1),
        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828")}),
            ring: new Material(new Ring_Shader()),
            // Fill in as many additional material objects as needed in this key/value table.
            //        (Requirement 4)
            sun: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, color: hex_color("#ffffff")}),
            planet1: new Material(new defs.Phong_Shader(),
                {ambient: 0, diffusivity: 1, color: hex_color("#808080")}), // gray is 808080
            planet2_p: new Material(new defs.Phong_Shader(),
                {ambient: 0, diffusivity: .25, color: hex_color("#80FFFF"), specularity: 1}), // for odd seconds
            planet2_g: new Material(new Gouraud_Shader(),
                {ambient: 0, diffusivity: .25, color: hex_color("#80FFFF"), specularity: 1}), // for even seconds
            planet3: new Material(new defs.Phong_Shader(),
                {ambient: 0, diffusivity: 1, color: hex_color("#B08040"), specularity: 1}),
            planet3_ring: new Material(new Ring_Shader(),
                {ambient: 1, diffusivity: 0, color: hex_color("#B08040"), specularity: 0}),
            planet4: new Material(new defs.Phong_Shader(),
                {ambient: 0, diffusivity: 1, color: hex_color("#163CA5"), specularity: 1}),
            planet4_moon: new Material(new defs.Phong_Shader(),
                {ambient: 0, diffusivity: 1, color: hex_color("#FF00FF"), specularity: 1}),

        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => this.initial_camera_location);
        this.new_line();
        this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => this.attached = () => this.planet_1);
        this.key_triggered_button("Attach to planet 2", ["Control", "2"], () => this.attached = () => this.planet_2);
        this.new_line();
        this.key_triggered_button("Attach to planet 3", ["Control", "3"], () => this.attached = () => this.planet_3);
        this.key_triggered_button("Attach to planet 4", ["Control", "4"], () => this.attached = () => this.planet_4);
        this.new_line();
        this.key_triggered_button("Attach to moon", ["Control", "m"], () => this.attached = () => this.moon);
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const yellow = hex_color("#fac91a");
        let model_transform = Mat4.identity();

        // Create Planets (Requirement 1)
        // sun
        // spherical sun at origin
        // radius 1 -> 3 and back in 10sec period
        // r(t)=A⋅sin(Bt+C)+D is formula
        // A = 3-1/2 = 1, B=2pi/10= pi/5, D=(3+1)/2=2
        let sun_rad = Math.sin(Math.PI/5 * t) + 2;
        let transform_s =model_transform.times(Mat4.scale(sun_rad, sun_rad, sun_rad));
        // red (small) -> white (large)
        // red is 255,0,0 and white is 255,255,255 but doing a ratio /255 (1=255/255)
        // r(t)=A⋅sin(Bt+C)+D is formula
        // A = 1-0/2 = 1/2, B=2pi/10= pi/5, D=(1+0)/2= 1/2
        let gb_vals = (1/2)*Math.sin(Math.PI/5 * t) + (1/2);
        // always have R 255/255 = 1
        let red_to_white = color(1, gb_vals, gb_vals, 1);

        // Lighting (Requirement 2)
        // point light src same color and centered on the sun, 10**n size (n=sun radius)
        const light_position = vec4(0, 0, 0, 1); // x,y,z,w (w=1 for a point)
        // The parameters of the Light are: position, color, size
        program_state.lights = [new Light(light_position, red_to_white, 10**sun_rad)];

        this.shapes.sun.draw(context, program_state, transform_s, this.materials.sun.override({color: red_to_white}));


        // Planet 1 - orbit 5 units away from the sun (translate 5), radius 1, rotate about the y to have right effect
        let transform_p1 = model_transform.times(Mat4.rotation(t, 0, 1, 0)).times(Mat4.translation(5, 0, 0));
        this.shapes.planet1.draw(context, program_state, transform_p1, this.materials.planet1);

        // Planet 2 - orbit 5+4 units, radius 1, rotate about the y to have right effect, slower than p1
        let transform_p2 = model_transform.times(Mat4.rotation(t/2, 0, 1, 0)).times(Mat4.translation(9, 0, 0));
        if (0 !== Math.floor(t%2)){ // floor so it happens once per actual second (not including milliseconds and stuff)
            //odd second = P shading
            this.shapes.planet2.draw(context, program_state, transform_p2, this.materials.planet2_p);
        }else{
            this.shapes.planet2.draw(context, program_state, transform_p2, this.materials.planet2_g);
        }

        // Planet 3 and ring
        // not doing wobbles
        let transform_p3 = model_transform.times(Mat4.rotation(t/4, 0, 1, 0)).times(Mat4.translation(13, 0, 0));
        this.shapes.planet3.draw(context, program_state, transform_p3, this.materials.planet3);
        let transform_p3ring = model_transform.times(Mat4.rotation(t/4, 0, 1, 0)).times(Mat4.translation(13, 0, 0)).times(Mat4.scale(3, 3, 0.2));
        this.shapes.planet3_ring.draw(context, program_state, transform_p3ring, this.materials.planet3_ring);

        // Planet 4 and moon
        let transform_p4 = model_transform.times(Mat4.rotation(t/6, 0, 1, 0)).times(Mat4.translation(17, 0, 0));
        this.shapes.planet4.draw(context, program_state, transform_p4, this.materials.planet4);
        // move moon to planet 4 and then rotate it about p4's axis while also continuing to follow its movement
        let transform_p4moon = model_transform.times(Mat4.rotation(t/6, 0, 1, 0)).times(Mat4.translation(17, 0, 0)).times(Mat4.rotation(t, 0, 1, 0)).times(Mat4.translation(-2, 0, 0));
        this.shapes.planet4_moon.draw(context, program_state, transform_p4moon, this.materials.planet4_moon);


        // call attached() if attached isn't undefined (button pressed)
        if(this.attached !== undefined){

            // Somewhere in display() compute desired camera matrix (aka 'desired')
            // by calling this.attached(),
            // translating the returned value by 5 units to back away from the planet (we don't want to be inside of it),
            // and then inverting that matrix (because it's going to be used for a camera, not a shape).
            // Set the camera position as 'desired' with function program_state.set_camera(desired)
            this.planet_1 = Mat4.inverse(transform_p1.times(Mat4.translation(0, 0, 5)));
            this.planet_2 = Mat4.inverse(transform_p2.times(Mat4.translation(0, 0, 5)));
            this.planet_3 = Mat4.inverse(transform_p3.times(Mat4.translation(0, 0, 5)));
            this.planet_4 = Mat4.inverse(transform_p4.times(Mat4.translation(0, 0, 5)));
            this.moon = Mat4.inverse(transform_p4moon.times(Mat4.translation(0, 0, 5)));

            // Set the camera position as 'desired' with function program_state.set_camera(desired)
            // or update program_state.camera_inverse to 'desired'
            //program_state.set_camera(this.attached());

            // slight mod: smooth out camera trans
            // blend 'desired' with the current camera matrix
            // desired.map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, blending_factor))
            program_state.set_camera(this.attached().map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.1)));
        }
    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        // for G shading, interpolation is done via color
        // vec 4 because shape_color is vec4
        varying vec4 color_interpolation;
        
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                
                // to do G shading, make sure the color calc happens in the vertex shader (Phong waits till fragment)
                color_interpolation = vec4( shape_color.xyz * ambient, shape_color.w ); // taken from fragment shader
                color_interpolation.xyz += phong_model_lights( normalize( N ), vertex_worldspace ); // also taken from fragment shader
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                // can assign to values calculated in vertex shader now with G shading
                //gl_FragColor = vec4( shape_color.xyz * ambient, shape_color.w );
                gl_FragColor = color_interpolation;
                // Compute the final color with contributions from lights:
                //gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
                return;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            point_position = model_transform* vec4(position, 1); // vec4(origin (position), 1) to convert pos to vec4
            center = model_transform* vec4(0, 0, 0, 1);
      
            gl_Position = projection_camera_model_transform* vec4(position, 1); 
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
            // percent opacities of red green blue
            // sign function to make 6.2 ish rings
            gl_FragColor = vec4(0.6902, 0.5020, 0.2510, 1.0) * sin(20.0 * distance(point_position.xyz, center.xyz));
        }`;
    }
}

