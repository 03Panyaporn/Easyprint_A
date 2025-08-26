const checkboxes = document.querySelectorAll('.item-checkbox');
const selectedCount = document.getElementById('selected-count');
const selectAll = document.getElementById('select-all');

const updateCount = () => {
  const checkedItems = document.querySelectorAll('.item-checkbox:checked');
  selectedCount.textContent = checkedItems.length;
};

checkboxes.forEach(cb => {
  cb.addEventListener('change', updateCount);
});

selectAll.addEventListener('change', (e) => {
  const checked = e.target.checked;
  checkboxes.forEach(cb => cb.checked = checked);
  updateCount();
});

// กรองตามหมวดหมู่
const tabButtons = document.querySelectorAll('.tab-btn');
const rows = document.querySelectorAll('.table-row');

const updateVisibleRows = () => {
  const activeCategories = Array.from(tabButtons)
    .filter(btn => btn.classList.contains('active'))
    .map(btn => btn.dataset.category);

  rows.forEach(row => {
    const rowCategory = row.dataset.category;
    if (activeCategories.length === 0 || activeCategories.includes(rowCategory)) {
      row.style.display = 'grid';
    } else {
      row.style.display = 'none';
    }
  });
};

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    updateVisibleRows();
  });
});

// เรียกตอนโหลดเพื่อให้แสดงครบ
updateVisibleRows();
