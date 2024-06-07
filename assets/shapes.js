import {tiny} from '../tiny-graphics.js';
import {defs} from '../examples/common.js';
const {
  Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene
} = tiny;

export const custom_shapes = {};

const HalfRaspberry = custom_shapes.HalfRaspberry = class HalfRaspberry extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");

        const numSegments = 20; // Number of segments for smoothness
        const radius = 0.4; // Radius of the raspberry
        const height = 0.8; // Height of the raspberry

        for (let i = 0; i <= numSegments; i++) {
            const theta = i * Math.PI / numSegments; // Angle for height segments

            for (let j = 0; j <= numSegments; j++) {
                const phi = j * 2 * Math.PI / numSegments; // Angle for circular segments

                // Calculate the x, y, z positions of the vertices
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = height * (Math.cos(theta) - 0.5); // Adjusted to look more like a raspberry
                const z = radius * Math.sin(theta) * Math.sin(phi);

                // Push the position
                this.arrays.position.push(vec3(x, y, z));

                // Calculate and push the normal
                const normal = vec3(x, y, z).normalized();
                this.arrays.normal.push(normal);

                // Push the texture coordinate
                this.arrays.texture_coord.push(vec(j / numSegments, i / numSegments));
            }
        }

        // Create the indices for the raspberry shape
        for (let i = 0; i < numSegments; i++) {
            for (let j = 0; j < numSegments; j++) {
                const first = i * (numSegments + 1) + j;
                const second = first + numSegments + 1;

                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }
    }
}

const RaspberryShape = custom_shapes.RaspberryShape = class RaspberryShape extends Shape {
    constructor(off) {
        super("position", "normal", "texture_coord");

        const halfRaspberry1 = new custom_shapes.HalfRaspberry();
        const halfRaspberry2 = new custom_shapes.HalfRaspberry();
        const halfRaspberry3 = new custom_shapes.HalfRaspberry();

        // Offset the second half to form the complete raspberry
        const offset = Mat4.translation(off, 0, 0);

        const halfRaspberry7 = new custom_shapes.HalfRaspberry();
        const halfRaspberry8 = new custom_shapes.HalfRaspberry();

        // Merge the first half raspberry vertices
        this.arrays.position.push(...halfRaspberry1.arrays.position);
        this.arrays.normal.push(...halfRaspberry1.arrays.normal);
        this.arrays.texture_coord.push(...halfRaspberry1.arrays.texture_coord);

        // Merge the second half raspberry vertices
        for (let i = 0; i < halfRaspberry2.arrays.position.length; i++) {
            const pos = halfRaspberry2.arrays.position[i];
            const transformedPos = offset.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfRaspberry2.arrays.normal[i]);
            this.arrays.texture_coord.push(halfRaspberry2.arrays.texture_coord[i]);
        }

        const offset3 = Mat4.translation(-1 * off, 0, 0);
        for (let i = 0; i < halfRaspberry3.arrays.position.length; i++) {
            const pos = halfRaspberry3.arrays.position[i];
            const transformedPos = offset3.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfRaspberry3.arrays.normal[i]);
            this.arrays.texture_coord.push(halfRaspberry3.arrays.texture_coord[i]);
        }

        const halfRaspberry4 = new custom_shapes.HalfRaspberry();
        const offset2 = Mat4.translation(off-1.2, -2*off, 0);

        for (let i = 0; i < halfRaspberry4.arrays.position.length; i++) {
            const pos = halfRaspberry4.arrays.position[i];
            const transformedPos = offset2.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfRaspberry4.arrays.normal[i]);
            this.arrays.texture_coord.push(halfRaspberry4.arrays.texture_coord[i]);
        }

        const halfRaspberry5 = new custom_shapes.HalfRaspberry();
        const offset4 = Mat4.translation(off-.35, -2*off, 0);
        for (let i = 0; i < halfRaspberry5.arrays.position.length; i++) {
            const pos = halfRaspberry5.arrays.position[i];
            const transformedPos = offset4.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfRaspberry5.arrays.normal[i]);
            this.arrays.texture_coord.push(halfRaspberry5.arrays.texture_coord[i]);
        }

        const halfRaspberry6 = new custom_shapes.HalfRaspberry();
        const offset5 = Mat4.translation(off-.75, -3.2*off, 0);
        for (let i = 0; i < halfRaspberry6.arrays.position.length; i++) {
            const pos = halfRaspberry6.arrays.position[i];
            const transformedPos = offset5.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfRaspberry6.arrays.normal[i]);
            this.arrays.texture_coord.push(halfRaspberry6.arrays.texture_coord[i]);
        }

        const offset7 = Mat4.translation(off-1, 0, -.5);
        for (let i = 0; i < halfRaspberry7.arrays.position.length; i++) {
            const pos = halfRaspberry7.arrays.position[i];
            const transformedPos = offset7.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfRaspberry7.arrays.normal[i]);
            this.arrays.texture_coord.push(halfRaspberry7.arrays.texture_coord[i]);
        }

        const offset8 = Mat4.translation(.5, 0, -.5);
        for (let i = 0; i < halfRaspberry8.arrays.position.length; i++) {
            const pos = halfRaspberry8.arrays.position[i];
            const transformedPos = offset8.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfRaspberry8.arrays.normal[i]);
            this.arrays.texture_coord.push(halfRaspberry8.arrays.texture_coord[i]);
        }

        // Merge the indices
        let len = halfRaspberry1.arrays.position.length;
        this.indices.push(...halfRaspberry1.indices);
        for (let i = 0; i < halfRaspberry2.indices.length; i++) {
            this.indices.push(halfRaspberry2.indices[i] + len);
        }
        len = len + halfRaspberry2.arrays.position.length;
        for (let i = 0; i < halfRaspberry3.indices.length; i++) {
            this.indices.push(halfRaspberry3.indices[i] + len);
        }
        len = len + halfRaspberry3.arrays.position.length;
        for (let i = 0; i < halfRaspberry4.indices.length; i++) {
            this.indices.push(halfRaspberry4.indices[i] + len);
        }
        len = len + halfRaspberry4.arrays.position.length;
        for (let i = 0; i < halfRaspberry5.indices.length; i++) {
            this.indices.push(halfRaspberry5.indices[i] + len);
        }
        len = len + halfRaspberry5.arrays.position.length;
        for (let i = 0; i < halfRaspberry6.indices.length; i++) {
            this.indices.push(halfRaspberry6.indices[i] + len);
        }
        len = len + halfRaspberry6.arrays.position.length;
        for (let i = 0; i < halfRaspberry7.indices.length; i++) {
            this.indices.push(halfRaspberry7.indices[i] + len);
        }
        len = len + halfRaspberry7.arrays.position.length;
        for (let i = 0; i < halfRaspberry8.indices.length; i++) {
            this.indices.push(halfRaspberry8.indices[i] + len);
        }
    }
}


