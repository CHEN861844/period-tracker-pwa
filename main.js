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