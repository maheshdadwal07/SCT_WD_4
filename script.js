(function () {
  const taskForm = document.getElementById("taskForm");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescriptionInput = document.getElementById("taskDescription");
  const taskDateInput = document.getElementById("taskDate");
  const taskTimeInput = document.getElementById("taskTime");
  const taskPrioritySelect = document.getElementById("taskPriority");
  const taskCategorySelect = document.getElementById("taskCategory");
  const taskListEl = document.getElementById("taskList");
  const emptyStateEl = document.getElementById("emptyState");
  const clearCompletedBtn = document.getElementById("clearCompleted");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortSelect = document.getElementById("sortBy");
  const searchInput = document.getElementById("searchInput");
  const themeToggle = document.getElementById("themeToggle");

  const totalTasksEl = document.getElementById("totalTasks");
  const pendingTasksEl = document.getElementById("pendingTasks");
  const completedTasksEl = document.getElementById("completedTasks");
  const overdueTasksEl = document.getElementById("overdueTasks");

  const editModal = document.getElementById("editModal");
  const editTaskForm = document.getElementById("editTaskForm");
  const editTaskTitle = document.getElementById("editTaskTitle");
  const editTaskDescription = document.getElementById("editTaskDescription");
  const editTaskDate = document.getElementById("editTaskDate");
  const editTaskTime = document.getElementById("editTaskTime");
  const editTaskPriority = document.getElementById("editTaskPriority");
  const editTaskCategory = document.getElementById("editTaskCategory");
  const cancelEditBtn = document.getElementById("cancelEdit");
  const closeModalBtn = document.getElementById("closeModal");

  const confirmModal = document.getElementById("confirmModal");
  const confirmMessage = document.getElementById("confirmMessage");
  const cancelConfirmBtn = document.getElementById("cancelConfirm");
  const confirmDeleteBtn = document.getElementById("confirmDelete");

  let tasks = [];
  let currentFilter = "all";
  let searchTerm = "";
  let editTaskId = null;
  let deleteTaskId = null;

  const STORAGE_KEY = "todo_tasks_v1";
  const THEME_KEY = "todo_theme_v1";

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  }

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  function toggleTheme() {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeIcon(newTheme);
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
      // Ensure completed property is boolean
      tasks.forEach((task) => {
        task.completed = Boolean(task.completed);
      });
    } catch (e) {
      tasks = [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function generateId() {
    return (
      "t_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
    );
  }

  function getDueDateTime(task) {
    if (!task.dueDate) return null;
    const dateStr =
      task.dueDate + (task.dueTime ? "T" + task.dueTime : "T23:59");
    const dt = new Date(dateStr);
    return isNaN(dt.getTime()) ? null : dt;
  }

  function isOverdue(task) {
    if (task.completed) return false;
    const dt = getDueDateTime(task);
    if (!dt) return false;
    return dt.getTime() < Date.now();
  }

  function isDueSoon(task) {
    if (task.completed) return false;
    const dt = getDueDateTime(task);
    if (!dt) return false;
    const diff = dt.getTime() - Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    return diff > 0 && diff <= oneDay; // within next 24h
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => isOverdue(t)).length;
    totalTasksEl.textContent = total;
    pendingTasksEl.textContent = pending;
    completedTasksEl.textContent = completed;
    overdueTasksEl.textContent = overdue;
  }

  function applyFilters(task) {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (
        !(
          task.title.toLowerCase().includes(q) ||
          (task.description || "").toLowerCase().includes(q)
        )
      )
        return false;
    }

    switch (currentFilter) {
      case "pending":
        return !task.completed;
      case "completed":
        return task.completed;
      case "overdue":
        return isOverdue(task);
      default:
        return true;
    }
  }

  function sortTasks(list) {
    const sortBy = sortSelect.value;
    const priorityRank = { high: 3, medium: 2, low: 1 };
    return list.slice().sort((a, b) => {
      if (sortBy === "dueDate") {
        const ad = getDueDateTime(a)?.getTime() || Infinity;
        const bd = getDueDateTime(b)?.getTime() || Infinity;
        return ad - bd;
      }
      if (sortBy === "priority") {
        return priorityRank[b.priority] - priorityRank[a.priority];
      }
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return a.createdAt - b.createdAt; // dateCreated
    });
  }

  function formatDue(task) {
    if (!task.dueDate) return "";
    const parts = [];
    parts.push(task.dueDate);
    if (task.dueTime) parts.push(task.dueTime);
    return parts.join(" ");
  }

  function createTaskHTML(task) {
    const overdue = isOverdue(task);
    const dueSoon = isDueSoon(task);
    const dueLabel = formatDue(task);
    const priorityClass = `${task.priority}-priority`;

    const tags = [];
    tags.push(
      `<span class="task-tag priority-${task.priority}"><i class="fas fa-flag"></i>${task.priority}</span>`
    );
    if (task.category) {
      tags.push(
        `<span class="task-tag category"><i class="fas fa-folder"></i>${task.category}</span>`
      );
    }

    const dueHtml = dueLabel
      ? `<div class="task-due ${
          overdue ? "overdue" : dueSoon ? "due-soon" : ""
        }"><i class="fas fa-clock"></i>${dueLabel}</div>`
      : "";

    return `
      <div class="task-item ${task.completed ? "completed" : ""} ${
      overdue ? "overdue" : ""
    } ${priorityClass}" data-id="${task.id}">
        <div class="task-header">
          <input type="checkbox" class="task-checkbox" ${
            task.completed ? "checked" : ""
          } aria-label="Mark Complete" />
          <div class="task-content">
            <div class="task-title">${escapeHTML(task.title)}</div>
            ${
              task.description
                ? `<div class="task-description">${escapeHTML(
                    task.description
                  )}</div>`
                : ""
            }
            <div class="task-meta">${tags.join("")}${dueHtml}</div>
            <div class="task-actions">
              <button class="task-btn edit-btn" data-action="edit"><i class="fas fa-edit"></i>Edit</button>
              <button class="task-btn delete-btn" data-action="delete"><i class="fas fa-trash"></i>Delete</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function escapeHTML(str) {
    return str.replace(
      /[&<>"]+/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  }

  function render() {
    updateStats();
    const visible = sortTasks(tasks.filter(applyFilters));
    taskListEl.innerHTML = visible.map(createTaskHTML).join("");
    emptyStateEl.classList.toggle("hidden", visible.length > 0);
  }

  function resetForm() {
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDateInput.value = "";
    taskTimeInput.value = "";
    taskPrioritySelect.value = "medium";
    taskCategorySelect.value = "personal";
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    if (!title) return;
    const newTask = {
      id: generateId(),
      title,
      description: taskDescriptionInput.value.trim(),
      dueDate: taskDateInput.value || "",
      dueTime: taskTimeInput.value || "",
      priority: taskPrioritySelect.value,
      category: taskCategorySelect.value,
      completed: false,
      createdAt: Date.now(),
    };
    tasks.push(newTask);
    saveTasks();
    resetForm();
    render();
  });

  themeToggle.addEventListener("click", toggleTheme);

  clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    render();
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  sortSelect.addEventListener("change", render);
  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    render();
  });

  taskListEl.addEventListener("click", (e) => {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;
    const id = taskItem.dataset.id;

    // Handle checkbox clicks
    if (e.target.matches(".task-checkbox")) {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        task.completed = Boolean(e.target.checked);
        saveTasks();
        render();
      }
      return;
    }

    // Handle edit button clicks (button or icon inside it)
    const editBtn = e.target.closest('.edit-btn, [data-action="edit"]');
    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();
      openEditModal(id);
      return;
    }

    // Handle delete button clicks (button or icon inside it)
    const deleteBtn = e.target.closest('.delete-btn, [data-action="delete"]');
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      openDeleteConfirm(id);
      return;
    }
  });

  function openEditModal(id) {
    console.log("Opening edit modal for task ID:", id);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      console.error("Task not found:", id);
      return;
    }
    editTaskId = id;
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description || "";
    editTaskDate.value = task.dueDate || "";
    editTaskTime.value = task.dueTime || "";
    editTaskPriority.value = task.priority;
    editTaskCategory.value = task.category;
    showModal(editModal);
  }

  function openDeleteConfirm(id) {
    console.log("Opening delete confirmation for task ID:", id);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      console.error("Task not found:", id);
      return;
    }
    deleteTaskId = id;
    confirmMessage.textContent = `Are you sure you want to delete "${task.title}"?`;
    showModal(confirmModal);
  }

  editTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!editTaskId) return;
    const task = tasks.find((t) => t.id === editTaskId);
    if (!task) return;
    task.title = editTaskTitle.value.trim() || task.title;
    task.description = editTaskDescription.value.trim();
    task.dueDate = editTaskDate.value || "";
    task.dueTime = editTaskTime.value || "";
    task.priority = editTaskPriority.value;
    task.category = editTaskCategory.value;
    saveTasks();
    hideModal(editModal);
    render();
  });

  cancelEditBtn.addEventListener("click", () => hideModal(editModal));
  closeModalBtn?.addEventListener("click", () => hideModal(editModal));

  cancelConfirmBtn.addEventListener("click", () => hideModal(confirmModal));
  confirmDeleteBtn.addEventListener("click", () => {
    if (deleteTaskId) {
      tasks = tasks.filter((t) => t.id !== deleteTaskId);
      saveTasks();
      render();
    }
    hideModal(confirmModal);
  });

  function showModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function hideModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    if (modal === editModal) {
      editTaskId = null;
    }
    if (modal === confirmModal) {
      deleteTaskId = null;
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (editModal.classList.contains("active")) hideModal(editModal);
      if (confirmModal.classList.contains("active")) hideModal(confirmModal);
    }
  });

  [editModal, confirmModal].forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) hideModal(m);
    });
  });

  initTheme();
  loadTasks();
  render();
})();