const StrawberryShape = custom_shapes.StrawberryShape = class StrawberryShape extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");

        const subdivisionSphere = new defs.Subdivision_Sphere(4);

        const scalingMatrix = Mat4.scale(1, 1.5, 1); // Scale to form a general strawberry shape

        // Apply transformations to vertices
        for (let i = 0; i < subdivisionSphere.arrays.position.length; i++) {
            const pos = subdivisionSphere.arrays.position[i];
            const transformedPos = scalingMatrix.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(pos.normalized()); // Normals need to be recalculated if scaling non-uniformly
            this.arrays.texture_coord.push(subdivisionSphere.arrays.texture_coord[i]);
        }

        // Copy the indices
        this.indices.push(...subdivisionSphere.indices);
    }
}

const HalfApple = custom_shapes.HalfApple = class HalfApple extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");

        const numSegments = 20; // Number of segments for smoothness
        const radius = 0.5; // Radius of the apple
        const height = 1.0; // Height of the apple

        for (let i = 0; i <= numSegments; i++) {
            const theta = i * Math.PI / numSegments; // Angle for height segments

            for (let j = 0; j <= numSegments; j++) {
                const phi = j * 2 * Math.PI / numSegments; // Angle for circular segments

                // Calculate the x, y, z positions of the vertices
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = height * (Math.cos(theta) - 0.5); // Adjusted to look more like an apple
                const z = radius * Math.sin(theta) * Math.sin(phi);

                // Push the position
                this.arrays.position.push(vec3(x, y, z));

                // Calculate and push the normal
                const normal = vec3(x, y, z).normalized();
                this.arrays.normal.push(normal);

                // Push the texture coordinate
                this.arrays.texture_coord.push(vec(j / numSegments, i / numSegments));
            }
        }

        // Create the indices for the apple shape
        for (let i = 0; i < numSegments; i++) {
            for (let j = 0; j < numSegments; j++) {
                const first = i * (numSegments + 1) + j;
                const second = first + numSegments + 1;

                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }
    }
}

