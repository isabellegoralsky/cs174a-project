import {tiny} from '../tiny-graphics.js';
const {
  Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

export const custom_shaders = {};

const WatermelonShader = custom_shaders.WatermelonShader = class WatermelonShader extends Shader {
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
        varying vec2 v_texture_coord;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
        attribute vec3 position;
        attribute vec2 texture_coord;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            point_position = model_transform* vec4(position, 1); // vec4(origin (position), 1) to convert pos to vec4
            center = model_transform* vec4(0, 0, 0, 1);
            v_texture_coord = texture_coord;
      
            gl_Position = projection_camera_model_transform* vec4(position, 1); 
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO possibly change green shades
        return this.shared_glsl_code() + `
        void main(){
            // percent opacities of red green blue
            vec4 light_green = vec4(0.2980, 0.6863, 0.3137, 1.0);  // #4CAF50
            vec4 dark_green = vec4(0.1804, 0.4902, 0.1961, 1.0);   // #2E7D32
            
            float stripe = sin(55.0 * v_texture_coord.x);  // Adjust frequency as needed
            vec4 color = mix(light_green, dark_green, step(0.0, stripe));
            
            gl_FragColor = color;
        }`;
    }
}
