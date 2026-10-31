// State Management (Matching Java AppModel)
let tasks = [
  { id: 1, description: "Complete CI/CD GitHub Actions Pipeline", done: true, date: "2026-10-31" },
  { id: 2, description: "Test SwingX JXDatePicker functionality", done: false, date: "2026-11-01" },
  { id: 3, description: "Verify automated JUnit 4 test cases", done: true, date: "2026-10-30" },
  { id: 4, description: "Publish GitHub Release v1.0.3 package", done: true, date: "2026-10-31" },
  { id: 5, description: "Deploy API Javadoc to GitHub Pages", done: false, date: "2026-11-02" }
];

let nextId = 6;
let currentSort = null; // 'earliest' | 'latest' | null

// Load from localStorage if present
const storedTasks = localStorage.getItem('todolist_tasks');
if (storedTasks) {
  try {
    tasks = JSON.parse(storedTasks);
    nextId = Math.max(...tasks.map(t => t.id), 0) + 1;
  } catch (e) {
    console.warn("Could not load stored tasks", e);
  }
}

function saveTasks() {
  localStorage.setItem('todolist_tasks', JSON.stringify(tasks));
  renderTasks();
}

// DOM Elements
const taskListEl = document.getElementById('taskList');
const taskModal = document.getElementById('taskModal');
const aboutModal = document.getElementById('aboutModal');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const taskIdInput = document.getElementById('taskId');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskDateInput = document.getElementById('taskDate');
const taskCompletedInput = document.getElementById('taskCompleted');
const modalDeleteBtn = document.getElementById('modalDeleteBtn');

// Stats Elements
const totalTasksCount = document.getElementById('totalTasksCount');
const completedTasksCount = document.getElementById('completedTasksCount');
const pendingTasksCount = document.getElementById('pendingTasksCount');

// Format date helper: "Sat 10/31"
function formatDateBadge(dateStr) {
  if (!dateStr) return '<span class="task-date-badge">No Date</span>';
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return '<span class="task-date-badge">' + dateStr + '</span>';
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[d.getDay()];
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `<span class="task-date-badge">📅 ${dayName} ${month}/${day}</span>`;
}

// Render Table Rows
function renderTasks() {
  taskListEl.innerHTML = '';

  if (tasks.length === 0) {
    taskListEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <h3>All caught up!</h3>
        <p>No tasks remaining. Click "New Task" to create one.</p>
      </div>
    `;
  } else {
    tasks.forEach(task => {
      const row = document.createElement('div');
      row.className = `task-row ${task.done ? 'completed' : ''}`;
      row.innerHTML = `
        <div class="col col-status" onclick="event.stopPropagation()">
          <label class="custom-checkbox-container">
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleDone(${task.id})">
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="col col-desc" onclick="openEditModal(${task.id})">
          <span class="task-text">${escapeHtml(task.description)}</span>
        </div>
        <div class="col col-date" onclick="openEditModal(${task.id})">
          ${formatDateBadge(task.date)}
        </div>
        <div class="col col-actions" onclick="event.stopPropagation()">
          <div class="task-actions">
            <button class="row-action-btn" title="Edit" onclick="openEditModal(${task.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="row-action-btn delete" title="Delete" onclick="deleteTask(${task.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      taskListEl.appendChild(row);
    });
  }

  // Update Stats Counters
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const pending = total - completed;

  totalTasksCount.textContent = `Total: ${total}`;
  completedTasksCount.textContent = `Done: ${completed}`;
  pendingTasksCount.textContent = `Pending: ${pending}`;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Toggle Complete
window.toggleDone = function(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
  }
};

// Delete Task
window.deleteTask = function(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
};

// Open Edit Modal
window.openEditModal = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  modalTitle.textContent = "Edit To Do Item";
  taskIdInput.value = task.id;
  taskDescriptionInput.value = task.description;
  taskDateInput.value = task.date || "";
  taskCompletedInput.checked = !!task.done;
  modalDeleteBtn.style.display = "inline-flex";

  taskModal.classList.add('open');
};

// Open New Modal
document.getElementById('newItemBtn').addEventListener('click', () => {
  modalTitle.textContent = "New To Do Item";
  taskIdInput.value = "";
  taskDescriptionInput.value = "";
  taskDateInput.value = new Date().toISOString().split('T')[0];
  taskCompletedInput.checked = false;
  modalDeleteBtn.style.display = "none";

  taskModal.classList.add('open');
});

// Close Modals
function closeAllModals() {
  taskModal.classList.remove('open');
  aboutModal.classList.remove('open');
}

document.getElementById('modalCloseBtn').addEventListener('click', closeAllModals);
document.getElementById('modalCancelBtn').addEventListener('click', closeAllModals);
document.getElementById('aboutBtn').addEventListener('click', () => aboutModal.classList.add('open'));
document.getElementById('aboutCloseBtn').addEventListener('click', closeAllModals);
document.getElementById('aboutOkBtn').addEventListener('click', closeAllModals);

// Save or Update Form Submit
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const idVal = taskIdInput.value;
  const description = taskDescriptionInput.value.trim();
  const date = taskDateInput.value;
  const done = taskCompletedInput.checked;

  if (idVal) {
    // Edit existing item
    const task = tasks.find(t => t.id === parseInt(idVal, 10));
    if (task) {
      task.description = description;
      task.date = date;
      task.done = done;
    }
  } else {
    // New item
    tasks.push({
      id: nextId++,
      description,
      date,
      done
    });
  }

  saveTasks();
  closeAllModals();
});

// Delete from Modal
modalDeleteBtn.addEventListener('click', () => {
  const idVal = taskIdInput.value;
  if (idVal) {
    deleteTask(parseInt(idVal, 10));
    closeAllModals();
  }
});

// Remove All Completed Items
document.getElementById('removeCompletedBtn').addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
});

// Sort Earliest First (Matching Java AppModel.sortByDate(true))
document.getElementById('sortEarliestBtn').addEventListener('click', () => {
  tasks.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1; // null dates go to end
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });
  document.getElementById('sortEarliestBtn').classList.add('active');
  document.getElementById('sortLatestBtn').classList.remove('active');
  saveTasks();
});

// Sort Latest First (Matching Java AppModel.sortByDate(false))
document.getElementById('sortLatestBtn').addEventListener('click', () => {
  tasks.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1; // null dates go to end
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });
  document.getElementById('sortLatestBtn').classList.add('active');
  document.getElementById('sortEarliestBtn').classList.remove('active');
  saveTasks();
});

// Dark / Light Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('todolist_theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('todolist_theme', newTheme);
});

// Initial Render
renderTasks();
