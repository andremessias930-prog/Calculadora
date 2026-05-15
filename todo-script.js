// Store reference to HTML elements
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// Storage key
const STORAGE_KEY = 'todos';
let currentFilter = 'all';
let todos = [];

// Initialize app
function init() {
    loadTodos();
    render();
    addEventListeners();
}

// Add event listeners
function addEventListeners() {
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    todos.unshift(todo);
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
    render();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }
}

// Delete a todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        render();
    }
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    render();
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        case 'all':
        default:
            return todos;
    }
}

// Clear completed todos
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Delete ${completedCount} completed task(s)?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        currentFilter = 'all';
        document.querySelectorAll('.filter-btn')[0].classList.add('active');
        document.querySelectorAll('.filter-btn').forEach((btn, index) => {
            if (index !== 0) btn.classList.remove('active');
        });
        render();
    }
}

// Clear all todos
function clearAll() {
    if (todos.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    
    if (confirm('Delete all tasks? This cannot be undone.')) {
        todos = [];
        saveTodos();
        currentFilter = 'all';
        document.querySelectorAll('.filter-btn')[0].classList.add('active');
        document.querySelectorAll('.filter-btn').forEach((btn, index) => {
            if (index !== 0) btn.classList.remove('active');
        });
        render();
    }
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    
    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// Render the todo list
function render() {
    const filteredTodos = getFilteredTodos();
    
    // Clear list
    todoList.innerHTML = '';
    
    // Show/hide empty state
    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
    }
    
    // Render todos
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <span class="todo-meta">${todo.createdAt}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        todoList.appendChild(li);
    });
    
    // Update stats
    updateStats();
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Load todos from local storage
function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            todos = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading todos:', e);
            todos = [];
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}