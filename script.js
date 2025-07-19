let soalDipilih = [];
let jumlahMaksSoal = 100; // nilai awal default, nanti ditimpa

const subkategoriMap = {
  KataKerja: {
    'Bentuk Kata Kerja': 'data/KataKerja/KataKerjaN4Perubahan.js',
    'Arti Kata Kerja': 'data/KataKerja/KataKerjaN4Arti.js',
    'Pilihan Ganda Kata Kerja': 'data/KataKerja/KataKerjaN4PilihanGanda.js'
  },
  KataSifat: {
    'Arti Kata Sifat': 'data/KataSifat/I_KeIndonesia.js'
  },
  KataBenda: {
    'Arti Kata Benda': 'data/KataBenda/ArtiKeIndonesia.js'
  }
};

function updateSubkategori() {
  const utama = document.getElementById('kategoriUtama').value;
  const sub = document.getElementById('kategoriSub');
  sub.innerHTML = '<option value="">-- Pilih Subkategori --</option>';

  if (subkategoriMap[utama]) {
    for (let nama in subkategoriMap[utama]) {
      const option = document.createElement('option');
      option.textContent = nama;
      option.value = subkategoriMap[utama][nama];
      sub.appendChild(option);
    }
  }
}

function terapkanKategori() {
  const pathFile = document.getElementById('kategoriSub').value;
  if (!pathFile) {
    alert("Silakan pilih subkategori.");
    return;
  }

  const existingScripts = document.querySelectorAll('script[src^="data/"]');
  existingScripts.forEach(s => s.remove());

  const script = document.createElement('script');
  script.src = pathFile;
  script.onload = () => {
    if (window.soalKuis) {
      jumlahMaksSoal = window.soalKuis.length;
    } else if (window.soalKuisArti) {
      jumlahMaksSoal = window.soalKuisArti.length;
    } else if (window.questions) {
      jumlahMaksSoal = window.questions.length;
    } else {
      alert("Data soal tidak ditemukan.");
      jumlahMaksSoal = 100;
    }

    const inputJumlah = document.getElementById('jumlahSoal');
    inputJumlah.max = jumlahMaksSoal;
    if (parseInt(inputJumlah.value) > jumlahMaksSoal) {
      inputJumlah.value = jumlahMaksSoal;
    }

    alert(`Kategori dimuat. Maksimal ${jumlahMaksSoal} soal.`);
  };

  document.body.appendChild(script);
}

function setMinJumlah() {
  document.getElementById('jumlahSoal').value = 1;
}

function setMaxJumlah() {
  document.getElementById('jumlahSoal').value = jumlahMaksSoal;
}

function mulaiKuis() {
  const jumlah = parseInt(document.getElementById('jumlahSoal').value);
  const pathFile = document.getElementById('kategoriSub').value;
  const kuis = document.getElementById('kuisContainer');
  kuis.innerHTML = '';
  document.getElementById('skor').innerText = '';

  if (!pathFile) {
    alert("Silakan pilih subkategori.");
    return;
  }

  // Bersihkan variabel global
  delete window.soalKuis;
  delete window.soalKuisArti;
  delete window.questions;


  // Pastikan ulang soal sesuai file
  const existingScripts = document.querySelectorAll('script[src^="data/"]');
  existingScripts.forEach(s => s.remove());

  const script = document.createElement('script');
  script.src = pathFile + '?v=' + Date.now(); // Hindari cache
  script.onload = () => {
  // Soal bentuk
  if (window.soalKuis && 'bentukTe' in window.soalKuis[0]) {
    soalDipilih = [...window.soalKuis].sort(() => 0.5 - Math.random()).slice(0, jumlah);
    tampilkanSoalBentuk(kuis);

  // Soal arti (dengan { pertanyaan, jawaban })
  } else if (window.soalKuisArti && 'jawaban' in window.soalKuisArti[0]) {
    soalDipilih = [...window.soalKuisArti].sort(() => 0.5 - Math.random()).slice(0, jumlah);
    tampilkanSoalArti(kuis);

  // Soal pilihan ganda
  } else if (window.questions && 'opsi' in window.questions[0]) {
    soalDipilih = [...window.questions].sort(() => 0.5 - Math.random()).slice(0, jumlah);
    tampilkanSoalPilihanGanda(kuis);

  } else {
    alert("Struktur soal tidak dikenali.");
  }
};
  document.body.appendChild(script);
}

function tampilkanSoalBentuk(kuis) {
  soalDipilih.forEach((soal, i) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `
      <b>${i + 1}. ${soal.pertanyaan}</b><br><br>
      ${generateField(i, "bentukTe", "~て")}
      ${generateField(i, "bentukTa", "~た")}
      ${generateField(i, "bentukU", "~う")}
      ${generateField(i, "bentukMasu", "~ます")}
      ${generateField(i, "bentukNai", "~ない")}
      ${generateField(i, "bentukVolitional", "~よう")}
      ${generateField(i, "bentukImperative", "命令形")}
      ${generateField(i, "bentukConditional", "仮定形")}
      <button onclick="periksaSatu(${i})">Cek Semua Bentuk (Soal Ini)</button>
      <div id="hasil-${i}"></div>
    `;
    kuis.appendChild(div);
  });
}

