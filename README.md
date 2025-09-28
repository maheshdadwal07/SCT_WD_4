# 📝 TO-DO Web App

A modern, responsive to-do application built with vanilla HTML, CSS, and JavaScript. Features a clean interface, dark mode support, and comprehensive task management capabilities.

This is my fourth task during internship at **SkillCraft Technology**.

## ✨ Features

### Core Functionality

- ✅ **Add Tasks**: Create tasks with title, description, due date/time, priority, and category
- ✅ **Mark Complete**: Click the checkbox to mark tasks as completed/uncompleted
- ✅ **Edit Tasks**: Click the "Edit" button to modify existing tasks
- ✅ **Delete Tasks**: Click the "Delete" button to remove tasks (with confirmation)
- ✅ **Search & Filter**: Real-time search and filter by status (All/Pending/Completed/Overdue)
- ✅ **Sort Options**: Sort by date created, due date, priority, or alphabetically
- ✅ **Statistics**: Live counters for total, pending, completed, and overdue tasks

### Visual & UX Features

- 🌙 **Dark/Light Mode**: Toggle between themes with the moon/sun button
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean design with smooth animations and hover effects
- 🔥 **Priority Colors**: Visual indicators for High (Red), Medium (Yellow), Low (Green)
- ⏰ **Overdue Highlighting**: Automatic detection and highlighting of overdue tasks
- 💾 **Local Storage**: All data persists between browser sessions

## 🚀 How to Use

### Adding a New Task

1. Fill in the **Task Title** (required)
2. Optionally add a **Description**
3. Set a **Due Date** and **Time** (optional)
4. Choose **Priority**: Low, Medium, or High
5. Select a **Category**: Personal, Work, Shopping, Health, or Other
6. Click the large **"ADD TASK"** button

### 📋 How to Mark Tasks as Completed ✅

**There are multiple ways to mark a task as completed:**

#### Primary Method - Checkbox:

- **Click the large checkbox (☐)** on the left side of any task
- The checkbox is larger and more touch-friendly
- Instant visual feedback when clicked

#### What Happens When You Complete a Task:

- ✅ **Checkmark appears** in the checkbox
- ~~**Strikethrough text**~~ on title and description
- **Faded appearance** (70% opacity)
- **Green "✓ Completed" badge** appears in the corner
- **Dashed border** replaces solid border
- **Task shrinks slightly** (scale effect)

#### Toggle Completion:

- **Click the checkbox again** to mark as incomplete
- Task immediately returns to normal appearance
- All completion styling is removed

#### Managing Completed Tasks:

- Use **"Completed" filter button** to view only completed tasks
- Use **"Clear Completed" button** to delete all completed tasks at once
- View completion stats in the **statistics counters**

### Other Task Management

- **Edit**: Click the blue "Edit" button to modify any task details
- **Delete**: Click the red "Delete" button (shows confirmation dialog)
- **Search**: Type in the search box to find tasks by title/description
- **Filter**: Use filter buttons (All/Pending/Completed/Overdue)
- **Sort**: Use the dropdown to reorder tasks

### Theme Switching 🌙

- Click the **moon/sun icon** in the top-right corner
- Switches between light and dark themes
- Preference is saved automatically

## 📱 Responsive Design

- **Desktop (1200px+)**: Full layout with all features visible
- **Tablet (720px - 1200px)**: Adjusted layout for medium screens
- **Mobile (520px - 720px)**: Single column layout with larger touch targets
- **Small Mobile (<520px)**: Compact spacing with optimized elements

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Modern styling with custom properties, Grid, Flexbox
- **JavaScript (ES6+)** — Interactive functionality and local storage
- **Font Awesome** — Icons
- **Local Storage API** — Data persistence

## 📂 Project Structure

```
├── index.html   # Main HTML structure
├── style.css    # Complete styling & responsiveness
├── script.js    # All JavaScript functionality
└── README.md    # Documentation
```

## 💡 Quick Tips

1. **Hover over tasks** to see edit/delete buttons more clearly
2. **Use keyboard shortcuts**: ESC to close modals
3. **Tasks auto-save** - no need to manually save
4. **Overdue tasks** are highlighted automatically
5. **Mobile-friendly** - works great on phones and tablets

---

**Happy Task Managing! 📋✨**
