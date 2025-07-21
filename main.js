// 註冊 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// 簡單的分頁切換
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById('view-' + btn.dataset.view).classList.remove('hidden');
  });
});

// 1. 日曆產生函式
function generateCalendar(date = new Date()) {
  const calendarEl = document.getElementById('calendar');
  calendarEl.innerHTML = '';     // 清空
  const year = date.getFullYear();
  const month = date.getMonth();

  // 建立表格
  const table = document.createElement('table');
  table.classList.add('calendar-table');

  // 1.1 建表頭：星期
  const weekdays = ['日','一','二','三','四','五','六'];
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  weekdays.forEach(w => {
    const th = document.createElement('th');
    th.textContent = w;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  // 1.2 建表身：日期格子
  const tbody = document.createElement('tbody');
  // 當月第一天星期幾
  const firstDay = new Date(year, month, 1).getDay();
  // 當月一共有幾天
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let row = document.createElement('tr');
  // 補空格
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }
  // 填日期
  for (let day = 1; day <= daysInMonth; day++) {
    if (row.children.length === 7) {
      tbody.appendChild(row);
      row = document.createElement('tr');
    }
    const cell = document.createElement('td');
    cell.textContent = day;
    row.appendChild(cell);
  }
  // 最後一行補空格
  while (row.children.length < 7) {
    row.appendChild(document.createElement('td'));
  }
  tbody.appendChild(row);
  table.appendChild(tbody);

  calendarEl.appendChild(table);
}

// 2. 初始化載入時就畫一次
window.addEventListener('load', () => {
  generateCalendar();
});

// 3. 在分頁切換時，如果是日曆，就再畫一次
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.view === 'calendar') {
      generateCalendar();
    }
  });
});
let currentDate = new Date();

// 1. 日曆產生函式
function generateCalendar(date = new Date()) {
  currentDate = date;
  const calendarEl = document.getElementById('calendar');
  const titleEl    = document.getElementById('calendar-title');
  calendarEl.innerHTML = '';

  const year  = date.getFullYear();
  const month = date.getMonth(); // 0-based
  // 更新標題
  titleEl.textContent = `${year} 年 ${month + 1} 月`;

  // 產生表格（同之前）
  const table = document.createElement('table');
  table.classList.add('calendar-table');

  const weekdays = ['日','一','二','三','四','五','六'];
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  weekdays.forEach(w => {
    const th = document.createElement('th');
    th.textContent = w;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth= new Date(year, month + 1, 0).getDate();

  let row = document.createElement('tr');
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }
  for (let day = 1; day <= daysInMonth; day++) {
    if (row.children.length === 7) {
      tbody.appendChild(row);
      row = document.createElement('tr');
    }
    const cell = document.createElement('td');
    cell.textContent = day;

    // 標示已打卡的日期
    const iso = new Date(year, month, day)
                    .toISOString()
                    .split('T')[0];
    if (localStorage.getItem(iso)) {
      cell.classList.add('filled');
    }

    row.appendChild(cell);
  }
  while (row.children.length < 7) {
    row.appendChild(document.createElement('td'));
  }
  tbody.appendChild(row);
  table.appendChild(tbody);
  calendarEl.appendChild(table);
}

// 2. Entry 儲存處理
document.getElementById('entry-form').addEventListener('submit', e => {
  e.preventDefault();
  const dateStr = document.getElementById('entry-date')
                        .value; // yyyy‑MM‑dd
  const bleed  = document.getElementById('bleed-level').value;
  const symptoms = Array.from(
    document.querySelectorAll('#entry-form input[type=checkbox]:checked')
  ).map(cb => cb.value);
  // 存 localStorage
  localStorage.setItem(dateStr, JSON.stringify({
    bleedLevel: bleed,
    symptoms: symptoms
  }));
  // 清表單（可選）
  // e.target.reset();

  // 立即重繪日曆
  generateCalendar(currentDate);

  alert(`已記錄 ${dateStr}`);
});

// 3. 初始化與分頁切換時渲染
window.addEventListener('load', () => generateCalendar());
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.view === 'calendar') {
      generateCalendar(currentDate);
    }
  });
});