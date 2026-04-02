// ═══════════════════════════════════════════════════════════════════
// PASSWORD GENERATOR
// ═══════════════════════════════════════════════════════════════════

const pwElements = {
  output: document.getElementById('pw-output'),
  length: document.getElementById('pw-length'),
  lenDisplay: document.getElementById('pw-len-display'),
  upper: document.getElementById('pw-upper'),
  lower: document.getElementById('pw-lower'),
  numbers: document.getElementById('pw-numbers'),
  symbols: document.getElementById('pw-symbols'),
  generateBtn: document.getElementById('pw-generate'),
  copyBtn: document.getElementById('pw-copy'),
  strengthFill: document.getElementById('strength-fill'),
  strengthLabel: document.getElementById('strength-label'),
};

const pwChars = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-={}[]|:;<>?,./~`',
};

function generatePassword() {
  let chars = '';
  if (pwElements.upper.checked) chars += pwChars.upper;
  if (pwElements.lower.checked) chars += pwChars.lower;
  if (pwElements.numbers.checked) chars += pwChars.numbers;
  if (pwElements.symbols.checked) chars += pwChars.symbols;

  if (!chars) {
    pwElements.output.value = '';
    return;
  }

  const length = parseInt(pwElements.length.value);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  pwElements.output.value = password;
  updatePasswordStrength(password);
}

function updatePasswordStrength(password) {
  let strength = 0;
  let label = 'Weak';
  let color = '#f87171';

  if (password.length >= 12) strength += 1;
  if (password.length >= 16) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

  if (strength <= 2) {
    label = 'Weak';
    color = '#f87171';
  } else if (strength <= 4) {
    label = 'Fair';
    color = '#facc15';
  } else {
    label = 'Strong';
    color = '#4ade80';
  }

  const percentage = (strength / 6) * 100;
  pwElements.strengthFill.style.width = percentage + '%';
  pwElements.strengthFill.style.background = color;
  pwElements.strengthLabel.textContent = label;
  pwElements.strengthLabel.style.color = color;
}

pwElements.generateBtn.addEventListener('click', generatePassword);

pwElements.length.addEventListener('input', (e) => {
  pwElements.lenDisplay.textContent = e.target.value;
});

pwElements.copyBtn.addEventListener('click', () => {
  if (pwElements.output.value) {
    navigator.clipboard.writeText(pwElements.output.value);
    const original = pwElements.copyBtn.innerHTML;
    pwElements.copyBtn.innerHTML = '✓';
    setTimeout(() => (pwElements.copyBtn.innerHTML = original), 1500);
  }
});

[pwElements.upper, pwElements.lower, pwElements.numbers, pwElements.symbols].forEach((cb) => {
  cb.addEventListener('change', generatePassword);
});

generatePassword();

// ═══════════════════════════════════════════════════════════════════
// UNIT CONVERTER
// ═══════════════════════════════════════════════════════════════════

const convUnits = {
  length: {
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    mi: 0.000621371,
    yd: 1.09361,
    ft: 3.28084,
    in: 39.3701,
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1e6,
    lb: 2.20462,
    oz: 35.274,
  },
  volume: {
    l: 1,
    ml: 1000,
    gal: 0.264172,
    pt: 2.11338,
    cup: 4.22675,
    fl_oz: 33.814,
  },
};

const convElements = {
  tabs: document.getElementById('conv-tabs'),
  fromVal: document.getElementById('conv-from-val'),
  fromUnit: document.getElementById('conv-from-unit'),
  toVal: document.getElementById('conv-to-val'),
  toUnit: document.getElementById('conv-to-unit'),
};

let currentConvType = 'length';

function populateConvUnits(type) {
  convElements.fromUnit.innerHTML = '';
  convElements.toUnit.innerHTML = '';
  Object.keys(convUnits[type]).forEach((unit) => {
    convElements.fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    convElements.toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
  });
  convElements.toUnit.value = Object.keys(convUnits[type])[1] || Object.keys(convUnits[type])[0];
  convert();
}

function convert() {
  const fromVal = parseFloat(convElements.fromVal.value);
  if (isNaN(fromVal)) {
    convElements.toVal.value = '';
    return;
  }

  const fromUnit = convElements.fromUnit.value;
  const toUnit = convElements.toUnit.value;
  const base = fromVal / convUnits[currentConvType][fromUnit];
  const result = base * convUnits[currentConvType][toUnit];
  convElements.toVal.value = result.toFixed(6).replace(/\.?0+$/, '');
}

convElements.tabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('tab')) {
    document.querySelectorAll('#conv-tabs .tab').forEach((t) => t.classList.remove('active'));
    e.target.classList.add('active');
    currentConvType = e.target.dataset.type;
    populateConvUnits(currentConvType);
  }
});

convElements.fromVal.addEventListener('input', convert);
convElements.fromUnit.addEventListener('change', convert);
convElements.toUnit.addEventListener('change', convert);

populateConvUnits('length');

// ═══════════════════════════════════════════════════════════════════
// COLOR PALETTE PICKER
// ═══════════════════════════════════════════════════════════════════

const colorElements = {
  baseColor: document.getElementById('base-color'),
  harmonyRadios: document.querySelectorAll('input[name="harmony"]'),
  genPaletteBtn: document.getElementById('gen-palette'),
  swatches: document.getElementById('palette-swatches'),
};

function hexToHSL(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h, s, l];
}

function hslToHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 1 / 6 && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 2 / 6 && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 3 / 6 && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 4 / 6 && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 5 / 6 && h < 1) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (val) => {
    const hex = Math.round((val + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function generatePalette() {
  const harmony = document.querySelector('input[name="harmony"]:checked').value;
  const [h, s, l] = hexToHSL(colorElements.baseColor.value);
  const palette = [colorElements.baseColor.value];

  if (harmony === 'complementary') {
    palette.push(hslToHex((h + 0.5) % 1, s, l));
  } else if (harmony === 'analogous') {
    palette.push(hslToHex((h + 0.0833) % 1, s, l));
    palette.push(hslToHex((h - 0.0833 + 1) % 1, s, l));
  } else if (harmony === 'triadic') {
    palette.push(hslToHex((h + 1 / 3) % 1, s, l));
    palette.push(hslToHex((h + 2 / 3) % 1, s, l));
  } else if (harmony === 'split') {
    palette.push(hslToHex((h + 0.333) % 1, s, l));
    palette.push(hslToHex((h + 0.833) % 1, s, l));
  }

  colorElements.swatches.innerHTML = palette
    .map(
      (hex, i) => `
    <div class="swatch" onclick="copyToClipboard('${hex}')">
      <div class="swatch-color" style="background: ${hex}"></div>
      <div class="swatch-hex">${hex}</div>
      <div class="swatch-copied"></div>
    </div>
  `
    )
    .join('');
}

function copyToClipboard(hex) {
  navigator.clipboard.writeText(hex);
  const swatch = event.currentTarget.querySelector('.swatch-copied');
  if (swatch) {
    swatch.textContent = '✓ Copied';
    setTimeout(() => (swatch.textContent = ''), 2000);
  }
}

colorElements.genPaletteBtn.addEventListener('click', generatePalette);
colorElements.baseColor.addEventListener('input', generatePalette);
colorElements.harmonyRadios.forEach((radio) => {
  radio.addEventListener('change', generatePalette);
});

generatePalette();

// ═══════════════════════════════════════════════════════════════════
// TIP CALCULATOR
// ═══════════════════════════════════════════════════════════════════

const tipElements = {
  bill: document.getElementById('tip-bill'),
  custom: document.getElementById('tip-custom'),
  pciBtns: document.querySelectorAll('.tip-pct-btn'),
  people: document.getElementById('tip-people'),
  perPerson: document.getElementById('tip-per-person'),
  totalPer: document.getElementById('tip-total-per'),
  grand: document.getElementById('tip-grand'),
};

let selectedTipPct = 20;

function calculateTip() {
  const bill = parseFloat(tipElements.bill.value) || 0;
  const pct = selectedTipPct;
  const peopleCount = parseInt(tipElements.people.value) || 1;

  const tipAmount = bill * (pct / 100);
  const total = bill + tipAmount;

  const tipPerPerson = tipAmount / peopleCount;
  const totalPerPerson = total / peopleCount;

  tipElements.perPerson.textContent = '$' + tipPerPerson.toFixed(2);
  tipElements.totalPer.textContent = '$' + totalPerPerson.toFixed(2);
  tipElements.grand.textContent = '$' + total.toFixed(2);
}

tipElements.pciBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    tipElements.pciBtns.forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    selectedTipPct = parseInt(e.target.dataset.pct);
    tipElements.custom.value = '';
    calculateTip();
  });
});

tipElements.custom.addEventListener('input', (e) => {
  if (e.target.value) {
    selectedTipPct = parseFloat(e.target.value) || 0;
    tipElements.pciBtns.forEach((btn) => btn.classList.remove('active'));
  }
  calculateTip();
});

tipElements.bill.addEventListener('input', calculateTip);
tipElements.people.addEventListener('input', calculateTip);

// ═══════════════════════════════════════════════════════════════════
// BMI CALCULATOR
// ═══════════════════════════════════════════════════════════════════

const bmiElements = {
  metricBtn: document.getElementById('bmi-metric-btn'),
  imperialBtn: document.getElementById('bmi-imperial-btn'),
  metricFields: document.getElementById('bmi-metric-fields'),
  imperialFields: document.getElementById('bmi-imperial-fields'),
  kg: document.getElementById('bmi-kg'),
  cm: document.getElementById('bmi-cm'),
  lbs: document.getElementById('bmi-lbs'),
  in: document.getElementById('bmi-in'),
  calcBtn: document.getElementById('bmi-calc'),
  result: document.getElementById('bmi-result'),
  gauge: document.getElementById('bmi-gauge'),
  valueDisplay: document.getElementById('bmi-value-display'),
  category: document.getElementById('bmi-category'),
};

function calculateBMI() {
  let bmi;
  if (bmiElements.metricBtn.classList.contains('active')) {
    const kg = parseFloat(bmiElements.kg.value);
    const cm = parseFloat(bmiElements.cm.value);
    if (!kg || !cm) return;
    bmi = kg / Math.pow(cm / 100, 2);
  } else {
    const lbs = parseFloat(bmiElements.lbs.value);
    const inches = parseFloat(bmiElements.in.value);
    if (!lbs || !inches) return;
    bmi = (lbs / Math.pow(inches, 2)) * 703;
  }

  let category = 'Underweight',
    categoryColor = '#60a5fa';
  if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight';
    categoryColor = '#4ade80';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    categoryColor = '#facc15';
  } else if (bmi >= 30) {
    category = 'Obese';
    categoryColor = '#f87171';
  }

  bmiElements.valueDisplay.textContent = bmi.toFixed(1);
  bmiElements.category.textContent = category;
  bmiElements.category.style.background = categoryColor + '33';
  bmiElements.category.style.color = categoryColor;

  drawBMIGauge(bmi, categoryColor);
  bmiElements.result.classList.remove('hidden');
}

function drawBMIGauge(bmi, color) {
  const ctx = bmiElements.gauge.getContext('2d');
  const w = bmiElements.gauge.width;
  const h = bmiElements.gauge.height;
  ctx.clearRect(0, 0, w, h);

  const centerX = w / 2;
  const centerY = h * 0.75;
  const radius = 100;

  // Background arc
  ctx.strokeStyle = 'rgba(255,255,255,.1)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
  ctx.stroke();

  // Color segments
  const segments = [
    { start: 0, end: 18.5, color: '#60a5fa', label: 'Low' },
    { start: 18.5, end: 25, color: '#4ade80', label: 'Healthy' },
    { start: 25, end: 30, color: '#facc15', label: 'High' },
    { start: 30, end: 40, color: '#f87171', label: 'Very High' },
  ];

  segments.forEach((seg) => {
    const ratio = Math.min(seg.end, 40) / 40;
    const start = Math.PI + ratio * Math.PI;
    const prev =
      Math.PI +
      Math.min(seg.end === 40 ? 40 : Math.max(0, seg.start), 40) / 40 *
        Math.PI;
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, start, prev, false);
    ctx.stroke();
  });

  // Needle
  const bmiClamped = Math.max(0, Math.min(bmi, 40));
  const needleAngle = Math.PI + (bmiClamped / 40) * Math.PI;
  const needleX = centerX + Math.cos(needleAngle) * (radius - 8);
  const needleY = centerY + Math.sin(needleAngle) * (radius - 8);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(needleX, needleY);
  ctx.stroke();

  // Center dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
  ctx.fill();
}

bmiElements.metricBtn.addEventListener('click', () => {
  bmiElements.metricBtn.classList.add('active');
  bmiElements.imperialBtn.classList.remove('active');
  bmiElements.metricFields.classList.remove('hidden');
  bmiElements.imperialFields.classList.add('hidden');
});

bmiElements.imperialBtn.addEventListener('click', () => {
  bmiElements.imperialBtn.classList.add('active');
  bmiElements.metricBtn.classList.remove('active');
  bmiElements.imperialFields.classList.remove('hidden');
  bmiElements.metricFields.classList.add('hidden');
});

bmiElements.calcBtn.addEventListener('click', calculateBMI);

// ═══════════════════════════════════════════════════════════════════
// QR CODE MAKER
// ═══════════════════════════════════════════════════════════════════

const qrElements = {
  input: document.getElementById('qr-input'),
  darkColor: document.getElementById('qr-dark'),
  lightColor: document.getElementById('qr-light'),
  size: document.getElementById('qr-size'),
  generateBtn: document.getElementById('qr-generate'),
  output: document.getElementById('qr-output'),
  wrap: document.getElementById('qr-canvas-wrap'),
  downloadBtn: document.getElementById('qr-download'),
};

qrElements.generateBtn.addEventListener('click', () => {
  const text = qrElements.input.value.trim();
  if (!text) {
    alert('Please enter a URL or text');
    return;
  }

  qrElements.wrap.innerHTML = '';
  QRCode.toCanvas(
    document.createElement('canvas'),
    text,
    {
      width: parseInt(qrElements.size.value),
      color: {
        dark: qrElements.darkColor.value,
        light: qrElements.lightColor.value,
      },
      margin: 1,
    },
    (err, canvas) => {
      if (err) {
        alert('Error generating QR code');
        return;
      }
      qrElements.wrap.appendChild(canvas);
      qrElements.output.classList.remove('hidden');
      qrElements.downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qrcode.png';
        link.click();
      });
    }
  );
});

// ═══════════════════════════════════════════════════════════════════
// DECISION WHEEL
// ═══════════════════════════════════════════════════════════════════

const wheelElements = {
  itemsList: document.getElementById('wheel-items-list'),
  newItemInput: document.getElementById('wheel-new-item'),
  addBtn: document.getElementById('wheel-add-btn'),
  resetBtn: document.getElementById('wheel-reset-btn'),
  canvas: document.getElementById('wheel-canvas'),
  spinBtn: document.getElementById('wheel-spin-btn'),
  resultDiv: document.getElementById('wheel-result'),
};

const defaultItems = ['Pizza', 'Tacos', 'Burger', 'Sushi', 'Salad', 'Pasta', 'Curry', 'Ramen'];
let wheelItems = [...defaultItems];
let isSpinning = false;
const colors = [
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#ffa500',
  '#95e1d3',
  '#f38181',
  '#aa96da',
  '#fcbad3',
];

function renderWheelItems() {
  wheelElements.itemsList.innerHTML = wheelItems
    .map(
      (item, i) => `
    <div class="wheel-item">
      <div class="wheel-item-dot" style="background: ${colors[i % colors.length]}"></div>
      <span class="wheel-item-label">${item}</span>
      <button class="wheel-item-del" onclick="deleteWheelItem(${i})">×</button>
    </div>
  `
    )
    .join('');
  drawWheel();
}

function deleteWheelItem(i) {
  wheelItems.splice(i, 1);
  if (wheelItems.length === 0) wheelItems = [...defaultItems];
  renderWheelItems();
}

function addWheelItem() {
  const val = wheelElements.newItemInput.value.trim();
  if (val && wheelItems.length < 20) {
    wheelItems.push(val);
    wheelElements.newItemInput.value = '';
    renderWheelItems();
  }
}

function resetWheel() {
  wheelItems = [...defaultItems];
  renderWheelItems();
}

function drawWheel() {
  const ctx = wheelElements.canvas.getContext('2d');
  const cx = wheelElements.canvas.width / 2;
  const cy = wheelElements.canvas.height / 2;
  const radius = 140;
  const sliceAngle = (Math.PI * 2) / wheelItems.length;

  ctx.clearRect(0, 0, wheelElements.canvas.width, wheelElements.canvas.height);

  wheelItems.forEach((item, i) => {
    const angle = i * sliceAngle;
    const nextAngle = (i + 1) * sliceAngle;
    const color = colors[i % colors.length];

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, nextAngle);
    ctx.lineTo(cx, cy);
    ctx.fillStyle = color;
    ctx.fill();

    // Draw border
    ctx.strokeStyle = 'rgba(0,0,0,.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, angle, nextAngle);
    ctx.stroke();

    // Draw text
    const textAngle = angle + sliceAngle / 2;
    const textX = cx + Math.cos(textAngle) * (radius * 0.65);
    const textY = cy + Math.sin(textAngle) * (radius * 0.65);

    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item, 0, 0);
    ctx.restore();
  });

  // Draw center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw arrow
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.moveTo(cx, 15);
  ctx.lineTo(cx - 10, 35);
  ctx.lineTo(cx + 10, 35);
  ctx.closePath();
  ctx.fill();
}

function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  wheelElements.spinBtn.disabled = true;

  const spins = 5 + Math.random() * 5;
  const randomIndex = Math.floor(Math.random() * wheelItems.length);
  const totalRotation = (Math.PI * 2) * spins + (randomIndex / wheelItems.length) * Math.PI * 2;

  let currentRotation = 0;
  const duration = 3000;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    currentRotation = totalRotation * easeOut;

    const ctx = wheelElements.canvas.getContext('2d');
    ctx.save();
    ctx.translate(wheelElements.canvas.width / 2, wheelElements.canvas.height / 2);
    ctx.rotate(currentRotation);
    ctx.translate(-wheelElements.canvas.width / 2, -wheelElements.canvas.height / 2);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      wheelElements.resultDiv.textContent = wheelItems[randomIndex];
      wheelElements.resultDiv.classList.remove('hidden');
      isSpinning = false;
      wheelElements.spinBtn.disabled = false;
    }
  }

  animate();
}

wheelElements.addBtn.addEventListener('click', addWheelItem);
wheelElements.newItemInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addWheelItem();
});
wheelElements.resetBtn.addEventListener('click', resetWheel);
wheelElements.spinBtn.addEventListener('click', spinWheel);

renderWheelItems();
