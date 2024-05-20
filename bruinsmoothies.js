import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Ingredient {
    constructor(x_pos, y_pos, rad, x_spd, y_spd) {
        this.center = vec3(x_pos, y_pos, 0);
        this.radius = rad;
        this.direction = vec3(x_spd, y_spd, 0);
    }
}

export class Assignment3 extends Scene {
    constructor() {
        super();

        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4)
        };

        this.materials = {
            shiny: new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("#23bb82")})
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

        this.ingredients = [new Ingredient(4, 0, 3, -0.2, 0.2)];
    }

    make_control_panel() {
        this.key_triggered_button("Put stuff here", ["Control", "0"], () => console.log('test'));
        this.new_line();
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);
        }
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        program_state.lights = [new Light(vec4(0, 0, 1000, 1), color(1, 1, 1, 1), 100)];
        const model_transform = Mat4.identity();

        for (let ingredient of this.ingredients) {
            let shape_mtx = model_transform;
            shape_mtx = shape_mtx
                .times(Mat4.translation(ingredient.center[0]+ingredient.direction[0]*t,
                    ingredient.center[1]+ingredient.direction[1]*t,
                    ingredient.center[2]+ingredient.direction[2]*t))
                .times(Mat4.scale(ingredient.radius, ingredient.radius, ingredient.radius));
            this.shapes.sphere.draw(context, program_state, shape_mtx, this.materials.shiny);
        }
    }
}