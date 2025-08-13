
let todos = [];
let todoId = 1;


document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    showTodos();
    
    document.getElementById('todoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTodo();
    });
    
    document.getElementById('searchInput').addEventListener('input', showTodos);
    document.getElementById('searchType').addEventListener('change', showTodos);
});


function addTodo() {
    const text = document.getElementById('todoInput').value.trim();
    const priority = document.getElementById('prioritySelect').value;
    
    if (!text) return;
    
    todos.push({
        id:todoId++,
        text: text,
        completed: false,
        priority: priority
    });
    
    document.getElementById('todoInput').value = '';
    saveTodos();
    showTodos();
}

function completedTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = true;
        saveTodos();
        showTodos();
    }
}

function deleteTodo(id) {
    if (confirm('Delete this todo?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        showTodos();
    }
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newText = prompt('Edit todo:', todo.text);
        if (newText && newText.trim()) {
            todo.text = newText.trim();
            saveTodos();
            showTodos();
        }
    }
}


function showTodos() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const searchType = document.getElementById('searchType').value;
    
    let pending = todos.filter(t => !t.completed);
    
    let completed = todos.filter(t => t.completed);
    
    if (search) {
        if (searchType === 'pending') {
            pending = pending.filter(t => t.text.toLowerCase().includes(search));
        } else if (searchType === 'completed') {
            completed = completed.filter(t => t.text.toLowerCase().includes(search));
        }
    }
    
   
    pending.sort((a, b) => {
        const order = { high: 3, medium: 2, low: 1 };
        return order[b.priority] - order[a.priority];
    });
    
    showTodoList(pending, 'pendingTodos', 'pendingEmpty', false);
    
    showTodoList(completed, 'completedTodos', 'completedEmpty', true);
    
    document.getElementById('pendingCount').textContent = todos.filter(t => !t.completed).length;
    document.getElementById('completedCount').textContent = todos.filter(t => t.completed).length;
}

function showTodoList(todoList, containerId, emptyId, isCompleted) {
    const container = document.getElementById(containerId);
    const empty = document.getElementById(emptyId);
    
    container.innerHTML = '';
    container.appendChild(empty);
    
    if (todoList.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        
        todoList.forEach(todo => {
            const todoDiv = makeTodoHTML(todo, isCompleted);
            container.appendChild(todoDiv);
        });
    }
}

function makeTodoHTML(todo, isCompleted) {
    const div = document.createElement('div');
    div.className = 'card mb-2';
    
    if (todo.priority === 'high') div.className += ' border-danger';
    else if (todo.priority === 'medium') div.className += ' border-warning';
    else div.className += ' border-success';
    
    if (isCompleted) div.className += ' opacity-75';
    
    let badgeColor = 'bg-success';
    if (todo.priority === 'high') badgeColor = 'bg-danger';
    else if (todo.priority === 'medium') badgeColor = 'bg-warning text-dark';
    
    div.innerHTML = `
        <div class="card-body p-2">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <p class="mb-1 ${isCompleted ? 'text-decoration-line-through text-muted' : ''}">${todo.text}</p>
                    <span class="badge ${badgeColor}">${todo.priority.toUpperCase()}</span>
                </div>
                <div>
                    ${!isCompleted ? `
                        <button class="btn btn-success btn-sm me-1" onclick="completedTodo(${todo.id})">✓</button>
                        <button class="btn btn-info btn-sm me-1" onclick="editTodo(${todo.id})">Edit</button>
                    ` : ``}
                    <button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('todoId', todoId);
}

function loadTodos() {
    const saved = localStorage.getItem('todos');
    const savedId = localStorage.getItem('todoId');
    
    if (saved) todos = JSON.parse(saved);
    if (savedId) todoId = parseInt(savedId);
    
 
}