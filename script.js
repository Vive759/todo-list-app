// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const filterBtns = document.querySelectorAll('.filter-btn');

// Tasks array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize the app
function init() {
    updateTaskList();
    updateStats();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Add task button click
    addTaskBtn.addEventListener('click', addTask);
    
    // Add task on Enter key press
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Set current filter
            currentFilter = this.getAttribute('data-filter');
            // Update task list with filter
            updateTaskList();
        });
    });
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Save to localStorage
    saveTasks();
    
    // Clear input
    taskInput.value = '';
    
    // Update UI
    updateTaskList();
    updateStats();
    
    // Focus back to input
    taskInput.focus();
}

// Update task list in UI
function updateTaskList() {
    // Clear current list
    taskList.innerHTML = '';
    
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    // If no tasks, show message
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = currentFilter === 'all' 
            ? 'No tasks yet. Add your first task above!' 
            : `No ${currentFilter} tasks.`;
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#7f8c8d';
        emptyMessage.style.padding = '30px';
        emptyMessage.style.fontStyle = 'italic';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    // Add each task to the list
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.setAttribute('data-id', task.id);
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Add event listeners for the task item
        const checkbox = taskItem.querySelector('.task-checkbox');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        const taskText = taskItem.querySelector('.task-text');
        
        // Toggle completion on checkbox click
        checkbox.addEventListener('change', function() {
            toggleTaskCompletion(task.id);
        });
        
        // Toggle completion on text click
        taskText.addEventListener('click', function() {
            toggleTaskCompletion(task.id);
        });
        
        // Delete task on delete button click
        deleteBtn.addEventListener('click', function() {
            deleteTask(task.id);
        });
        
        taskList.appendChild(taskItem);
    });
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    // Find the task
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        // Toggle completion status
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        
        // Save to localStorage
        saveTasks();
        
        // Update UI
        updateTaskList();
        updateStats();
    }
}

// Delete a task
function deleteTask(taskId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    // Remove task from array
    tasks = tasks.filter(task => task.id !== taskId);
    
    // Save to localStorage
    saveTasks();
    
    // Update UI
    updateTaskList();
    updateStats();
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init);
