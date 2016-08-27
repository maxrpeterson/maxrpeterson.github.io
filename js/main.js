const colors = [
  {r: 2, g: 8, b: 44},
  {r: 70, g: 40, b: 100},
  {r: 106, g: 44, b: 95},
  {r: 226, g: 67, b: 37},
  {r: 146, g: 26, b: 74},
  {r: 43, g: 16, b: 87},
  {r: 189, g: 102, b: 82},
  {r: 45, g: 15, b: 112},
  {r: 0, g: 15, b: 81}
];

function rand(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getNewColorTargets(oldTargets) {
  const _oldTargets = oldTargets || {left: {}, right: {}};
  let left = rand(colors);
  while (left === colors[colors.indexOf(_oldTargets.left)]) {
    left = rand(colors);
  }
  let right = rand(colors);
  while (right === colors[colors.indexOf(_oldTargets.right)] || right === colors[colors.indexOf(left)]) {
    right = rand(colors);
  }
  return {left: left, right: right};
}

function rgb(colorObj) {
  return `rgb(${Math.round(colorObj.r)}, ${Math.round(colorObj.g)}, ${Math.round(colorObj.b)})`;
}


function renderCanvasGradient(ctx, left, right) {
  let gradient = ctx.createLinearGradient(ctx.canvas.width, 0, 0, ctx.canvas.height);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  gradient.addColorStop(0, left);
  gradient.addColorStop(1, right);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function calcChange(oldTarg, newTarg, numSteps) {
  return (newTarg - oldTarg) / numSteps;
}

function getChanges(oldTarg, newTarg, numSteps) {
  return {
    left: {
      r: calcChange(oldTarg.left.r, newTarg.left.r, numSteps),
      g: calcChange(oldTarg.left.g, newTarg.left.g, numSteps),
      b: calcChange(oldTarg.left.b, newTarg.left.b, numSteps)
    },
    right: {
      r: calcChange(oldTarg.right.r, newTarg.right.r, numSteps),
      g: calcChange(oldTarg.right.g, newTarg.right.g, numSteps),
      b: calcChange(oldTarg.right.b, newTarg.right.b, numSteps)
    }
  };
}

function init() {
  const steps = 600;
  const canvas = document.querySelector('canvas');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  const ctx = canvas.getContext('2d');

  console.log(ctx);

  let colorTargets = getNewColorTargets();
  let colorValues = {
    left: {
      r: colorTargets.left.r,
      g: colorTargets.left.g,
      b: colorTargets.left.b
    },
    right: {
      r: colorTargets.right.r,
      g: colorTargets.right.g,
      b: colorTargets.right.b
    }
  };
  let i = 0;
  renderCanvasGradient(ctx, rgb(colorValues.left), rgb(colorValues.right));

  colorTargets = getNewColorTargets(colorTargets);

  let change = getChanges(colorValues, colorTargets, steps);

  function step(timestamp) {
    if (i === steps) {
      i = 0;
      let old = colorTargets;
      colorTargets = getNewColorTargets(colorTargets);
      change = getChanges(old, colorTargets, steps);
    }

    colorValues.left.r += change.left.r;
    colorValues.left.g += change.left.g;
    colorValues.left.b += change.left.b;
    colorValues.right.r += change.right.r;
    colorValues.right.g += change.right.g;
    colorValues.right.b += change.right.b;

    renderCanvasGradient(ctx, rgb(colorValues.left), rgb(colorValues.right));

    i++;
    window.requestAnimationFrame(step);
  }
  step();
}

init();

// function hexToRgb(hex) {
//   return {
//     r: parseInt(hex.substr(0, 2), 16),
//     g: parseInt(hex.substr(2, 2), 16),
//     b: parseInt(hex.substr(4, 2), 16)
//   };
// }
