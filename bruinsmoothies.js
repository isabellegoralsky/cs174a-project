import {defs, tiny} from './examples/common.js';
import {custom_shapes} from './assets/shapes.js';
import {custom_shaders} from './assets/shaders.js';
import {custom_scenes} from './assets/scenes.js';
import {Text_Line} from './examples/text-demo.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Textured_Phong} = defs

const WATERMELON_SHAPE_1 = new defs.Subdivision_Sphere(4);
const WATERMELON_MATERIAL_1 = new Material(new Textured_Phong(), {
    color: hex_color("#000000"),
    ambient: 1, diffusivity: 0.1, specularity: 0.3,
    texture: new Texture("assets/textures/watermelon.png", "NEAREST")
});
const APPLE_SHAPE_1 = new custom_shapes.AppleShape();
const APPLE_SHAPE_2 = new defs.Triangle();
const APPLE_SHAPE_3 = new defs.Square();
const APPLE_MATERIAL_1 = new Material(new Textured_Phong(), {
    color: hex_color("#000000"),
    ambient: 1, diffusivity: 0.1, specularity: 0.4,
    texture: new Texture("assets/textures/apple.jpg", "NEAREST")
});
const APPLE_MATERIAL_2 = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.1, color: hex_color("#1F9A0E")});
const APPLE_MATERIAL_3 = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0, color: hex_color("#594A4B")});
const ORANGE_SHAPE_1 = new defs.Subdivision_Sphere(4);
const ORANGE_SHAPE_2 = new defs.Triangle();
const ORANGE_MATERIAL_1 = new Material(new Textured_Phong(), {
    color: hex_color("#000000"),
    ambient: 1, diffusivity: 0.1, specularity: 0.2,
    texture: new Texture("assets/textures/orange.jpg", "NEAREST")
});
const ORANGE_MATERIAL_2 = new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 0.2, specularity: 0.1, color: hex_color("#1F9A0E")});
const BANANA_SHAPE_1 = new custom_shapes.BananaShape();
const BANANA_MATERIAL_1 = new Material(new Textured_Phong(), {
    color: hex_color("#000000"),
    ambient: 1, diffusivity: 0.1, specularity: 0.2,
    texture: new Texture("assets/textures/banana.jpg", "NEAREST")
});
const BLUEBERRY_SHAPE_1 = new defs.Subdivision_Sphere(4);
const BLUEBERRY_MATERIAL_1 = new Material(new Textured_Phong(), {
    color: hex_color("#000000"),
    ambient: 1, diffusivity: 0.1, specularity: 0.2,
    texture: new Texture("assets/textures/blueb.png", "NEAREST")
});

class Ingredient {
    constructor(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd, rad, mas,
                shp, mat, shp2=null, mat2=null, shp3=null, mat3=null) {
        this.center = vec3(x_pos, y_pos, z_pos);
        this.direction = vec3(x_spd, y_spd, z_spd);
        this.radius = rad;
        this.mass = mas;
        this.shape = shp;
        this.material = mat;
        this.shape2 = shp2;
        this.material2 = mat2;
        this.shape3 = shp3;
        this.material3 = mat3;
    }
}

class Watermelon extends Ingredient {
    constructor(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd) {
        const shp = WATERMELON_SHAPE_1;
        const mat = WATERMELON_MATERIAL_1;

        // const shp2 = WATERMELON_SHAPE_2;
        // const mat2 = WATERMELON_MATERIAL_2;
        //
        // const shp3 = WATERMELON_SHAPE_3;
        // const mat3 = WATERMELON_MATERIAL_3;

        super(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd, 1.3, 3, shp, mat);
    }
}

class Apple extends Ingredient {
    constructor(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd) {
        const shp = APPLE_SHAPE_1;
        const mat = APPLE_MATERIAL_1;

        // leaf
        const shp2 = APPLE_SHAPE_2;
        const mat2 = APPLE_MATERIAL_2;

        // stem
        const shp3 = APPLE_SHAPE_3;
        const mat3 = APPLE_MATERIAL_3;

        super(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd, .75, 1, shp, mat, shp2, mat2, shp3, mat3);
    }
}

