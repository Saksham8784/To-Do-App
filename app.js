window.addEventListener('load', () => {
	let todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');
	const clearCompletedButton = document.querySelector('#clear-completed');
	const filterButtons = document.querySelectorAll('.filter-btn');
	const sortButton = document.querySelector('#sort-btn');
	const darkThemeToggle = document.getElementById('dark-theme-toggle');
  
	const username = localStorage.getItem('username') || '';
	nameInput.value = username;
  
	nameInput.addEventListener('change', (e) => {
	  localStorage.setItem('username', e.target.value);
	});
  
	newTodoForm.addEventListener('submit', (e) => {
	  e.preventDefault();
	  const todo = {
		content: e.target.elements.content.value,
		category: e.target.elements.category.value,
		done: false,
		createdAt: new Date().getTime(),
	  };
	  todos.push(todo);
	  localStorage.setItem('todos', JSON.stringify(todos));
	  e.target.reset();
	  displayTodos();
	});
  
	clearCompletedButton.addEventListener('click', () => {
	  todos = todos.filter((todo) => !todo.done);
	  localStorage.setItem('todos', JSON.stringify(todos));
	  displayTodos();
	});
  
	filterButtons.forEach((button) => {
	  button.addEventListener('click', () => {
		const category = button.dataset.category;
		displayTodos(category);
	  });
	});
  
	sortButton.addEventListener('click', () => {
	  todos.sort((a, b) => a.createdAt - b.createdAt);
	  localStorage.setItem('todos', JSON.stringify(todos));
	  displayTodos();
	});
  
	darkThemeToggle.addEventListener('change', () => {
	  document.body.classList.toggle('dark-theme', darkThemeToggle.checked);
	});
  
	displayTodos();
  
	function updateClock() {
	  const now = new Date();
	  const hours = now.getHours().toString().padStart(2, '0');
	  const minutes = now.getMinutes().toString().padStart(2, '0');
	  const seconds = now.getSeconds().toString().padStart(2, '0');
	  const clockElement = document.getElementById('clock');
	  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
	  const dateElement = document.getElementById('date');
	  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	  dateElement.textContent = now.toLocaleDateString('en-US', options);
	}
  
	setInterval(updateClock, 1000);
  
	function displayTodos(category = 'all') {
	  const todoList = document.querySelector('#todo-list');
	  todoList.innerHTML = '';
  
	  let filteredTodos = todos;
	  if (category !== 'all') {
		filteredTodos = todos.filter((todo) => todo.category === category);
	  }
  
	  filteredTodos.forEach((todo) => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');
  
		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');
  
		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
		  span.classList.add('personal');
		} else {
		  span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');
  
		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';
  
		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);
  
		todoList.appendChild(todoItem);
  
		if (todo.done) {
		  todoItem.classList.add('done');
		}
  
		input.addEventListener('change', (e) => {
		  todo.done = e.target.checked;
		  localStorage.setItem('todos', JSON.stringify(todos));
  
		  if (todo.done) {
			todoItem.classList.add('done');
		  } else {
			todoItem.classList.remove('done');
		  }
  
		  displayTodos(category);
		});
  
		edit.addEventListener('click', (e) => {
		  const input = content.querySelector('input');
		  input.removeAttribute('readonly');
		  input.focus();
		  input.addEventListener('blur', (e) => {
			input.setAttribute('readonly', true);
			todo.content = e.target.value;
			localStorage.setItem('todos', JSON.stringify(todos));
			displayTodos(category);
		  });
		});
  
		deleteButton.addEventListener('click', (e) => {
		  todos = todos.filter((t) => t !== todo);
		  localStorage.setItem('todos', JSON.stringify(todos));
		  displayTodos(category);
		});
	  });
  
	  const totalTodos = todos.length;
	  const completedTodos = todos.filter((todo) => todo.done).length;
  
	  document.getElementById('total-todos').textContent = `Total Todos: ${totalTodos}`;
	  document.getElementById('completed-todos').textContent = `Completed: ${completedTodos}`;
	}
  });
  