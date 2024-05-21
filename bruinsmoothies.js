import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Ingredient {
    constructor(x_pos, y_pos, x_spd, y_spd, rad, shp, mat) {
        this.center = vec3(x_pos, y_pos, 0);
        this.direction = vec3(x_spd, y_spd, 0);
        this.radius = rad;
        this.shape = shp;
        this.material = mat;
    }
}

class Watermelon extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.2, color: hex_color("#5ab669")});
      const shp = new defs.Subdivision_Sphere(4);
      super(x_pos, y_pos, x_spd, y_spd, 1, shp, mat);
  }
}

class Apple extends Ingredient {
  constructor(x_pos, y_pos, x_spd, y_spd) {
      const mat = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.2, color: hex_color("#cc2525")});
      const shp = new defs.Subdivision_Sphere(4);
      super(x_pos, y_pos, x_spd, y_spd, 0.5, shp, mat);
  }
}

// other fruit shapes? berry banana orange etc
// sprite images somehow?? textures? (assn 4?)
// if we do bananas, we could make them rotate/spin too for fun?

export class BruinSmoothies extends Scene {
    constructor() {
        super();

        // make it frame the game better if possible
        this.initial_camera_location = Mat4.look_at(vec3(0, 0, 25), vec3(0, 0, 0), vec3(0, 1, 0));
        this.width = 30;
        this.height = 20;

        this.valid_ingredients = ["Watermelon", "Apple"];
        this.ingredient_mapping = {
          "Watermelon": Watermelon,
          "Apple": Apple
        };

        [this.recipe, this.ingredients] = this.setup_level();
    }

    random_number(min=0, max=1, int=false) { // inclusive, int for integers only
      let num = Math.random() * (max-min) + min;
      num = int ? Math.round(num) : num;
      return num; 
    }

    setup_level() {
      const total_ingr_count = 10;
      const ingredient_list = [];
      const recipe = {}; // pick from set options?
        // bad/special types like bomb if we have time?
      // generate ingredients to make recipe
      const recipe_ingr_count = 0; // get from recipe size
      const other_ingr_count = total_ingr_count - recipe_ingr_count;
      for (let i = 0; i < other_ingr_count; i++) { // generate random other ingredients
        const ingredient_type = this.valid_ingredients[this.random_number(0, this.valid_ingredients.length-1, true)];
        const init_x = this.random_number(-this.width/2, this.width/2);
        const init_y = this.random_number(-this.height/2, this.height/2);
        const init_x_spd = this.random_number(-0.05, 0.05);
        const init_y_spd = this.random_number(-0.05, 0.05);
        ingredient_list.push(new this.ingredient_mapping[ingredient_type](init_x, init_y, init_x_spd, init_y_spd));
      }
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
        // do we need this? maybe for show/hide recipe
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
            ingredient.shape.draw(context, program_state, shape_mtx, ingredient.material);
            ingredient.center[0] = new_x;
            ingredient.center[1] = new_y;
        }

        // check for collisions with each other --> update direction vector

        // check for mouse picking --> handle by removing from array? and from recipe if correct? and affect score
    }
}