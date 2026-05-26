const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterAll = document.getElementById('filterAll');
const filterActive = document.getElementById('filterActive');
const filterCompleted = document.getElementById('filterCompleted');
const clearAllBtn = document.getElementById('clearAllBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});
filterAll.addEventListener('click', () => setFilter('all'));
filterActive.addEventListener('click', () => setFilter('active'));
filterCompleted.addEventListener('click', () => setFilter('completed'));
clearAllBtn.addEventListener('click', clearAllTasks);

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
  const taskText = taskInput.value.trim();
 
  if (taskText) {
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
}

function renderTasks() {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <input class='checkbox' type="checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-text">${task.text}</span>
      <button class='editBtn' title="Edit task">✎</button>
      <button class='deleteBtn'>×</button>
    `;
    taskList.appendChild(li);

    const taskTextSpan = li.querySelector('.task-text');
    const editBtn = li.querySelector('.editBtn');

    function enableEdit() {
      if (li.querySelector('.edit-input')) return;
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.className = 'edit-input';
      editInput.value = task.text;

      function saveEdit() {
        const newText = editInput.value.trim();
        if (newText) {
          task.text = newText;
          saveTasks();
        }
        renderTasks();
      }

      function cancelEdit() {
        renderTasks();
      }

      editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          saveEdit();
        } else if (event.key === 'Escape') {
          cancelEdit();
        }
      });

      editInput.addEventListener('blur', saveEdit);
      li.replaceChild(editInput, taskTextSpan);
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }

    editBtn.addEventListener('click', enableEdit);
    taskTextSpan.addEventListener('dblclick', enableEdit);

    // Toggle completed
    li.querySelector('.checkbox').addEventListener('change', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Remove task
    li.querySelector('.deleteBtn').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });
  });

  updateTaskCount();
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');
  renderTasks();
}

function clearAllTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks();
}

function updateTaskCount() {
  const activeCount = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
}

