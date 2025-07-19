const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのまみむめもやゆよらりるれろわをんゃゅょっー';
const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノマミムメモヤユヨラリルレロワヲンャュョッー';
const kanji = '日一国会人年大十二本中長出三時行見月後前生五間上東四今金九入学高円子外八六下来気小七山話女北午百書先名川千水半男西電校語土木聞食車何南万毎白天母火右読友左休父雨';

function showKeyboardOptions(textarea, fieldId, index) {
  removeAllKeyboards(); // Hapus semua keyboard sebelum tampil baru

  const containerId = `keyboard-container-${fieldId}-${index}`;
  const container = document.getElementById(containerId);

  container.style.position = "relative";
  container.innerHTML = `
    <div style="position:absolute; right:0; top:0; background:#f0f0f0; border:1px solid #ccc; padding:6px; z-index:10;">
      <div style="margin-bottom:5px;">
        <button onclick="loadKeyboard('${containerId}', '${textarea.id}', 'hiragana')">Hiragana</button>
        <button onclick="loadKeyboard('${containerId}', '${textarea.id}', 'katakana')">Katakana</button>
        <button onclick="loadKeyboard('${containerId}', '${textarea.id}', 'kanji')">Kanji</button>
        <button onclick="removeKeyboard('${containerId}')">❌</button>
      </div>
      <div class="keyboard-box" id="${containerId}-box" style="max-width: 250px; display:flex; flex-wrap:wrap;"></div>
    </div>
  `;
}

function removeKeyboard(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

function removeAllKeyboards() {
  document.querySelectorAll("[id^=keyboard-container-]").forEach(div => {
    div.innerHTML = '';
  });
}

function loadKeyboard(containerId, textareaId, type) {
  let charList = '';
  if (type === 'hiragana') charList = hiragana;
  else if (type === 'katakana') charList = katakana;
  else if (type === 'kanji') charList = kanji;

  const targetBox = document.getElementById(`${containerId}-box`);
  targetBox.innerHTML = charList.split('').map(c =>
    `<button onclick="insertChar('${textareaId}', '${c}')">${c}</button>`
  ).join('');
}

function insertChar(textareaId, char) {
  const ta = document.getElementById(textareaId);
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  ta.value = ta.value.substring(0, start) + char + ta.value.substring(end);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = start + 1;
}
