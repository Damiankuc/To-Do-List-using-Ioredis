/**
 * Frontend JavaScript - Client REST API Integration
 */

// API Base URL (Relative to domain or absolute)
const API_URL = '';

// App State
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const emptyMessage = document.getElementById('emptyMessage');
const toast = document.getElementById('toast');

// Stats Elements
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
  setupEventListeners();
});

/**
 * Event Listeners Setup
 */
function setupEventListeners() {
  // Submit new task
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = taskInput.value.trim();
    if (!description) return;
    await createTask(description);
  });

  // Filter selection
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
}

/**
 * Fetch all tasks from backend (GET /tasks)
 */
async function fetchTasks() {
  showLoading(true);
  try {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();

    if (data.success) {
      tasks = data.data || [];
      renderTasks();
    } else {
      showToast(data.message || 'Error al obtener las tareas', 'error');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showToast('No se pudo conectar con el servidor', 'error');
    showEmptyState(true, 'Error de conexión con la API de Redis');
  } finally {
    showLoading(false);
  }
}

/**
 * Create a new task (POST /task)
 */
async function createTask(description) {
  try {
    const res = await fetch(`${API_URL}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    const data = await res.json();

    if (data.success && data.data) {
      tasks.unshift(data.data);
      taskInput.value = '';
      renderTasks();
      showToast('Tarea anotada correctamente', 'success');
    } else {
      showToast(data.message || 'Error al crear la tarea', 'error');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    showToast('Error de red al crear la tarea', 'error');
  }
}

/**
 * Toggle task completed status (PATCH /task/:id)
 */
async function toggleTaskStatus(id, currentStatus) {
  const newCompletedState = !currentStatus;
  
  // Optimistic UI Update
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = newCompletedState;
    renderTasks();
  }

  try {
    const res = await fetch(`${API_URL}/task/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: newCompletedState }),
    });

    const data = await res.json();
    if (!data.success) {
      // Revert optimistic update if API failed
      if (taskIndex !== -1) {
        tasks[taskIndex].completed = currentStatus;
        renderTasks();
      }
      showToast(data.message || 'Error al actualizar la tarea', 'error');
    } else {
      showToast(newCompletedState ? 'Tarea realizada' : 'Tarea marcada como pendiente', 'success');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    // Revert optimistic update
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = currentStatus;
      renderTasks();
    }
    showToast('Error de conexión al actualizar', 'error');
  }
}

/**
 * Delete / discard task (DELETE /task/:id)
 */
async function deleteTask(id) {
  // Optimistic UI remove
  const previousTasks = [...tasks];
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();

  try {
    const res = await fetch(`${API_URL}/task/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (!data.success) {
      tasks = previousTasks;
      renderTasks();
      showToast(data.message || 'Error al descartar la tarea', 'error');
    } else {
      showToast('Tarea descartada', 'success');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    tasks = previousTasks;
    renderTasks();
    showToast('Error de conexión al eliminar', 'error');
  }
}

/**
 * Render tasks list and update stats
 */
function renderTasks() {
  updateStats();

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    let msg = '¡Comienza agregando tu primera tarea arriba!';
    if (currentFilter === 'pending') msg = 'No tienes tareas pendientes.';
    if (currentFilter === 'completed') msg = 'Aún no has completado ninguna tarea.';
    showEmptyState(true, msg);
    return;
  }

  showEmptyState(false);

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    const formattedDate = formatDate(task.createdAt);

    li.innerHTML = `
      <div class="task-content">
        <label class="checkbox-container">
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" />
          <span class="checkmark"></span>
        </label>
        <div class="task-text-group">
          <span class="task-description">${escapeHTML(task.description)}</span>
          <span class="task-date">${formattedDate}</span>
        </div>
      </div>
      <button class="btn-delete" data-id="${task.id}" title="Descartar tarea">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    `;

    // Toggle checkbox event
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      toggleTaskStatus(task.id, task.completed);
    });

    // Delete button event
    const deleteBtn = li.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });
}

/**
 * Update task counters
 */
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

/**
 * Utility: Format ISO Date string to readable format
 */
function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return isoString;
  }
}

/**
 * Utility: Escape HTML strings to prevent XSS
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * UI State Utilities
 */
function showLoading(show) {
  if (show) {
    loadingState.classList.remove('hidden');
    emptyState.classList.add('hidden');
  } else {
    loadingState.classList.add('hidden');
  }
}

function showEmptyState(show, message = '') {
  if (show) {
    emptyState.classList.remove('hidden');
    if (message) emptyMessage.textContent = message;
  } else {
    emptyState.classList.add('hidden');
  }
}

function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}
