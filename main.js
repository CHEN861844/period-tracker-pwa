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

// TODO: 之後在這裡加入 generateCalendar()、saveEntry()、scheduleReminders() 等功能
// function generateCalendar() { ... }
// function saveEntry() { ... }
// function scheduleReminders() { ... }