function tampilkanSoalArti(kuis) {
  soalDipilih.forEach((soal, i) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `
      <b>${i + 1}. ${soal.pertanyaan}</b><br>
      <textarea id="arti-${i}" onfocus="showKeyboardOptions(this, 'arti', ${i})"></textarea>
      <button onclick="cekArti(${i})">Cek</button>
      <span id="feedback-arti-${i}"></span>
    `;
    kuis.appendChild(div);
  });
}

function cekPilihanGanda(i, jawaban_index) {
  const selected = document.querySelector(`input[name="pg-${i}"]:checked`);
  const feedback = document.getElementById(`feedback-pg-${i}`);
  const soal = soalDipilih[i];  // Ambil soal saat ini

  if (!selected) {
    feedback.innerHTML = "<span class='wrong-answer'>❌ Pilih dulu</span>";
    return;
  }

  if (parseInt(selected.value) === jawaban_index) {
    feedback.innerHTML = "<span class='correct-answer'>✅</span>";
  } else {
    const jawabanBenar = soal.opsi[jawaban_index];  // Ambil teks jawaban dari indeks benar
    feedback.innerHTML = `<span class='wrong-answer'>❌ Jawaban yang benar: <b>${jawabanBenar}</b></span>`;
  }
}


function generateField(i, bentuk, label) {
  const id = getFieldIdFromBentuk(bentuk);
  return `
    <label>${label}: 
      <textarea id="${id}-${i}" onfocus="showKeyboardOptions(this, '${id}', ${i})"></textarea>
      <button onclick="cekSatuBentuk(${i}, '${bentuk}')">Cek</button>
      <span id="feedback-${id}-${i}"></span>
    </label><br>
    <div id="keyboard-container-${id}-${i}"></div>
  `;
}

function cekSatuBentuk(i, bentuk) {
  const soal = soalDipilih[i];
  const id = getFieldIdFromBentuk(bentuk);
  const inputId = `${id}-${i}`;
  const input = document.getElementById(inputId).value.trim();
  const kunci = soal[bentuk];
  const feedback = document.getElementById(`feedback-${id}-${i}`);

  if (input === kunci) {
    feedback.innerHTML = `<span class="correct-answer">✅</span>`;
  } else {
    feedback.innerHTML = `<span class="wrong-answer">❌ ${kunci}</span>`;
  }
}

function periksaSatu(i) {
  const soal = soalDipilih[i];
  let skor = 0;
  const bentukList = [
    "bentukTe", "bentukTa", "bentukU", "bentukMasu",
    "bentukNai", "bentukVolitional", "bentukImperative", "bentukConditional"
  ];

  bentukList.forEach(bentuk => {
    const id = getFieldIdFromBentuk(bentuk);
    const input = document.getElementById(`${id}-${i}`).value.trim();
    if (input === soal[bentuk]) skor++;
  });

  document.getElementById(`hasil-${i}`).innerText = `Skor soal ini: ${skor} / 8`;
}

function periksaJawaban() {
  let total = 0;
  let maks = 0;

  soalDipilih.forEach((soal, i) => {
    // Periksa bentuk kata kerja
    if ('bentukTe' in soal) {
      const bentukList = [
        "bentukTe", "bentukTa", "bentukU", "bentukMasu",
        "bentukNai", "bentukVolitional", "bentukImperative", "bentukConditional"
      ];
      bentukList.forEach(bentuk => {
        const id = getFieldIdFromBentuk(bentuk);
        const input = document.getElementById(`${id}-${i}`).value.trim();
        if (input === soal[bentuk]) total++;
      });
      maks += 8;
    }

    // Periksa soal arti
    else if ('jawaban' in soal && !('opsi' in soal)) {
      const input = document.getElementById(`arti-${i}`).value.trim();
      if (input === soal.jawaban) total++;
      maks++;
    }

    // Periksa soal pilihan ganda
    else if ('opsi' in soal) {
      const radios = document.getElementsByName(`pg-${i}`);
      let jawabanUser = -1;
      radios.forEach(r => {
        if (r.checked) jawabanUser = parseInt(r.value);
      });
      if (jawabanUser === soal.jawaban_index) total++;
      maks++;
    }
  });

  document.getElementById('skor').innerText = `Total Skor: ${total} / ${maks}`;
}

/*function cekPerBentuk() {
  const bentuk = document.getElementById('bentukCek').value;
  let benar = 0;

  soalDipilih.forEach((soal, i) => {
    const id = getFieldIdFromBentuk(bentuk);
    const input = document.getElementById(`${id}-${i}`).value.trim();
    if (input === soal[bentuk]) benar++;
  });

  alert(`Benar untuk ${bentuk}: ${benar} / ${soalDipilih.length}`);
}*/