const AppleShape = custom_shapes.AppleShape = class AppleShape extends Shape {
    constructor(off) {
        super("position", "normal", "texture_coord");

        const halfApple1 = new custom_shapes.HalfApple();
        const halfApple2 = new custom_shapes.HalfApple();

        // Offset the second half to form the complete apple
        const offset = Mat4.translation(0, 0, off);

        // Merge the first half apple vertices
        this.arrays.position.push(...halfApple1.arrays.position);
        this.arrays.normal.push(...halfApple1.arrays.normal);
        this.arrays.texture_coord.push(...halfApple1.arrays.texture_coord);

        // Merge the second half apple vertices
        for (let i = 0; i < halfApple2.arrays.position.length; i++) {
            const pos = halfApple2.arrays.position[i];
            const transformedPos = offset.times(pos.to4(1)).to3();
            this.arrays.position.push(transformedPos);
            this.arrays.normal.push(halfApple2.arrays.normal[i]);
            this.arrays.texture_coord.push(halfApple2.arrays.texture_coord[i]);
        }

        // Merge the indices
        const len = halfApple1.arrays.position.length;
        this.indices.push(...halfApple1.indices);
        for (let i = 0; i < halfApple2.indices.length; i++) {
            this.indices.push(halfApple2.indices[i] + len);
        }
    }
}

const BananaShape = custom_shapes.BananaShape = class BananaShape extends Shape {
    constructor() {
        super("position", "normal", "texture_coord");
        const segments = 100; // More segments for smoother curves
        const radius = 0.3; // Thickness of the banana
        const length = 8.0; // Length of the banana
        const curve_radius = 0.7; // Radius of the curve of the banana

        // Create the banana shape using cylindrical segments around the curve
        for (let i = 0; i <= segments; i++) {
            const angle = Math.PI / segments * i;
            const x = curve_radius * Math.sin(angle);
            const y = length / segments * i - length / 2;
            const z = curve_radius * Math.cos(angle) - curve_radius;

            // Create circular segments along the banana
            for (let j = 0; j <= segments; j++) {
                const theta = 2 * Math.PI / segments * j;
                const nx = radius * Math.cos(theta);
                const nz = radius * Math.sin(theta);
                this.arrays.position.push(vec3(x + nx, y, z + nz));
                this.arrays.normal.push(vec3(nx, 0, nz).normalized());
                this.arrays.texture_coord.push(vec(i / segments, j / segments));
            }
        }

        // Create indices for the triangular segments
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const first = i * (segments + 1) + j;
                const second = first + segments + 1;
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }

    }
}

const BorderShape = custom_shapes.BorderShape = class BorderShape extends Shape {
    constructor() {
        super("position", "color");
        const border_color = color(0.75, 0, 0.25, 1);
        const thickness = 0.2;
        const width = 36.8;
        const height = 20.3;
        this.arrays.position = [
            // Bottom border
            vec3(-width / 2 - thickness, -height / 2 - thickness, 0), vec3(width / 2 + thickness, -height / 2 - thickness, 0),
            vec3(width / 2 + thickness, -height / 2, 0), vec3(-width / 2 - thickness, -height / 2, 0),

            // Top border
            vec3(-width / 2 - thickness, height / 2, 0), vec3(width / 2 + thickness, height / 2, 0),
            vec3(width / 2 + thickness, height / 2 + thickness, 0), vec3(-width / 2 - thickness, height / 2 + thickness, 0),

            // Left border
            vec3(-width / 2 - thickness, -height / 2 - thickness, 0), vec3(-width / 2, -height / 2 - thickness, 0),
            vec3(-width / 2, height / 2 + thickness, 0), vec3(-width / 2 - thickness, height / 2 + thickness, 0),

            // Right border
            vec3(width / 2, -height / 2 - thickness, 0), vec3(width / 2 + thickness, -height / 2 - thickness, 0),
            vec3(width / 2 + thickness, height / 2 + thickness, 0), vec3(width / 2, height / 2 + thickness, 0),
        ];
        this.arrays.color = [
            border_color, border_color, border_color, border_color,
            border_color, border_color, border_color, border_color,
            border_color, border_color, border_color, border_color,
            border_color, border_color, border_color, border_color
        ];
        this.indices.push(0, 1, 2, 0, 2, 3); // Bottom border
        this.indices.push(4, 5, 6, 4, 6, 7); // Top border
        this.indices.push(8, 9, 10, 8, 10, 11); // Left border
        this.indices.push(12, 13, 14, 12, 14, 15); // Right border
    }
}

