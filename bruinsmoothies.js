import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Ingredient {
    // can prob do this better
    constructor(x_pos, y_pos, rad, x_spd, y_spd) {
        this.center = vec3(x_pos, y_pos, 0);
        this.radius = rad;
        this.direction = vec3(x_spd, y_spd, 0);
    }
}

export class BruinSmoothies extends Scene {
    constructor() {
        super();

        this.shapes = {
            sphere: new defs.Subdivision_Sphere(4),
            // add other fruit shapes? banana etc?
        };

        this.materials = {
            shiny: new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("#23bb82")})
            // add fruit materials for diff shinyness, etc
        }

        // make it frame the game better if possible
        this.initial_camera_location = Mat4.look_at(vec3(0, 0, 25), vec3(0, 0, 0), vec3(0, 1, 0));
        this.width = 30;
        this.height = 20;

        [this.recipe, this.ingredients] = this.setup_level();
    }

    setup_level() {
      const recipe = {}; // pick from set options?
      // create necessary ingredients for the recipe, plus a few extras, plus lots of incorrect ingredients
        // randomly generated
      const ingredient_list = [new Ingredient(4, 0, 3, -0.02, 0.02), new Ingredient(-2, 6, 1, 0.02, -0.04), new Ingredient(14, 9, 1, 0, 0)];
      return [recipe, ingredient_list];
    }

    check_wall_collision(ingredient) {
      const half_width = this.width / 2;
      const half_height = this.height / 2;

      if (ingredient.center[0]-ingredient.radius <= -half_width || ingredient.center[0]+ingredient.radius >= half_width) {
          ingredient.direction[0] *= -1; // could easily speed up with > |1| if desired
      }

      if (ingredient.center[1]-ingredient.radius <= -half_height || ingredient.center[1]+ingredient.radius >= half_height) {
          ingredient.direction[1] *= -1;
      }
    }

    make_control_panel() {
        // do we need this?
        this.key_triggered_button("Put stuff here", ["Control", "0"], () => console.log('test'));
        this.new_line();
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);
        }
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, .1, 1000);
        // const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        program_state.lights = [new Light(vec4(0, 0, 1000, 1), color(1, 1, 1, 1), 10000000)];
        const model_transform = Mat4.identity();

        // draw actual border? or frame game better so stuff hits the wall rather than a random space

        // draw each ingredient
        for (let ingredient of this.ingredients) {
            this.check_wall_collision(ingredient);
            let shape_mtx = model_transform;
            let new_x = ingredient.center[0]+ingredient.direction[0];
            let new_y = ingredient.center[1]+ingredient.direction[1];
            // not using z?
            // things look a little skewed in the corners, maybe move the camera back? might get fixed by framing game fully?
            shape_mtx = shape_mtx
                .times(Mat4.translation(new_x, new_y, 0))
                .times(Mat4.scale(ingredient.radius, ingredient.radius, ingredient.radius));
            this.shapes.sphere.draw(context, program_state, shape_mtx, this.materials.shiny);
            ingredient.center[0] = new_x;
            ingredient.center[1] = new_y;
        }

        // check for collisions with each other --> update direction vector

        // check for mouse picking --> handle by removing from array? and from recipe if correct? and affect score
    }
}