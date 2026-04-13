const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

addBtn.addEventListener('click', addTask);

function addTask() {
  const taskText = taskInput.value.trim()
 
  if (taskText) {
    const li = document.createElement('li');
    li.innerHTML = `<input class='checkbox' type="checkbox"> ${taskText}<button class='deleteBtn'>Remove</button>`;
    taskList.appendChild(li);
    taskInput.value = '';

    // Remove task
    li.querySelector('button').addEventListener('click', () => {
      li.remove();
    });
  }
}