class Orange extends Ingredient {
    constructor(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd) {
        const shp = ORANGE_SHAPE_1;
        const mat = ORANGE_MATERIAL_1;

        // leaf
        const shp2 = ORANGE_SHAPE_2;
        const mat2 = ORANGE_MATERIAL_2;

        super(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd, .75, 1.5, shp, mat, shp2, mat2);
    }
}

// Banana looks a little weird in 3D, need to move camera angle, so it looks normal
class Banana extends Ingredient {
    constructor(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd) {
        const shp = BANANA_SHAPE_1;
        const mat = BANANA_MATERIAL_1;

        super(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd, 0.6, 2, shp, mat);

        this.rotation = 0;
    }

    draw(context, program_state, model_transform) {
        // Draw the banana with rotation
        let shape_mtx = model_transform
            .times(Mat4.translation(this.center[0], this.center[1], this.center[2]))
            .times(Mat4.rotation(this.rotation, 1, 0, 0))
            .times(Mat4.scale(this.radius, this.radius, this.radius));
        this.shape.draw(context, program_state, shape_mtx, this.material);
    }
}

class Blueberry extends Ingredient {
  constructor(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd) {
      const shp = BLUEBERRY_SHAPE_1;
      const mat = BLUEBERRY_MATERIAL_1;

      super(x_pos, y_pos, z_pos, x_spd, y_spd, z_spd, .5, .5, shp, mat);
  }
}

