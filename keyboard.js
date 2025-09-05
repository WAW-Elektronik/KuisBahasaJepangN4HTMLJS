const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのまみむめもやゆよらりるれろわをんゃゅょっー';
const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノマミムメモヤユヨラリルレロワヲンャュョッー';
const kanjiN5 = '日一国会人年大十二本中長出三時行見月後前生五間上東四今金九入学高円子外八六下来気小七山話女北午百書先名川千水半男西電校語土木聞食車何南万毎白天母火右読友左休父雨';
const kanjiN4 = '見探遅間拾連片飼走見聞開建飛売踊選通参誘開閉点消壊割折破汚付外止間落掛拭取片指倒燃張掛飾並植戻仕決予復生夢目続見取受申休残卒閉運成試試雨晴曇熱風冷道道試無火怪咳困宝逃騒諦投守式会伝車席戻電起助歯組折忘醤鍵質傘載火煮煮経花色困丸病故入交仲事故仕食チ運利褒叱誘招頼注盗踏壊汚行輸輸翻発発家眠彫旅育運入退電電鍵嘘お整判似世時喧答倒通死安喧離太痩操伺西合数測確出到酔問相積動手上下親助包沸混計並ボ広割注輸輸値値紐ボ荷謝知泣笑眠滑事調嫌別信知楽優目鳴渡帰荷大焼肉向転風亡音味匂婚知世届録楽利会過召挨熱失目進開受参申拝存伺用緊夢応感迷生';


function showKeyboardOptions(textarea, fieldId, index) {
  const containerId = `keyboard-container-${fieldId}-${index}`;
  const container = document.getElementById(containerId);

  if (!container.hasChildNodes()) { // only create container if it doesn't exist
    container.style.position = "relative";
    container.innerHTML = `
      <div style="position:absolute; left:0; top:0; background:#f0f0f0; border:1px solid #ccc; padding:6px; z-index:10;">
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          <button onclick="loadKeyboard('${containerId}', '${textarea.id}', 'hiragana')">Hiragana</button>
          <button onclick="loadKeyboard('${containerId}', '${textarea.id}', 'katakana')">Katakana</button>
          <button onclick="loadKeyboard('${containerId}', '${textarea.id}', 'kanjiN5')">KanjiN5</button>
          <button onclick="loadKeyboard('${containerId}', '${textarea.id}', 'kanjiN4')">KanjiN4</button>
          <button onclick="removeKeyboard('${containerId}')">❌</button>
        </div>
        <div class="keyboard-box" id="${containerId}-box"
             style="max-width: 300px; max-height: 400px; display:flex; flex-wrap:wrap; overflow-y:auto; background:#fff; padding:4px;">
        </div>

      </div>
    `;
  }
}

function loadKeyboard(containerId, textareaId, type) {
  let charList = '';
  if (type === 'hiragana') charList = hiragana;
  else if (type === 'katakana') charList = katakana;
  else if (type === 'kanjiN5') charList = kanjiN5;
  else if (type === 'kanjiN4') charList = kanjiN4;

  const targetBox = document.getElementById(`${containerId}-box`);
  targetBox.innerHTML = charList.split('').map(c =>
    `<button type="button" onclick="insertChar('${textareaId}', '${c}')">${c}</button>`
  ).join('');
}

function insertChar(textareaId, char) {
  const ta = document.getElementById(textareaId);
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  ta.value = ta.value.substring(0, start) + char + ta.value.substring(end);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = start + 1;
  // Note: do NOT call any container removal here
}

function removeKeyboard(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

// function removeAllKeyboards() {
//   document.querySelectorAll("[id^=keyboard-container-]").forEach(div => {
//     div.innerHTML = '';
//   });
// }


