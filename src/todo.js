let tasks = [{
  description: 'Task 1',
  completed: false,
  index: 1,
},
{
  description: 'Task 2',
  completed: true,
  index: 2,
},
// Add more tasks with different index values
];

function updateIndexes() {
  tasks.forEach((task, index) => {
    task.index = index + 1;
  });
}

export function deleteTask(todoItem) {
  todoItem.remove();
}

export function editTask(todoItem) {
  const taskElement = todoItem.querySelector('.task');
  const taskText = taskElement.textContent;
  taskElement.innerHTML = '';
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = taskText;
  editInput.classList.add('edit-input');
  taskElement.appendChild(editInput);
  editInput.focus();
  editInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      const newText = editInput.value.trim();
      if (newText !== '') {
        taskElement.textContent = newText;
        todoItem.style.backgroundColor = '';
        todoItem.querySelector('.more-btn').style.display = 'inline-block';
        todoItem.querySelector('.delete-btn').style.display = 'none';
      }
    }
  });
}

export function toggleDeleteButton(todoItem) {
  const moreButton = todoItem.querySelector('.more-btn');
  const deleteButton = todoItem.querySelector('.delete-btn');
  moreButton.style.display = 'none';
  deleteButton.style.display = 'inline-block';
}

export function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  updateIndexes(); // Update task indexes after clearing completed tasks
  /* eslint-disable */
  renderTodoList();
  saveTasksToLocalStorage(); // Save updated tasks to local storage
}

export function createTodoItem(task) {
  const todoItem = document.createElement('li');
  todoItem.classList.add('todo-item');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.checked = task.completed;
  const taskElement = document.createElement('span');
  taskElement.classList.add('task');
  taskElement.textContent = task.description;
  if (task.completed) {
    taskElement.classList.add('completed');
  }
  const moreButton = document.createElement('button');
  moreButton.classList.add('more-btn');
  moreButton.innerHTML = '<i class="material-icons">more_vert</i>';
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.innerHTML = '<i class="material-icons">delete</i>';
  todoItem.appendChild(checkbox);
  todoItem.appendChild(taskElement);
  todoItem.appendChild(moreButton);
  todoItem.appendChild(deleteButton);
  moreButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleDeleteButton(todoItem);
    editTask(todoItem);
    todoItem.style.border = 'none';
  });
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteTask(todoItem);
    updateIndexes(); // Update task indexes after deleting a task
    saveTasksToLocalStorage(); // Save updated tasks to local storage
  });
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    if (task.completed) {
      taskElement.classList.add('completed');
    } else {
      taskElement.classList.remove('completed');
    }
    saveTasksToLocalStorage(); // Save updated tasks to local storage
  });
  return todoItem;
}

export function renderTodoList() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  // Sort tasks by index value before rendering
  tasks.sort((a, b) => a.index - b.index);

  tasks.forEach((task) => {
    const todoItem = createTodoItem(task);
    todoList.appendChild(todoItem);
  });
}

export function addTodoItem(taskText) {
  const newTask = {
    description: taskText,
    completed: false,
    index: tasks.length + 1,
  };
  tasks.push(newTask);
  renderTodoList();
  saveTasksToLocalStorage(); // Save updated tasks to local storage
}

export function loadTasksFromLocalStorage() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}