export class BruinSmoothies extends Scene {
    constructor() {
        super();

        this.initial_camera_location = Mat4.look_at(vec3(0, 60, 30), vec3(0, 0, 0), vec3(0, 1, 0));
        this.width = 30;
        this.height = 15;
        this.depth = 30;

        this.border_shape = new custom_shapes.BoxShape();
        this.border_material = new Material(new Textured_Phong(), {
            color: hex_color("#373737"),
            ambient: .6, diffusivity: 0.1, specularity: 0.1,
            texture: new Texture("assets/textures/basket.jpg", "NEAREST")
        });

        this.floor_shape = new defs.Square();
        this.floor_material = new Material(new Textured_Phong(), {
            color: hex_color("#000000"),
            ambient: 1, diffusivity: 0.1, specularity: 0.1,
            texture: new Texture("assets/textures/grass.jpg", "NEAREST")
        });

        this.ingredient_mapping = {
            "Watermelon": Watermelon,
            "Apple": Apple,
            "Orange": Orange,
            "Banana": Banana,
            "Blueberry": Blueberry
        };
        this.recipes = {
            "Tropical Delight": ["Banana", "Orange", "Apple"],
            "Watermelon Blast": ["Watermelon", "Apple", "Orange"],
            "Berry Blast":      ["Blueberry", "Blueberry", "Blueberry"]
        };
        
        this.restart_level();

        document.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this.pickIngredient(e.offsetX, e.offsetY);
        });

        this.context = this.program_state = null;

        this.text_material = new Material(new Textured_Phong(), {
            ambient: 1, diffusivity: 0, specularity: 0,
            texture: new Texture("assets/textures/text.png"),
            color: hex_color("#283cc8"),
        });

        this.recipe_text = new Text_Line(50);
        this.score_text = new Text_Line(15);
    }

    random_number(min=0, max=1) {
        let num = Math.random() * (max - min) + min;
        return num;
    }

    // avoids ingredients spawning at the same location
    generate_valid_position(existing_ingredients, margin=2) {
        let is_valid_position = false;
        let x, y, z;

        while (!is_valid_position) {
            is_valid_position = true;
            x = this.random_number(-this.width / 2 + margin, this.width / 2 - margin);
            y = this.random_number(-this.height / 2 + margin, this.height / 2 - margin);
            z = this.random_number(-this.depth / 2 + margin, this.depth / 2 - margin);

            for (let ingr of existing_ingredients) {
                const distance = Math.sqrt(
                    Math.pow(x - ingr.center[0], 2) +
                    Math.pow(y - ingr.center[1], 2) +
                    Math.pow(z - ingr.center[2], 2)
                );
                if (distance < 2*margin) {
                    is_valid_position = false;
                    break;
                }
            }
        }

        return [x, y, z];
    }

    generate_ingredient(ingredient_list, ingredient_type) {
        const [init_x, init_y, init_z] = this.generate_valid_position(ingredient_list);
        const init_x_spd = this.random_number(-0.05, 0.05);
        const init_y_spd = this.random_number(-0.05, 0.05);
        const init_z_spd = this.random_number(-0.05, 0.05);
        return new ingredient_type(init_x, init_y, init_z, init_x_spd, init_y_spd, init_z_spd);
    }

    restart_level() {
        const total_ingr_count = 15;
        const ingredient_list = [];
        const ingredient_names = Object.keys(this.ingredient_mapping);

        const recipe_names = Object.keys(this.recipes);
        const random_recipe_name = recipe_names[Math.floor(Math.random() * recipe_names.length)];
        const recipe = this.recipes[random_recipe_name];
        const recipe_ingr_count = recipe.length;
        const other_ingr_count = total_ingr_count - recipe_ingr_count;

        for (let ingredient of recipe) {
            const ingredient_type = this.ingredient_mapping[ingredient];
            ingredient_list.push(this.generate_ingredient(ingredient_list, ingredient_type));
        }

        for (let i = 0; i < other_ingr_count; i++) {
            const random_ingredient_name = ingredient_names[Math.floor(Math.random() * ingredient_names.length)];
            const ingredient_type = this.ingredient_mapping[random_ingredient_name];
            ingredient_list.push(this.generate_ingredient(ingredient_list, ingredient_type));
        }

        this.recipe_name = random_recipe_name; // name of smoothie
        this.current_ingredients = [...recipe]; // list of string names of ingredients
        this.ingredients = ingredient_list; // list of ingredient objects
        this.score = 0;
    }

    draw_border(context, program_state) {
        const model_transform = Mat4.identity();
        this.border_shape.draw(context, program_state, model_transform, this.border_material);
    }

    draw_floor(context, program_state) {
        const floor_transform = Mat4.identity()
            .times(Mat4.translation(0, -this.height / 2 - 0.4, 0))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
            .times(Mat4.scale(this.width*1.5, this.depth*1.5, 1));
        this.floor_shape.draw(context, program_state, floor_transform, this.floor_material);
    }

    draw_text(context, program_state) {
      this.recipe_text.set_string(`Recipe: ${this.recipe_name}`, context.context);
      let recipe_transform = Mat4.identity()
          .times(Mat4.translation(-this.width*1.5 + 2.5, -this.height / 2 - 0.3, -this.depth*1.5 + 2.5))
          .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0));
      this.recipe_text.draw(context, program_state, recipe_transform, this.text_material);

      let ingredient_transform = recipe_transform
          .times(Mat4.translation(0, -5, 0));
      for (let ingredient of this.current_ingredients) {
          this.recipe_text.set_string(ingredient, context.context);
          this.recipe_text.draw(context, program_state, ingredient_transform, this.text_material);
          ingredient_transform = ingredient_transform.times(Mat4.translation(0, -2.5, 0));
      }

      this.score_text.set_string(`Score: ${this.score}`, context.context);
      let score_transform = Mat4.identity()
          .times(Mat4.translation(this.width*1.5 - 20, -this.height / 2 - 0.3, -this.depth*1.5 + 2.5))
          .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
          .times(Mat4.scale(1.3, 1, 1.3));
      this.score_text.draw(context, program_state, score_transform, this.text_material);
    }

    check_wall_collision(ingredient) {
        const half_width = this.width / 2;
        const half_height = this.height / 2;
        const half_depth = this.depth / 2;

        if (ingredient.center[0] - ingredient.radius <= -half_width || ingredient.center[0] + ingredient.radius >= half_width) {
            ingredient.direction[0] *= -1;
        }

        if (ingredient.center[1] - ingredient.radius <= -half_height || ingredient.center[1] + ingredient.radius >= half_height) {
            ingredient.direction[1] *= -1;
        }

        if (ingredient.center[2] - ingredient.radius <= -half_depth || ingredient.center[2] + ingredient.radius >= half_depth) {
            ingredient.direction[2] *= -1;
        }
    }

    check_ingredient_collision(ingredient1, ingredient2) {
        const x_dist = ingredient1.center[0] - ingredient2.center[0];
        const y_dist = ingredient1.center[1] - ingredient2.center[1];
        const z_dist = ingredient1.center[2] - ingredient2.center[2];
        const dist = Math.sqrt(x_dist * x_dist + y_dist * y_dist + z_dist * z_dist);

        if (dist < ingredient1.radius + ingredient2.radius) {

            this.play_sound('sounds/ding.mp3');

            const normalX = x_dist / dist;
            const normalY = y_dist / dist;
            const normalZ = z_dist / dist;

            const relVelX = ingredient2.direction[0] - ingredient1.direction[0];
            const relVelY = ingredient2.direction[1] - ingredient1.direction[1];
            const relVelZ = ingredient2.direction[2] - ingredient1.direction[2];

            const velAlongNormal = relVelX * normalX + relVelY * normalY + relVelZ * normalZ;

            const totalMass = ingredient1.mass + ingredient2.mass;
            const impulseMag = (2 * velAlongNormal) / totalMass;
            const impulseX = impulseMag * normalX;
            const impulseY = impulseMag * normalY;
            const impulseZ = impulseMag * normalZ;

            ingredient1.direction[0] += impulseX * ingredient2.mass;
            ingredient1.direction[1] += impulseY * ingredient2.mass;
            ingredient1.direction[2] += impulseZ * ingredient2.mass;
            ingredient2.direction[0] -= impulseX * ingredient1.mass;
            ingredient2.direction[1] -= impulseY * ingredient1.mass;
            ingredient2.direction[2] -= impulseZ * ingredient1.mass;
        }
    }

    make_control_panel() {
        this.key_triggered_button("Put stuff here", ["Control", "0"], () => console.log('test'));
        this.new_line();
        this.key_triggered_button("Score!?", ["Control", "0"], () => console.log('test'));
        this.new_line();
    }

    calculate_mouse_ray(mouse_x, mouse_y) {
        // source: https://antongerdelan.net/opengl/raycasting.html
        const ndc_x = 2 * mouse_x / this.context.width - 1;
        const ndc_y = 1 - 2 * mouse_y / this.context.height;
        const clip_ray = vec4(ndc_x, ndc_y, -1, 1);

        const inv_proj_matrix = Mat4.inverse(this.program_state.projection_transform);
        const eye_ray_homogeneous = inv_proj_matrix.times(clip_ray);
        const eye_ray = vec4(eye_ray_homogeneous[0], eye_ray_homogeneous[1], -1.0, 0.0);

        // keep in eye space for easier intersection calculations
        return eye_ray
    }

    raySphereIntersection(ray, ingredient) {
        const radius = ingredient.radius;
        const center =
            this.program_state.camera_inverse.times(
              vec4(ingredient.center[0], ingredient.center[1], ingredient.center[2], 1)
            )
        .to3();

        const a = ray.dot(ray);
        const b = 2 * center.dot(ray);
        const c = center.dot(center) - radius * radius;
        const discriminant = b * b - 4 * a * c;

        return (discriminant >= 0);
    }

    pickIngredient(mouse_x, mouse_y) {
        const ray = this.calculate_mouse_ray(mouse_x, mouse_y);
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.raySphereIntersection(ray, this.ingredients[i])) {
                const ingredient_name = this.ingredients[i].constructor.name;
                const index = this.current_ingredients.indexOf(ingredient_name);
                if (index !== -1) {
                    this.score += 100;
                    this.current_ingredients.splice(index, 1);
                } else {
                    this.score -= 100;
                }
                this.ingredients.splice(i, 1);
                this.play_sound('sounds/juicy-splash.mp3');
                break;
            }
        }
    }

    play_sound(path) {
        const audio = new Audio(path);
        audio.play();
    }

    display(context, program_state) {
        this.context = context;
        this.program_state = program_state;

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, .1, 1000);
        program_state.lights = [new Light(vec4(0, 0, 1000, 1), color(1, 1, 1, 1), 10000000)];

        this.draw_border(context, program_state);
        this.draw_floor(context, program_state);
        this.draw_text(context, program_state);

        for (let i = 0; i < this.ingredients.length; i++) {
            this.check_wall_collision(this.ingredients[i]);
            for (let j = i + 1; j < this.ingredients.length; j++) {
                this.check_ingredient_collision(this.ingredients[i], this.ingredients[j]);
            }
        }

        const model_transform = Mat4.identity();

        for (let ingredient of this.ingredients) {
            let shape_mtx = model_transform;
            let new_x = ingredient.center[0] + ingredient.direction[0];
            let new_y = ingredient.center[1] + ingredient.direction[1];
            let new_z = ingredient.center[2] + ingredient.direction[2];
            shape_mtx = shape_mtx
                .times(Mat4.translation(new_x, new_y, new_z))
                .times(Mat4.scale(ingredient.radius, ingredient.radius, ingredient.radius));

            if (ingredient instanceof Watermelon) {
                shape_mtx = shape_mtx
                    .times(Mat4.scale(2.6, 2.6, 3.2))
                    .times(Mat4.rotation(3*Math.PI/4, 1, 0, 0));
            }else if (ingredient instanceof Orange) {
                // orange
                shape_mtx = shape_mtx.times(Mat4.scale(2.7, 2.7, 2.7));
            }else if (ingredient instanceof Banana){
                shape_mtx = shape_mtx.times(Mat4.scale(2, 1, 1));
            }

            let shape_mtx_non_rotate = shape_mtx;
            if (ingredient instanceof Apple) {
                shape_mtx = shape_mtx
                    .times(Mat4.scale(3.2, 2.875, 3.2))
                    .times(Mat4.rotation(Math.PI / 2, 0, 1, 0));
            }


            ingredient.shape.draw(context, program_state, shape_mtx, ingredient.material);

            if (ingredient.shape2 !== null) {
                // below line proves Orange enters here
                // ingredient.shape.draw(context, program_state, shape_mtx.times(Mat4.scale(3,3,3)), ingredient.material);
                let leaf_transform = shape_mtx_non_rotate;
                let leaf_offset = Mat4.identity();
                if (ingredient instanceof Apple) {
                    leaf_offset = Mat4.translation(0, 1.5, 0).times(Mat4.rotation(Math.PI / 2, 0, 0, 1));
                    leaf_transform = leaf_transform.times(leaf_offset).times(Mat4.scale(.8, .8, .8));
                } else if (ingredient instanceof Orange) {
                    // orange leaf
                    leaf_offset = Mat4.translation(0, 0.5, 0).times(Mat4.rotation(Math.PI / 3, 0, 0, 1)).times(Mat4.rotation(Math.PI / 3, 0, 1, 0));
                    leaf_transform = leaf_transform.times(leaf_offset).times(Mat4.scale(1.2, .5, 1.8));
                } else {
                    leaf_transform = leaf_transform.times(Mat4.scale(.9, .9, 1)).times(Mat4.translation(0, 0, .0001));
                }

                ingredient.shape2.draw(context, program_state, leaf_transform, ingredient.material2);
            }

            if (ingredient.shape3 !== null) {
                let shp3_transform = shape_mtx_non_rotate;
                if (ingredient instanceof Apple) {
                    // apple stem
                    shp3_transform = shp3_transform.times(Mat4.translation(-.5, 2, 0)).times(Mat4.scale(.1, 1, .8));
                    ingredient.shape3.draw(context, program_state, shp3_transform, ingredient.material3);
                } else {
                    // watermelon seeds
                    //top 3
                    shp3_transform = shp3_transform.times(Mat4.scale(.04, .065, 1)).times(Mat4.translation(0, 0, .0002));
                    ingredient.shape3.draw(context, program_state, shp3_transform.times(Mat4.translation(-5, 5, 0)), ingredient.material3);
                    ingredient.shape3.draw(context, program_state, shp3_transform.times(Mat4.translation(5, 5, 0)), ingredient.material3);
                    ingredient.shape3.draw(context, program_state, shp3_transform.times(Mat4.translation(0, 6, 0)), ingredient.material3);

                    // bottom 4
                    ingredient.shape3.draw(context, program_state, shp3_transform.times(Mat4.translation(-9, 8, 0)), ingredient.material3);
                    ingredient.shape3.draw(context, program_state, shp3_transform.times(Mat4.translation(9, 8, 0)), ingredient.material3);
                    ingredient.shape3.draw(context, program_state, shp3_transform.times(Mat4.translation(-3, 9.5, 0)), ingredient.material3);
                    ingredient.shape3.draw(context, program_state, shp3_transform.times(Mat4.translation(3, 9.5, 0)), ingredient.material3);
                }
            }

            ingredient.center[0] = new_x;
            ingredient.center[1] = new_y;
            ingredient.center[2] = new_z;
        }

        if (this.current_ingredients.length === 0) {
            this.restart_level();
        }
    }
}
