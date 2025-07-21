document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const calendarTitle = document.getElementById('calendar-title');
  let currentDate = new Date();

  function generateCalendar(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarTitle.textContent = `${year} 年 ${month + 1} 月`;
    calendarEl.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    ['日','一','二','三','四','五','六'].forEach(d => {
      const th = document.createElement('th');
      th.textContent = d;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    let dateNum = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement('td');
        if (i === 0 && j < firstDay) {
          cell.innerHTML = '';
        } else if (dateNum > daysInMonth) {
          break;
        } else {
          const iso = new Date(year, month, dateNum).toISOString().split('T')[0];
          const data = localStorage.getItem(iso);
          if (data) {
            cell.classList.add('has-entry');
          }
          cell.textContent = dateNum;

          // 點格子進入打卡畫面
          cell.addEventListener('click', () => {
            // 切換到打卡頁
            document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
            document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
            document.querySelector('[data-view="entry"]').classList.add('active');
            document.getElementById('view-entry').classList.remove('hidden');

            document.getElementById('entry-date').value = iso;

            if (data) {
              const parsed = JSON.parse(data);
              document.getElementById('bleed-level').value = parsed.bleedLevel;
              document.querySelectorAll('#entry-form input[type=checkbox]')
                .forEach(cb => {
                  cb.checked = parsed.symptoms.includes(cb.value);
                });
            } else {
              document.getElementById('bleed-level').value = '2';
              document.querySelectorAll('#entry-form input[type=checkbox]')
                .forEach(cb => cb.checked = false);
            }
          });

          dateNum++;
        }
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    calendarEl.appendChild(table);
  }

  generateCalendar(currentDate);

  // 分頁切換
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
      document.getElementById(`view-${view}`).classList.remove('hidden');
    });
  });

  // 打卡儲存
  document.getElementById('entry-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('entry-date').value;
    const bleedLevel = document.getElementById('bleed-level').value;
    const symptoms = Array.from(document.querySelectorAll('#entry-form input[type=checkbox]'))
                          .filter(cb => cb.checked)
                          .map(cb => cb.value);
    const entry = { bleedLevel, symptoms };
    localStorage.setItem(date, JSON.stringify(entry));
    alert('打卡完成！');

    generateCalendar(currentDate);  // 重新渲染日曆
  });
});