function getFieldIdFromBentuk(bentuk) {
  return {
    bentukTe: 'te',
    bentukTa: 'ta',
    bentukU: 'u',
    bentukMasu: 'masu',
    bentukNai: 'nai',
    bentukVolitional: 'vol',
    bentukImperative: 'imp',
    bentukConditional: 'cond'
  }[bentuk];
}

function cekPerBentuk() {
  const bentuk = document.getElementById('bentukCek').value;
  let benar = 0;

  soalDipilih.forEach((soal, i) => {
    const id = getFieldIdFromBentuk(bentuk);
    const input = document.getElementById(`${id}-${i}`).value.trim();
    if (input === soal[bentuk]) {
      benar++;
      document.getElementById(`${id}-${i}`).style.backgroundColor = '#c2f5c2'; // hijau terang
    } else {
      document.getElementById(`${id}-${i}`).style.backgroundColor = '#f5c2c2'; // merah terang
    }
  });

  const total = soalDipilih.length;
  const persentase = Math.round((benar / total) * 100);
  alert(`Bentuk: ${bentuk}\nBenar: ${benar} / ${total} (${persentase}%)`);
}

function cekArti(i) {
  const input = document.getElementById(`arti-${i}`).value.trim();
  const kunci = soalDipilih[i].jawaban;
  const feedback = document.getElementById(`feedback-arti-${i}`);
  if (input === kunci) {
    feedback.innerHTML = `<span class="correct-answer">✅</span>`;
  } else {
    feedback.innerHTML = `<span class="wrong-answer">❌ ${kunci}</span>`;
  }
}

function resetJawaban() {
  soalDipilih.forEach((soal, i) => {
    // Reset untuk soal bentuk
    if ('bentukTe' in soal) {
      const bentukList = [
        "bentukTe", "bentukTa", "bentukU", "bentukMasu",
        "bentukNai", "bentukVolitional", "bentukImperative", "bentukConditional"
      ];
      bentukList.forEach(bentuk => {
        const id = getFieldIdFromBentuk(bentuk);
        const inputEl = document.getElementById(`${id}-${i}`);
        const feedbackEl = document.getElementById(`feedback-${id}-${i}`);
        if (inputEl) {
          inputEl.value = '';
          inputEl.style.backgroundColor = '';
        }
        if (feedbackEl) {
          feedbackEl.innerHTML = '';
        }
      });
      const hasilDiv = document.getElementById(`hasil-${i}`);
      if (hasilDiv) hasilDiv.innerText = '';
    }

    // Reset untuk soal arti (textarea)
    if ('jawaban' in soal && !('opsi' in soal)) {
      const input = document.getElementById(`arti-${i}`);
      const feedback = document.getElementById(`feedback-arti-${i}`);
      if (input) input.value = '';
      if (feedback) feedback.innerHTML = '';
    }

    // Reset untuk soal pilihan ganda
    if ('opsi' in soal) {
      soal.opsi.forEach((_, j) => {
        const radio = document.getElementById(`opsi-${i}-${j}`);
        if (radio) radio.checked = false;
      });
      const feedback = document.getElementById(`feedback-pg-${i}`);
      if (feedback) feedback.innerHTML = '';
    }
  });

  document.getElementById('skor').innerText = '';
  removeAllKeyboards(); // Tutup semua keyboard
}


function acakUlangSoal() {
  const jumlah = soalDipilih.length; // Ambil jumlah soal saat ini
  document.getElementById('jumlahSoal').value = jumlah;
  mulaiKuis(); // Muat ulang soal secara acak
}

function shuffleOpsiPilihanGanda(soal) {
  const opsiAsli = soal.opsi;
  const jawabanBenar = opsiAsli[soal.jawaban_index];

  // Acak opsinya
  const opsiAcak = [...opsiAsli].sort(() => 0.5 - Math.random());
  soal.opsi = opsiAcak;
  soal.jawaban_index = opsiAcak.indexOf(jawabanBenar); // perbarui indeks jawaban benar
}

function tampilkanSoalPilihanGanda(kuis) {
  soalDipilih.forEach((soal, i) => {
    // Acak pilihan jawaban
    const opsiAsli = soal.opsi.map((opt, idx) => ({opt, idx}));
    const opsiAcak = opsiAsli.sort(() => 0.5 - Math.random());

    const opsiHtml = opsiAcak.map((item, j) => `
      <label>
        <input type="radio" name="pg-${i}" value="${item.idx}">
        ${item.opt}
      </label><br>
    `).join('');

    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `
      <b>${i + 1}. ${soal.pertanyaan}</b><br>
      ${opsiHtml}
      <button onclick="cekPilihanGanda(${i}, ${soal.jawaban_index})">Cek</button>
      <span id="feedback-pg-${i}"></span>
    `;
    kuis.appendChild(div);
  });
}

document.getElementById('jumlahSoal').addEventListener('input', function () {
  const max = parseInt(this.max);
  if (parseInt(this.value) > max) {
    this.value = max;
  }
});