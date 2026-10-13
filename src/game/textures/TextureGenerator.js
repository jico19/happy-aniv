// src/game/textures/TextureGenerator.js
// Procedural high-fidelity pixel-art texture generator for museum tiles and sprites

export function generateTextures(scene) {
  const textures = scene.textures;

  // 1. Parquet Wood Floor (32x32)
  if (!textures.exists('floor')) {
    const canvas = textures.createCanvas('floor', 32, 32);
    const ctx = canvas.getContext();

    // Base warm wood tone
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, 0, 32, 32);

    // Parquet planks pattern
    const colors = ['#53371b', '#5c3d1e', '#6e4a25', '#7a532a'];
    // Top-left block
    ctx.fillStyle = colors[2];
    ctx.fillRect(0, 0, 16, 8);
    ctx.fillStyle = colors[3];
    ctx.fillRect(0, 8, 16, 8);
    // Bottom-right block
    ctx.fillStyle = colors[1];
    ctx.fillRect(16, 16, 16, 8);
    ctx.fillStyle = colors[2];
    ctx.fillRect(16, 24, 16, 8);
    // Top-right vertical planks
    ctx.fillStyle = colors[0];
    ctx.fillRect(16, 0, 8, 16);
    ctx.fillStyle = colors[2];
    ctx.fillRect(24, 0, 8, 16);
    // Bottom-left vertical planks
    ctx.fillStyle = colors[3];
    ctx.fillRect(0, 16, 8, 16);
    ctx.fillStyle = colors[1];
    ctx.fillRect(8, 16, 8, 16);

    // Seams and subtle grain lines
    ctx.strokeStyle = '#3d2511';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, 31, 31);
    ctx.beginPath();
    ctx.moveTo(16, 0); ctx.lineTo(16, 32);
    ctx.moveTo(0, 16); ctx.lineTo(32, 16);
    ctx.stroke();

    canvas.refresh();
  }

  // 2. Red Velvet Carpet Runner (32x32)
  if (!textures.exists('carpet')) {
    const canvas = textures.createCanvas('carpet', 32, 32);
    const ctx = canvas.getContext();

    // Wood base underneath
    ctx.fillStyle = '#5c3d1e';
    ctx.fillRect(0, 0, 32, 32);

    // Velvet carpet center
    ctx.fillStyle = '#831825';
    ctx.fillRect(0, 4, 32, 24);

    // Carpet inner highlight
    ctx.fillStyle = '#9b1f2e';
    ctx.fillRect(0, 7, 32, 18);

    // Gold trim fringes
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 4, 32, 2);
    ctx.fillRect(0, 26, 32, 2);

    canvas.refresh();
  }

  // 3. Museum Wall (32x32)
  if (!textures.exists('wall')) {
    const canvas = textures.createCanvas('wall', 32, 32);
    const ctx = canvas.getContext();

    // Crown molding at top
    ctx.fillStyle = '#4a2c19';
    ctx.fillRect(0, 0, 32, 3);
    ctx.fillStyle = '#784c2b';
    ctx.fillRect(0, 3, 32, 2);

    // Cream plaster wall
    ctx.fillStyle = '#ece4d4';
    ctx.fillRect(0, 5, 32, 21);

    // Wainscoting / Dark Baseboard at bottom
    ctx.fillStyle = '#61391f';
    ctx.fillRect(0, 26, 32, 3);
    ctx.fillStyle = '#392112';
    ctx.fillRect(0, 29, 32, 3);

    // Subtle vertical panel line
    ctx.fillStyle = '#ded5c3';
    ctx.fillRect(31, 5, 1, 21);

    canvas.refresh();
  }

  // 4. Arch Doorway to Final Room (64x64)
  if (!textures.exists('doorway')) {
    const canvas = textures.createCanvas('doorway', 64, 64);
    const ctx = canvas.getContext();

    // Dark portal interior
    ctx.fillStyle = '#110d14';
    ctx.fillRect(8, 12, 48, 52);

    // Warm golden light spilling out from inside
    const grad = ctx.createRadialGradient(32, 36, 4, 32, 36, 30);
    grad.addColorStop(0, 'rgba(255, 230, 160, 0.7)');
    grad.addColorStop(1, 'rgba(17, 13, 20, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(8, 12, 48, 52);

    // Arch frame (Dark mahogany and gold)
    ctx.strokeStyle = '#61391f';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(32, 28, 22, Math.PI, 0, false);
    ctx.lineTo(54, 64);
    ctx.lineTo(10, 64);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(32, 28, 20, Math.PI, 0, false);
    ctx.stroke();

    canvas.refresh();
  }

  // 5. Framed Exhibit Painting (32x40)
  if (!textures.exists('exhibit-frame')) {
    const canvas = textures.createCanvas('exhibit-frame', 32, 40);
    const ctx = canvas.getContext();

    // Wall backdrop behind frame
    ctx.fillStyle = '#ece4d4';
    ctx.fillRect(0, 0, 32, 40);

    // Ornate Gold Outer Frame
    ctx.fillStyle = '#9b7617';
    ctx.fillRect(2, 2, 28, 28);
    ctx.fillStyle = '#f0c74b';
    ctx.fillRect(3, 3, 26, 26);
    ctx.fillStyle = '#705307';
    ctx.fillRect(5, 5, 22, 22);

    // Canvas inside with miniature impressionist landscape
    ctx.fillStyle = '#3a5f8a'; // Sky
    ctx.fillRect(6, 6, 20, 10);
    ctx.fillStyle = '#d68060'; // Sunset glow
    ctx.fillRect(6, 12, 20, 4);
    ctx.fillStyle = '#2f5a35'; // Rolling hills
    ctx.fillRect(6, 16, 20, 10);

    // Brass exhibit plaque underneath
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(8, 32, 16, 5);
    ctx.fillStyle = '#41320d';
    ctx.fillRect(10, 34, 12, 1);

    canvas.refresh();
  }

  // 6. Classical Marble Column (32x64)
  if (!textures.exists('column')) {
    const canvas = textures.createCanvas('column', 32, 64);
    const ctx = canvas.getContext();

    // Capital (Top)
    ctx.fillStyle = '#f0ece1';
    ctx.fillRect(2, 4, 28, 6);
    ctx.fillStyle = '#d9d1c1';
    ctx.fillRect(4, 10, 24, 4);

    // Fluted Column Shaft
    ctx.fillStyle = '#e8e2d4';
    ctx.fillRect(6, 14, 20, 38);
    // Vertical fluting shadows
    ctx.fillStyle = '#cfc6b5';
    ctx.fillRect(8, 14, 2, 38);
    ctx.fillRect(13, 14, 2, 38);
    ctx.fillRect(18, 14, 2, 38);
    ctx.fillRect(23, 14, 2, 38);

    // Pedestal Base
    ctx.fillStyle = '#d9d1c1';
    ctx.fillRect(4, 52, 24, 4);
    ctx.fillStyle = '#bfb5a3';
    ctx.fillRect(2, 56, 28, 8);

    canvas.refresh();
  }

  // 7. Potted Museum Plant (32x48)
  if (!textures.exists('plant')) {
    const canvas = textures.createCanvas('plant', 32, 48);
    const ctx = canvas.getContext();

    // Terracotta pot
    ctx.fillStyle = '#c76239';
    ctx.fillRect(8, 28, 16, 16);
    ctx.fillStyle = '#e27b52';
    ctx.fillRect(6, 25, 20, 5);
    ctx.fillStyle = '#8f3e1d';
    ctx.fillRect(8, 42, 16, 2);

    // Monstera / lush leaves
    ctx.fillStyle = '#1e5229';
    ctx.beginPath();
    ctx.arc(12, 18, 8, 0, Math.PI * 2);
    ctx.arc(20, 16, 9, 0, Math.PI * 2);
    ctx.arc(16, 10, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#317f41';
    ctx.beginPath();
    ctx.arc(10, 17, 6, 0, Math.PI * 2);
    ctx.arc(22, 15, 6, 0, Math.PI * 2);
    ctx.arc(16, 9, 5, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  // 7b. Fresh Blooming Daisies in Glazed Ceramic Vase (32x40)
  if (!textures.exists('daisy-vase')) {
    const canvas = textures.createCanvas('daisy-vase', 32, 40);
    const ctx = canvas.getContext();

    // Glazed ivory ceramic vase
    ctx.fillStyle = '#ded9cf';
    ctx.fillRect(10, 24, 12, 14);
    ctx.fillStyle = '#f5f2eb';
    ctx.fillRect(11, 24, 9, 13);
    // Vase neck & rim
    ctx.fillStyle = '#baa78c';
    ctx.fillRect(9, 22, 14, 3);
    ctx.fillStyle = '#c5a880';
    ctx.fillRect(10, 25, 12, 1);

    // Green stems and foliage
    ctx.strokeStyle = '#27592e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(16, 24); ctx.lineTo(11, 14);
    ctx.moveTo(16, 24); ctx.lineTo(16, 10);
    ctx.moveTo(16, 24); ctx.lineTo(21, 13);
    ctx.moveTo(16, 24); ctx.lineTo(24, 17);
    ctx.moveTo(16, 24); ctx.lineTo(8, 18);
    ctx.stroke();

    // Foliage leaves
    ctx.fillStyle = '#3b8044';
    ctx.beginPath();
    ctx.arc(12, 21, 3, 0, Math.PI * 2);
    ctx.arc(20, 21, 3, 0, Math.PI * 2);
    ctx.fill();

    // Helper: Draw a detailed pixel daisy flower
    const drawDaisy = (cx, cy, r) => {
      // White petals
      ctx.fillStyle = '#ffffff';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const px = cx + Math.cos(a) * (r + 1.5);
        const py = cy + Math.sin(a) * (r + 1.5);
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Sunny yellow center
      ctx.fillStyle = '#f5b025';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      // Center highlight
      ctx.fillStyle = '#fed668';
      ctx.fillRect(cx - 0.5, cy - 0.5, 1.5, 1.5);
    };

    // 5 blooming daisies of varying sizes
    drawDaisy(16, 9, 2.4);  // Top center
    drawDaisy(10, 14, 2.2); // Left
    drawDaisy(22, 13, 2.2); // Right
    drawDaisy(7, 18, 1.8);  // Lower left
    drawDaisy(24, 18, 1.8); // Lower right

    canvas.refresh();
  }

  // 7b2. Daisy Vase after picking (trimmed stems & foliage)
  if (!textures.exists('daisy-vase-picked')) {
    const canvas = textures.createCanvas('daisy-vase-picked', 32, 40);
    const ctx = canvas.getContext();

    // Glazed ivory ceramic vase
    ctx.fillStyle = '#ded9cf';
    ctx.fillRect(10, 24, 12, 14);
    ctx.fillStyle = '#f5f2eb';
    ctx.fillRect(11, 24, 9, 13);
    // Vase neck & rim
    ctx.fillStyle = '#baa78c';
    ctx.fillRect(9, 22, 14, 3);
    ctx.fillStyle = '#c5a880';
    ctx.fillRect(10, 25, 12, 1);

    // Green stems trimmed
    ctx.strokeStyle = '#27592e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(16, 24); ctx.lineTo(13, 19);
    ctx.moveTo(16, 24); ctx.lineTo(19, 18);
    ctx.stroke();

    // Little green foliage leaf
    ctx.fillStyle = '#3b8044';
    ctx.beginPath();
    ctx.arc(14, 22, 2.5, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  // 7c. Museum Gallery Bench (48x28)
  if (!textures.exists('bench')) {
    const canvas = textures.createCanvas('bench', 48, 28);
    const ctx = canvas.getContext();

    // Wooden legs & frame
    ctx.fillStyle = '#3d2511';
    ctx.fillRect(4, 16, 4, 10);
    ctx.fillRect(40, 16, 4, 10);
    ctx.fillRect(6, 14, 36, 4);

    // Deep burgundy cushioned seat
    ctx.fillStyle = '#6a1a24';
    ctx.fillRect(2, 6, 44, 10);
    ctx.fillStyle = '#83212e';
    ctx.fillRect(3, 7, 42, 7);

    // Tufted cushion button indentations
    ctx.fillStyle = '#4c1018';
    ctx.fillRect(12, 10, 2, 2);
    ctx.fillRect(24, 10, 2, 2);
    ctx.fillRect(36, 10, 2, 2);

    canvas.refresh();
  }

  // 8. Final Room Centerpiece Pedestal (48x48)
  if (!textures.exists('pedestal')) {
    const canvas = textures.createCanvas('pedestal', 48, 48);
    const ctx = canvas.getContext();

    // Pedestal stand
    ctx.fillStyle = '#f0ece1';
    ctx.fillRect(10, 24, 28, 20);
    ctx.fillStyle = '#dcd4c3';
    ctx.fillRect(8, 20, 32, 5);
    ctx.fillStyle = '#baa78c';
    ctx.fillRect(6, 42, 36, 6);

    // Golden Anniversary Envelope on top
    ctx.fillStyle = '#ffd15c';
    ctx.fillRect(16, 10, 16, 11);
    ctx.strokeStyle = '#b88914';
    ctx.lineWidth = 1;
    ctx.strokeRect(16.5, 10.5, 15, 10);

    // Red wax seal
    ctx.fillStyle = '#a62424';
    ctx.beginPath();
    ctx.arc(24, 15, 3, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle star above
    ctx.fillStyle = '#fff4bd';
    ctx.fillRect(23, 2, 3, 5);
    ctx.fillRect(21, 3, 7, 3);

    canvas.refresh();
  }

  // 9. Floating [E] Prompt Bubble (24x20)
  if (!textures.exists('bubble-e')) {
    const canvas = textures.createCanvas('bubble-e', 24, 20);
    const ctx = canvas.getContext();

    // Speech bubble background
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1e1a17';
    ctx.lineWidth = 1.5;

    // Rounded rect body
    ctx.beginPath();
    ctx.roundRect(2, 1, 20, 14, 4);
    ctx.fill();
    ctx.stroke();

    // Bubble pointer down
    ctx.beginPath();
    ctx.moveTo(9, 15);
    ctx.lineTo(12, 19);
    ctx.lineTo(15, 15);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // "E" letter in bold retro font
    ctx.fillStyle = '#1e1a17';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', 12, 8);

    canvas.refresh();
  }

  // 10. Player Character Sprite Sheet (96x128 = 3 columns x 4 rows of 32x32)
  if (!textures.exists('player')) {
    const canvas = textures.createCanvas('player', 96, 128);
    const ctx = canvas.getContext();

    // Directions: 0: Down, 1: Left, 2: Right, 3: Up
    // Columns: 0: Walk A, 1: Idle, 2: Walk B
    const drawCharacter = (ox, oy, dir, frame) => {
      const cx = ox + 16;

      // Leg offsets depending on walk frame
      let leftLegOffset = 0;
      let rightLegOffset = 0;
      let headBob = 0;

      if (frame === 0) {
        leftLegOffset = -3;
        rightLegOffset = 2;
        headBob = -1;
      } else if (frame === 2) {
        leftLegOffset = 2;
        rightLegOffset = -3;
        headBob = -1;
      }

      // Shadow underneath
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(cx, oy + 29, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shoes (Dark brown)
      ctx.fillStyle = '#2d1e12';
      if (dir === 1) { // Left
        ctx.fillRect(cx - 4, oy + 27 + leftLegOffset, 4, 3);
        ctx.fillRect(cx - 1, oy + 27 + rightLegOffset, 4, 3);
      } else if (dir === 2) { // Right
        ctx.fillRect(cx - 3, oy + 27 + leftLegOffset, 4, 3);
        ctx.fillRect(cx, oy + 27 + rightLegOffset, 4, 3);
      } else { // Down or Up
        ctx.fillRect(cx - 5, oy + 27 + leftLegOffset, 4, 3);
        ctx.fillRect(cx + 1, oy + 27 + rightLegOffset, 4, 3);
      }

      // Trousers (Khaki beige)
      ctx.fillStyle = '#8b7a65';
      ctx.fillRect(cx - 5, oy + 21, 10, 7);

      // Sweater (Cosy navy teal #2d4f5e)
      ctx.fillStyle = '#2d4f5e';
      ctx.fillRect(cx - 6, oy + 13 + headBob, 12, 9);
      // Sweater collar highlight
      ctx.fillStyle = '#426c80';
      ctx.fillRect(cx - 4, oy + 13 + headBob, 8, 2);

      // Head / Face (Warm skin tone #ffdbac)
      ctx.fillStyle = '#fcd0a1';
      ctx.fillRect(cx - 5, oy + 5 + headBob, 10, 8);

      // Hair (Soft rich brown #4a2c16)
      ctx.fillStyle = '#4a2c16';
      ctx.fillRect(cx - 6, oy + 2 + headBob, 12, 5);
      if (dir === 0) { // Down: front bangs & eyes
        ctx.fillRect(cx - 6, oy + 4 + headBob, 2, 3);
        ctx.fillRect(cx + 4, oy + 4 + headBob, 2, 3);
        // Eyes (pixel dots)
        ctx.fillStyle = '#1e140d';
        ctx.fillRect(cx - 3, oy + 8 + headBob, 2, 2);
        ctx.fillRect(cx + 1, oy + 8 + headBob, 2, 2);
        // Rosy cheeks
        ctx.fillStyle = '#f49a8d';
        ctx.fillRect(cx - 4, oy + 10 + headBob, 2, 1);
        ctx.fillRect(cx + 2, oy + 10 + headBob, 2, 1);
      } else if (dir === 1) { // Left: profile
        ctx.fillRect(cx - 6, oy + 3 + headBob, 4, 4);
        ctx.fillStyle = '#1e140d';
        ctx.fillRect(cx - 4, oy + 8 + headBob, 2, 2);
      } else if (dir === 2) { // Right: profile
        ctx.fillRect(cx + 2, oy + 3 + headBob, 4, 4);
        ctx.fillStyle = '#1e140d';
        ctx.fillRect(cx + 2, oy + 8 + headBob, 2, 2);
      } else { // Up: back of head
        ctx.fillRect(cx - 6, oy + 3 + headBob, 12, 7);
      }
    };

    for (let dir = 0; dir < 4; dir++) {
      for (let frame = 0; frame < 3; frame++) {
        drawCharacter(frame * 32, dir * 32, dir, frame);
      }
    }

    canvas.refresh();

    // Define spritesheet frames in Phaser
    textures.addSpriteSheet('player-sheet', textures.get('player').getSourceImage(), {
      frameWidth: 32,
      frameHeight: 32
    });
  }
}
