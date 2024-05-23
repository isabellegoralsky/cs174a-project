import {tiny} from '../tiny-graphics.js';
const {
  Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene
} = tiny;

export const custom_scenes = {};

const MouseControls = custom_scenes.MouseControls = class MouseControls extends Scene {
  // detecting mouse clicks
  // check if the mouse ray intersects with any ingredient
  constructor(bruin_smoothies) {
      super();
      this.bruin_smoothies = bruin_smoothies;
      this.mouse_enabled_canvases = new Set();
  }

  add_mouse_controls(canvas) {
      const mouse_position = (e, rect = canvas.getBoundingClientRect()) =>
          vec(e.clientX - (rect.left + rect.right) / 2, e.clientY - (rect.bottom + rect.top) / 2);

      canvas.addEventListener("mousedown", e => {
          e.preventDefault();
          this.handle_click(e, canvas);
      });
  }

  handle_click(event, canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const world_space = vec3(
          (x / rect.width) * this.bruin_smoothies.width - this.bruin_smoothies.width / 2,
          this.bruin_smoothies.height / 2 - (y / rect.height) * this.bruin_smoothies.height,
          0
      );

      this.bruin_smoothies.check_ingredient_click(world_space);
  }

  display(context, graphics_state) {
      if (!this.mouse_enabled_canvases.has(context.canvas)) {
          this.add_mouse_controls(context.canvas);
          this.mouse_enabled_canvases.add(context.canvas);
      }
  }
}
