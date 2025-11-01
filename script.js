let soalDipilih = [];
let jumlahMaksSoal = 100; // nilai awal default, nanti ditimpa

const subkategoriMap = {
  KataKerja: {
    'Bentuk Kata Kerja': 'data/KataKerja/KataKerjaN4Perubahan.js',
    'Bentuk Kata Kerja from Nihongonice': 'data/KataKerja/KataKerjaN4PerubahanNihongonice.js',
    'Arti Kata Kerja': 'data/KataKerja/KataKerjaN4Arti.js',
    'Arti Kata Kerja Sonkeigo': 'data/KataKerja/KataKerjaN4ArtiSonkeigo.js',
    'Arti Kata Kerja Kenjougo': 'data/KataKerja/KataKerjaN4ArtiKenjougo.js',
    'Arti ke Hiragana Kata Kerja': 'data/KataKerja/KataKerjaN4ArtiHiragana.js',
    'Arti ke Kanji Kata Kerja': 'data/KataKerja/KataKerjaN4ArtiKanji.js',
    'Arti Kata Kerja from Nihongonice': 'data/KataKerja/KataKerjaN4ArtiNihongonice.js',
    'Arti Kata Kerja Transitif Intransitif': 'data/KataKerja/KataKerjaN4TransitifIntransitifArti.js',
    'Arti ke Hiragana Kata Kerja Transitif Intransitif': 'data/KataKerja/KataKerjaN4TransitifIntransitifArtiHiragana.js',
    'Arti ke Kanji Kata Kerja Transitif Intransitif': 'data/KataKerja/KataKerjaN4TransitifIntransitifArtiKanji.js',
    'Pilihan Ganda Kata Kerja': 'data/KataKerja/KataKerjaN4PilihanGanda.js',
    'Pilihan Ganda Kata Kerja Kanji': 'data/KataKerja/KataKerjaN4PilihanGandaKanji.js',
    'Pilihan Ganda Kata Kerja from Nihongonice': 'data/KataKerja/KataKerjaN4PilihanGandaNihongonice.js',
  },
  KataSifat: {
    'Arti Kata Sifat': 'data/KataSifat/I_KeIndonesia.js'
  },
  KataBenda: {
    'Arti Kata Benda': 'data/KataBenda/ArtiKeIndonesia.js'
  },
  KataKeterangan: {
    'Arti Kata Keterangan': 'data/KataKeterangan/KataKeteranganN4arti.js'
  },
  KotobaBilangannKataBantuBilangan: {
    'KBB': 'data/KotobaBilangannKataBantuBilangan/KataBantuBilangan.js',
    'Arti KB Dai': 'data/KotobaBilangannKataBantuBilangan/PenulisanKBDai.js',
    'Arti Kotoba Tanggal': 'data/KotobaBilangannKataBantuBilangan/KotobaTanggal.js',
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
    } else if (window.soalKataBantuBilangan) {
      jumlahMaksSoal = window.soalKataBantuBilangan.length;
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

function tampilkanInformasi() {
  const dialog = document.getElementById("dialogInformasi");
  if (dialog) {
    dialog.showModal();
  } else {
    alert("Dialog informasi tidak ditemukan.");
  }
}

function tutupInformasi() {
  const dialog = document.getElementById("dialogInformasi");
  if (dialog) {
    dialog.close();
  }
}

function mulaiKuis() {
  const jumlah = parseInt(document.getElementById('jumlahSoal').value);
  const pathFile = document.getElementById('kategoriSub').value;
  const acak = document.getElementById('acakSoal').checked;
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
  delete window.soalKataBantuBilangan;

  const existingScripts = document.querySelectorAll('script[src^="data/"]');
  existingScripts.forEach(s => s.remove());

  const script = document.createElement('script');
  script.src = pathFile + '?v=' + Date.now();
  script.onload = () => {
    const ambilSoal = (arr) => {
      const salin = [...arr];

      if (acak) {
        return salin.sort(() => 0.5 - Math.random()).slice(0, jumlah);
      } else {
        const mulai = parseInt(document.getElementById('soalMulai').value) - 1;
        const akhir = parseInt(document.getElementById('soalAkhir').value) - (parseInt(document.getElementById('soalAkhir').value) - parseInt(document.getElementById('jumlahSoal').value));
        if (mulai < 0 || akhir > arr.length || mulai >= akhir) {
          alert(`Rentang soal tidak valid. Harus antara 1 sampai ${arr.length}.`);
          return [];
        }
        return salin.slice(mulai, akhir);
      }
    };

    if (window.soalKuis && 'bentukTe' in window.soalKuis[0]) {
      soalDipilih = ambilSoal(window.soalKuis);
      tampilkanSoalBentuk(kuis);

    } else if (window.soalKuisArti && 'jawaban' in window.soalKuisArti[0]) {
      soalDipilih = ambilSoal(window.soalKuisArti);
      tampilkanSoalArti(kuis);

    } else if (window.questions && 'opsi' in window.questions[0]) {
      soalDipilih = ambilSoal(window.questions);
      tampilkanSoalPilihanGanda(kuis);

    } else if (window.soalKataBantuBilangan && 'KBBPenyebutan' in window.soalKataBantuBilangan[0]) {
      soalDipilih = ambilSoal(window.soalKataBantuBilangan);
      tampilkanSoalKataBantuBilangan(kuis);

    }else {
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
      ${generateFieldBentuk(i, "bentukTe", "~て")}
      ${generateFieldBentuk(i, "bentukTa", "~た")}
      ${generateFieldBentuk(i, "bentukU", "~う")}
      ${generateFieldBentuk(i, "bentukMasu", "~ます")}
      ${generateFieldBentuk(i, "bentukNai", "~ない")}
      ${generateFieldBentuk(i, "bentukVolitional", "~よう")}
      ${generateFieldBentuk(i, "bentukImperative", "命令形")}
      ${generateFieldBentuk(i, "bentukConditional", "仮定形")}
      <button onclick="periksaSatu(${i})">Cek Semua Bentuk (Soal Ini)</button>
      <div id="hasil-${i}"></div>
    `;//<div id="keyboard-container-${id}-${i}"></div> --> untuk menampilkan keyboard di soal bentuk (ada di generateFieldBentuk) 
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
      <div id="keyboard-container-arti-${i}"></div>
    `;//<div id="keyboard-container-arti-${i}"></div> --> untuk menampilkan keyboard di soal arti
    kuis.appendChild(div);
  });
}

function tampilkanSoalKataBantuBilangan(kuis) {
  soalDipilih.forEach((soal, i) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `
      <b>${i + 1}. ${soal.pertanyaan}</b><br><br>
      ${generateFieldKataBantuBilangan(i, "KBBPenyebutan", "Penyebutan")}
      ${generateFieldKataBantuBilangan(i, "KBBObjek", "Objek")}
      <button onclick="periksaSatuKBB(${i})">Cek Semua KBB (Soal Ini)</button>
      <div id="hasilKBB-${i}"></div>
    `;//<div id="keyboard-container-${id}-${i}"></div> --> untuk menampilkan keyboard di soal bentuk (ada di generateFieldBentuk) 
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


function generateFieldBentuk(i, bentuk, label) {
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

function generateFieldKataBantuBilangan(i, KBB, label) {
  const id = getFieldIdFromKBB(KBB);
  return `
    <label>${label}: 
      <textarea id="${id}-${i}" onfocus="showKeyboardOptions(this, '${id}', ${i})"></textarea>
      <button onclick="cekSatuKBB(${i}, '${KBB}')">Cek</button>
      <span id="feedback-${id}-${i}"></span>
    </label><br>
    <div id="keyboard-container-${id}-${i}"></div>
  `;
}

function cekSatuKBB(i, KBB) {
  const soal = soalDipilih[i];
  const id = getFieldIdFromKBB(KBB);
  const inputId = `${id}-${i}`;
  const input = document.getElementById(inputId).value.trim();
  const kunci = soal[KBB];
  const feedback = document.getElementById(`feedback-${id}-${i}`);

  if (input === kunci) {
    feedback.innerHTML = `<span class="correct-answer">✅</span>`;
  } else {
    feedback.innerHTML = `<span class="wrong-answer">❌ ${kunci}</span>`;
  }
}

function periksaSatuKBB(i) {
  const soal = soalDipilih[i];
  let skor = 0;
  const KBBList = [
    "KBBPenyebutan", "KBBObjek"
  ];

  KBBList.forEach(KBB => {
    const id = getFieldIdFromKBB(KBB);
    const input = document.getElementById(`${id}-${i}`).value.trim();
    if (input === soal[KBB]) skor++;
  });

  document.getElementById(`hasilKBB-${i}`).innerText = `Skor soal ini: ${skor} / 2`;
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
    
    else if ('KBB' in soal) {
      const KBBList = [
        "KBBPenyebutan", "KBBObjek"
      ];
      KBBList.forEach(KBB => {
        const id = getFieldIdFromKBB(KBB);
        const input = document.getElementById(`${id}-${i}`).value.trim();
        if (input === soal[KBB]) total++;
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

function getFieldIdFromKBB(KBB) {
  return {
    KBBPenyebutan: 'Penyebutan',
    KBBObjek: 'Objek'
  }[KBB];
}

function cekPerKBB() {
  const KBB = document.getElementById('KBBCek').value;
  let benar = 0;

  soalDipilih.forEach((soal, i) => {
    const id = getFieldIdFromKBB(KBB);
    const input = document.getElementById(`${id}-${i}`).value.trim();
    if (input === soal[KBB]) {
      benar++;
      document.getElementById(`${id}-${i}`).style.backgroundColor = '#c2f5c2'; // hijau terang
    } else {
      document.getElementById(`${id}-${i}`).style.backgroundColor = '#f5c2c2'; // merah terang
    }
  });

  const total = soalDipilih.length;
  const persentase = Math.round((benar / total) * 100);
  alert(`KBB: ${KBB}\nBenar: ${benar} / ${total} (${persentase}%)`);
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

    if ('KBBPenyebutan' in soal) {
      const KBBList = [
        "KBBPenyebutan", "KBBObjek"
      ];
      KBBList.forEach(KBB => {
        const id = getFieldIdFromKBB(KBB);
        const inputEl2 = document.getElementById(`${id}-${i}`);
        const feedbackEl2 = document.getElementById(`feedback-${id}-${i}`);
        if (inputEl2) {
          inputEl2.value = '';
          inputEl2.style.backgroundColor = '';
        }
        if (feedbackEl2) {
          feedbackEl2.innerHTML = '';
        }
      });
      const hasilDiv2 = document.getElementById(`hasilKBB-${i}`);
      if (hasilDiv2) hasilDiv2.innerText = '';
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
    const opsiAsli = soal.opsi.map((opt, idx) => ({ opt, idx }));
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

document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const active = document.activeElement;

    if (!active) return;

    // --- Soal Bentuk ---
    if (active.id.match(/^(te|ta|u|masu|nai|vol|imp|cond)-\d+$/)) {
      e.preventDefault(); // jangan newline di textarea
      const [id, i] = active.id.split('-');
      const bentukMap = {
        te: 'bentukTe',
        ta: 'bentukTa',
        u: 'bentukU',
        masu: 'bentukMasu',
        nai: 'bentukNai',
        vol: 'bentukVolitional',
        imp: 'bentukImperative',
        cond: 'bentukConditional'
      };
      cekSatuBentuk(parseInt(i), bentukMap[id]);
    }

    else if (active.id.match(/^(Penyebutan|Objek)-\d+$/)) {
      e.preventDefault(); // jangan newline di textarea
      const [id, i] = active.id.split('-');
      const bentukMap = {
        Penyebutan: 'KBBPenyebutan',
        Objek: 'KBBObjek',
      };
      cekSatuKBB(parseInt(i), bentukMap[id]);
    }

    // --- Soal Arti ---
    else if (active.id.match(/^arti-\d+$/)) {
      e.preventDefault();
      const i = parseInt(active.id.split('-')[1]);
      cekArti(i);
    }

    // --- Soal Pilihan Ganda ---
    else if (active.name && active.name.startsWith('pg-')) {
      e.preventDefault();
      const i = parseInt(active.name.split('-')[1]);
      const soal = soalDipilih[i];
      if (soal && typeof soal.jawaban_index !== 'undefined') {
        cekPilihanGanda(i, soal.jawaban_index);
      }
    }
  }
  else if (e.key === 'Escape') {
    const active = document.activeElement;
    if (!active) return;

    // --- Soal Bentuk ---
    if (active.id.match(/^(te|ta|u|masu|nai|vol|imp|cond)-\d+$/)) {
      const [id, i] = active.id.split('-');
      const feedback = document.getElementById(`feedback-${id}-${i}`);
      if (feedback && feedback.innerHTML.trim() !== "") {
        e.preventDefault();
        document.getElementById(`keyboard-container-${id}-${i}`).innerHTML = "";
      }
    }

    if (active.id.match(/^(Penyebutan|Objek)-\d+$/)) {
      const [id, i] = active.id.split('-');
      const feedback = document.getElementById(`feedback-${id}-${i}`);
      if (feedback && feedback.innerHTML.trim() !== "") {
        e.preventDefault();
        document.getElementById(`keyboard-container-${id}-${i}`).innerHTML = "";
      }
    }

    // --- Soal Arti ---
    else if (active.id.match(/^arti-\d+$/)) {
      const i = parseInt(active.id.split('-')[1]);
      const feedback = document.getElementById(`feedback-arti-${i}`);
      if (feedback && feedback.innerHTML.trim() !== "") {
        e.preventDefault();
        document.getElementById(`keyboard-container-arti-${i}`).innerHTML = "";
      }
    }
  }
});

