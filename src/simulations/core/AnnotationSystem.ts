/**
 * Smart Annotation System for Physics Simulations
 * Handles collision-free label positioning, candidate positions, priority ranking,
 * safe area bounds, leader lines, compact viewport modes, and LTR math formatting.
 */

export enum AnnotationPriority {
  PRIMARY_VALUE = 1,   // Key real-time values (e.g. Current, Angle, Speed, Voltage)
  MEASUREMENT = 2,     // Distance lines, periods, dimensions (e.g. 1.20 m, 20 cm)
  OBJECT_NAME = 3,     // Labels for objects (e.g. Lens, Resistor, Bob, Laser)
  SECONDARY_INFO = 4,  // Formulas, legends, secondary notes
}

export interface AnnotationItem {
  id: string;
  anchorX: number;
  anchorY: number;
  text: string;
  compactText?: string;
  priority: AnnotationPriority;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  fontSize?: number;
}

export type Obstacle =
  | { type: 'box'; x: number; y: number; width: number; height: number }
  | { type: 'circle'; x: number; y: number; radius: number }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; padding: number };

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SmartLabelSystem {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private safeMargin: number;
  private obstacles: Obstacle[] = [];
  private placedBoxes: BoundingBox[] = [];

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, safeMargin = 12) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.safeMargin = safeMargin;
  }

  /**
   * Reset system per frame
   */
  public reset(canvasWidth: number, canvasHeight: number): void {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.obstacles = [];
    this.placedBoxes = [];
  }

  /**
   * Register a physical geometry obstacle (e.g. lens, pendulum bob, laser ray)
   */
  public addObstacle(obstacle: Obstacle): void {
    this.obstacles.push(obstacle);
  }

  /**
   * Check if a bounding box collides with safe area bounds, registered obstacles, or previously placed labels
   */
  private checkCollision(box: BoundingBox): boolean {
    // 1. Safe Area Check
    if (
      box.x < this.safeMargin ||
      box.y < this.safeMargin ||
      box.x + box.width > this.canvasWidth - this.safeMargin ||
      box.y + box.height > this.canvasHeight - this.safeMargin
    ) {
      return true;
    }

    // 2. Previously Placed Labels Collision
    for (const placed of this.placedBoxes) {
      if (
        box.x < placed.x + placed.width &&
        box.x + box.width > placed.x &&
        box.y < placed.y + placed.height &&
        box.y + box.height > placed.y
      ) {
        return true;
      }
    }

    // 3. Physical Geometry Obstacles Collision
    for (const obs of this.obstacles) {
      if (obs.type === 'box') {
        if (
          box.x < obs.x + obs.width &&
          box.x + box.width > obs.x &&
          box.y < obs.y + obs.height &&
          box.y + box.height > obs.y
        ) {
          return true;
        }
      } else if (obs.type === 'circle') {
        // Circle vs AABB Box collision
        const closestX = Math.max(box.x, Math.min(obs.x, box.x + box.width));
        const closestY = Math.max(box.y, Math.min(obs.y, box.y + box.height));
        const distanceX = obs.x - closestX;
        const distanceY = obs.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        if (distanceSquared < obs.radius * obs.radius) {
          return true;
        }
      } else if (obs.type === 'line') {
        // Line segment vs Box collision approximation
        if (this.lineIntersectsBox(obs.x1, obs.y1, obs.x2, obs.y2, box, obs.padding)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Line segment intersection with AABB box with padding
   */
  private lineIntersectsBox(x1: number, y1: number, x2: number, y2: number, box: BoundingBox, padding: number): boolean {
    const minX = box.x - padding;
    const maxX = box.x + box.width + padding;
    const minY = box.y - padding;
    const maxY = box.y + box.height + padding;

    // Fast reject if line bounding box doesn't overlap
    if (Math.max(x1, x2) < minX || Math.min(x1, x2) > maxX || Math.max(y1, y2) < minY || Math.min(y1, y2) > maxY) {
      return false;
    }

    // Sample points along the line segment
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x1 + t * (x2 - x1);
      const py = y1 + t * (y2 - y1);
      if (px >= minX && px <= maxX && py >= minY && py <= maxY) {
        return true;
      }
    }
    return false;
  }

  /**
   * Render a list of annotations sorted by priority
   */
  public renderAnnotations(items: AnnotationItem[]): void {
    // Sort items by priority ascending (Priority 1 first)
    const sorted = [...items].sort((a, b) => a.priority - b.priority);

    const isNarrowViewport = this.canvasWidth < 400;

    for (const item of sorted) {
      const displayText = isNarrowViewport && item.compactText ? item.compactText : item.text;
      const fontSize = item.fontSize || (isNarrowViewport ? 10 : 11);
      
      this.ctx.font = `bold ${fontSize}px monospace, system-ui, sans-serif`;
      
      // Calculate text dimensions
      const textMetrics = this.ctx.measureText(displayText);
      const textWidth = Math.ceil(textMetrics.width);
      const paddingX = 8;
      const paddingY = 5;
      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = fontSize + paddingY * 2;

      // Distance offset from anchor point
      const offset = 12;

      // Candidate Positions around anchor point (x, y of box top-left)
      const candidates: { name: string; box: BoundingBox }[] = [
        // 1. Top
        {
          name: 'top',
          box: {
            x: item.anchorX - boxWidth / 2,
            y: item.anchorY - offset - boxHeight,
            width: boxWidth,
            height: boxHeight,
          },
        },
        // 2. Bottom
        {
          name: 'bottom',
          box: {
            x: item.anchorX - boxWidth / 2,
            y: item.anchorY + offset,
            width: boxWidth,
            height: boxHeight,
          },
        },
        // 3. Right
        {
          name: 'right',
          box: {
            x: item.anchorX + offset,
            y: item.anchorY - boxHeight / 2,
            width: boxWidth,
            height: boxHeight,
          },
        },
        // 4. Left
        {
          name: 'left',
          box: {
            x: item.anchorX - offset - boxWidth,
            y: item.anchorY - boxHeight / 2,
            width: boxWidth,
            height: boxHeight,
          },
        },
        // 5. Top-Right
        {
          name: 'top-right',
          box: {
            x: item.anchorX + offset,
            y: item.anchorY - offset - boxHeight,
            width: boxWidth,
            height: boxHeight,
          },
        },
        // 6. Top-Left
        {
          name: 'top-left',
          box: {
            x: item.anchorX - offset - boxWidth,
            y: item.anchorY - offset - boxHeight,
            width: boxWidth,
            height: boxHeight,
          },
        },
        // 7. Bottom-Right
        {
          name: 'bottom-right',
          box: {
            x: item.anchorX + offset,
            y: item.anchorY + offset,
            width: boxWidth,
            height: boxHeight,
          },
        },
        // 8. Bottom-Left
        {
          name: 'bottom-left',
          box: {
            x: item.anchorX - offset - boxWidth,
            y: item.anchorY + offset,
            width: boxWidth,
            height: boxHeight,
          },
        },
      ];

      let selectedBox: BoundingBox | null = null;
      let isDisplaced = false;

      // Find first collision-free candidate
      for (const cand of candidates) {
        if (!this.checkCollision(cand.box)) {
          selectedBox = cand.box;
          break;
        }
      }

      // If all candidates collide, clamp box into safe area and draw leader line
      if (!selectedBox) {
        isDisplaced = true;
        const clampedX = Math.max(
          this.safeMargin,
          Math.min(item.anchorX - boxWidth / 2, this.canvasWidth - this.safeMargin - boxWidth)
        );
        const clampedY = Math.max(
          this.safeMargin,
          Math.min(item.anchorY - offset - boxHeight, this.canvasHeight - this.safeMargin - boxHeight)
        );
        selectedBox = {
          x: clampedX,
          y: clampedY,
          width: boxWidth,
          height: boxHeight,
        };
      }

      // Reserve space for this label
      this.placedBoxes.push(selectedBox);

      // Draw Annotation
      this.drawAnnotationPill(item, displayText, selectedBox, fontSize, paddingX, paddingY, isDisplaced);
    }
  }

  /**
   * Draw label pill, background, border, leader line, and LTR formatted text
   */
  private drawAnnotationPill(
    item: AnnotationItem,
    displayText: string,
    box: BoundingBox,
    fontSize: number,
    paddingX: number,
    paddingY: number,
    isDisplaced: boolean
  ): void {
    const ctx = this.ctx;
    ctx.save();

    // 1. Draw Leader Line if displaced
    if (isDisplaced) {
      const boxCenterX = box.x + box.width / 2;
      const boxCenterY = box.y + box.height / 2;

      ctx.strokeStyle = item.borderColor || 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      ctx.beginPath();
      ctx.moveTo(item.anchorX, item.anchorY);
      ctx.lineTo(boxCenterX, boxCenterY);
      ctx.stroke();

      ctx.setLineDash([]);

      // Terminal dot at anchor
      ctx.fillStyle = item.borderColor || '#38bdf8';
      ctx.beginPath();
      ctx.arc(item.anchorX, item.anchorY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw Pill Background Box
    ctx.fillStyle = item.bgColor || 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = item.borderColor || '#0284c7';
    ctx.lineWidth = 1;

    // Rounded rectangle path
    const radius = 6;
    ctx.beginPath();
    ctx.roundRect(box.x, box.y, box.width, box.height, radius);
    ctx.fill();
    ctx.stroke();

    // 3. Draw Text (Enforce LTR direction for math symbols, formulas, and numbers)
    ctx.direction = 'ltr';
    ctx.fillStyle = item.color || '#e2e8f0';
    ctx.font = `bold ${fontSize}px monospace, system-ui, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    ctx.fillText(displayText, box.x + paddingX, box.y + paddingY);

    ctx.restore();
  }
}
