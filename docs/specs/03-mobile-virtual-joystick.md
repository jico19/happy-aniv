# 03 - Mobile Virtual Joystick (Joycon) Specification

## 1. Goal & Requirements

Provide a responsive, intuitive, retro joycon-style controller overlay on mobile/touch viewports so the user can navigate the museum naturally with their thumbs without needing a keyboard.

- **Thumbstick (Left thumb)**: Analog joystick providing 360-degree direction and proportional speed.
- **Action Button (Right thumb)**: Circular action button labeled "A" or "Inspect" to trigger exhibit interactions.
- **Conditional Visibility**: Visible exclusively on touch-enabled devices or viewports `< 768px` width.
- **Touch Isolation**: Prevent browser pull-to-refresh, page scrolling, and pinch-to-zoom while controlling the thumbstick.

---

## 2. Component Design (`src/components/MobileJoycon.jsx`)

### Visual Structure
- **Base Container**: Fixed overlay on bottom of the screen (`pointer-events-none` container with `pointer-events-auto` controls).
- **Left Zone (Joystick Area)**:
  - Outer Ring: Semi-transparent frosted circle (diameter: 120px) with Joycon-style tick marks.
  - Inner Thumb/Knob: Elevated circular knob (diameter: 50px) with drop shadow and grip texture.
  - Max displacement radius: 45px from base center.
- **Right Zone (Action Area)**:
  - "Inspect" / "A" button: 64px diameter circular button styled like a retro Joycon face button.
  - Active state: Pulses or lights up with a subtle gold glow when the player is within range of an exhibit.

---

## 3. Mathematical Model & Input Mapping

1. **Touch Start**:
   - Touch point $(X_t, Y_t)$ locks the origin $(X_0, Y_0)$ of the joystick base (or uses fixed base position).
2. **Touch Move**:
   - Compute vector:
     $$\Delta X = X_t - X_0, \quad \Delta Y = Y_t - Y_0$$
   - Compute distance:
     $$D = \sqrt{\Delta X^2 + \Delta Y^2}$$
   - Clamp displacement to maximum radius $R_{max} = 45\text{px}$:
     $$\text{KnobPosition} = \begin{cases} (\Delta X, \Delta Y) & \text{if } D \le R_{max} \\ \left(\frac{\Delta X}{D} \cdot R_{max}, \frac{\Delta Y}{D} \cdot R_{max}\right) & \text{if } D > R_{max} \end{cases}$$
   - Compute normalized unit vector and force:
     $$V_x = \frac{\Delta X}{\max(D, 1)}, \quad V_y = \frac{\Delta Y}{\max(D, 1)}$$
     $$\text{Force} = \min\left(1.0, \frac{D}{R_{max}}\right)$$
   - Deadzone: If $D < 8\text{px}$, treat as $(0, 0)$.
3. **Emit Event**:
   - Emit `JOYSTICK_MOVE` with payload `{ vx: Vx, vy: Vy, force: Force }`.
4. **Touch End / Touch Cancel**:
   - Reset knob smoothly to center with spring transition.
   - Emit `JOYSTICK_STOP`.

---

## 4. Integration with Phaser Player

Inside `Player.js` `update()`:
```javascript
if (this.mobileVelocity.active) {
  const speed = this.baseSpeed * this.mobileVelocity.force;
  this.sprite.setVelocity(
    this.mobileVelocity.vx * speed,
    this.mobileVelocity.vy * speed
  );
  this.updateAnimationFromVector(this.mobileVelocity.vx, this.mobileVelocity.vy);
} else {
  // Fallback to keyboard controls
  this.handleKeyboardMovement();
}
```

---

## 5. Mobile Viewport & Gesture Protections

Add to CSS / root viewport:
- `touch-action: none` on the game canvas and controller pads.
- `overscroll-behavior: none` on the HTML body.
- `-webkit-user-select: none` on all interactive overlays.
- Prevent iOS Safari bounce behavior on touchmove.