const BoxShape = custom_shapes.BoxShape = class BoxShape extends Shape {
    constructor() {
        super("position", "normal", "texture_coord", "color");

        const basket_color = color(0.54, 0.27, 0.07, 1);
        const width = 30;
        const height = 15;
        const depth = 30;
        const thickness = 0.2;

        this.arrays.position = [
            // Front face
            vec3(-width / 2 - thickness, -height / 2 - thickness, depth / 2), vec3(width / 2 + thickness, -height / 2 - thickness, depth / 2),
            vec3(width / 2 + thickness, height / 2 + thickness, depth / 2), vec3(-width / 2 - thickness, height / 2 + thickness, depth / 2),
            // Back face
            vec3(-width / 2 - thickness, -height / 2 - thickness, -depth / 2), vec3(width / 2 + thickness, -height / 2 - thickness, -depth / 2),
            vec3(width / 2 + thickness, height / 2 + thickness, -depth / 2), vec3(-width / 2 - thickness, height / 2 + thickness, -depth / 2),
            // Top face
            vec3(-width / 2 - thickness, height / 2 + thickness, -depth / 2), vec3(width / 2 + thickness, height / 2 + thickness, -depth / 2),
            vec3(width / 2 + thickness, height / 2 + thickness, depth / 2), vec3(-width / 2 - thickness, height / 2 + thickness, depth / 2),
            // Bottom face
            vec3(-width / 2 - thickness, -height / 2 - thickness, -depth / 2), vec3(width / 2 + thickness, -height / 2 - thickness, -depth / 2),
            vec3(width / 2 + thickness, -height / 2 - thickness, depth / 2), vec3(-width / 2 - thickness, -height / 2 - thickness, depth / 2),
            // Right face
            vec3(width / 2 + thickness, -height / 2 - thickness, -depth / 2), vec3(width / 2 + thickness, height / 2 + thickness, -depth / 2),
            vec3(width / 2 + thickness, height / 2 + thickness, depth / 2), vec3(width / 2 + thickness, -height / 2 - thickness, depth / 2),
            // Left face
            vec3(-width / 2 - thickness, -height / 2 - thickness, -depth / 2), vec3(-width / 2 - thickness, height / 2 + thickness, -depth / 2),
            vec3(-width / 2 - thickness, height / 2 + thickness, depth / 2), vec3(-width / 2 - thickness, -height / 2 - thickness, depth / 2),
        ];

        this.arrays.normal = [
            // Front face
            vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
            // Back face
            vec3(0, 0, -1), vec3(0, 0, -1), vec3(0, 0, -1), vec3(0, 0, -1),
            // Top face
            vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0),
            // Bottom face
            vec3(0, -1, 0), vec3(0, -1, 0), vec3(0, -1, 0), vec3(0, -1, 0),
            // Right face
            vec3(1, 0, 0), vec3(1, 0, 0), vec3(1, 0, 0), vec3(1, 0, 0),
            // Left face
            vec3(-1, 0, 0), vec3(-1, 0, 0), vec3(-1, 0, 0), vec3(-1, 0, 0),
        ];

        this.arrays.texture_coord = [
            // Front face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Back face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Top face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Bottom face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Right face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
            // Left face
            vec(0, 0), vec(1, 0), vec(1, 1), vec(0, 1),
        ];

        this.arrays.color = [
            // Front face
            basket_color, basket_color, basket_color, basket_color,
            // Back face
            basket_color, basket_color, basket_color, basket_color,
            // Top face
            basket_color, basket_color, basket_color, basket_color,
            // Bottom face
            basket_color, basket_color, basket_color, basket_color,
            // Right face
            basket_color, basket_color, basket_color, basket_color,
            // Left face
            basket_color, basket_color, basket_color, basket_color,
        ];

        this.indices.push(
            // Front face
            0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Top face - commented out bc transparent
            // 8, 9, 10, 8, 10, 11,
            // Bottom face
            12, 13, 14, 12, 14, 15,
            // Right face
            16, 17, 18, 16, 18, 19,
            // Left face
            20, 21, 22, 20, 22, 23
        );
    }
};
