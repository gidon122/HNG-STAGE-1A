let dueDate = new Date("2026-04-16T18:00:00");
const timeEl = document.getElementById("timeRemaining");
const overdueIndicator = document.getElementById("overdueIndicator");
const checkbox = document.getElementById("checkbox");
const title = document.getElementById("title");
const statusEl = document.getElementById("status");
const statusControl = document.getElementById("statusControl");
const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const card = document.querySelector('[data-testid="test-todo-card"]');
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const editPriority = document.getElementById("editPriority");
const editDueDate = document.getElementById("editDueDate");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const expandToggle = document.getElementById("expandToggle");
const collapsibleSection = document.getElementById("collapsibleSection");

/* Time Remaining Logic */
function updateTime() {
  if (statusEl.textContent === "Done") {
    timeEl.textContent = "Completed";
    overdueIndicator.textContent = "";
    card.classList.remove("overdue");
    return;
  }

  const now = new Date();
  const diff = dueDate - now;

  if (diff <= 0) {
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours < 1 && minutes < 1) {
      timeEl.textContent = "Due now!";
    } else if (hours < 1) {
      timeEl.textContent = `Overdue by ${minutes} minute(s)`;
    } else {
      timeEl.textContent = `Overdue by ${hours} hour(s)`;
    }
    overdueIndicator.textContent = "Overdue";
    card.classList.add("overdue");
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    timeEl.textContent = `Due in ${days} day(s)`;
  } else if (hours > 0) {
    timeEl.textContent = `Due in ${hours} hour(s)`;
  } else {
    timeEl.textContent = `Due in ${minutes} minute(s)`;
  }
  overdueIndicator.textContent = "";
  card.classList.remove("overdue");
}

/* Run once + update every 30 seconds */
updateTime();
setInterval(updateTime, 30000);

/* Checkbox Behavior */
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    title.classList.add("completed");
    statusEl.textContent = "Done";
    statusControl.value = "Done";
  } else {
    title.classList.remove("completed");
    statusEl.textContent = "Pending";
    statusControl.value = "Pending";
  }
  updateTime();
});

/* Status Control */
statusControl.addEventListener("change", () => {
  const value = statusControl.value;
  statusEl.textContent = value;
  if (value === "Done") {
    checkbox.checked = true;
    title.classList.add("completed");
  } else {
    checkbox.checked = false;
    title.classList.remove("completed");
  }
  if (value === "In Progress") {
    card.classList.add("in-progress");
  } else {
    card.classList.remove("in-progress");
  }
  updateTime();
});

/* Edit Mode */
document.querySelector('[data-testid="test-todo-edit-button"]').addEventListener("click", () => {
  card.style.display = "none";
  editForm.style.display = "flex";
  editTitle.value = title.textContent;
  editDescription.value = document.querySelector('[data-testid="test-todo-description"]').textContent;
  editPriority.value = document.querySelector('[data-testid="test-todo-priority"]').textContent.toLowerCase();
  editDueDate.value = dueDate.toISOString().slice(0, 16);
});

saveButton.addEventListener("click", () => {
  title.textContent = editTitle.value;
  document.querySelector('[data-testid="test-todo-description"]').textContent = editDescription.value;
  const priority = editPriority.value;
  document.querySelector('[data-testid="test-todo-priority"]').textContent = priority;
  document.querySelector('[data-testid="test-todo-priority"]').className = `priority ${priority.toLowerCase()}`;
  priorityIndicator.className = `priority-indicator ${priority.toLowerCase()}`;
  dueDate = new Date(editDueDate.value);
  document.querySelector('[data-testid="test-todo-due-date"]').textContent = dueDate.toLocaleDateString();
  document.querySelector('[data-testid="test-todo-due-date"]').setAttribute("datetime", dueDate.toISOString());
  editForm.style.display = "none";
  card.style.display = "flex";
  updateTime();
});

cancelButton.addEventListener("click", () => {
  editForm.style.display = "none";
  card.style.display = "flex";
});

/* Expand/Collapse */
expandToggle.addEventListener("click", () => {
  const expanded = expandToggle.getAttribute("aria-expanded") === "true";
  expandToggle.setAttribute("aria-expanded", !expanded);
  if (!expanded) {
    collapsibleSection.classList.add("expanded");
    expandToggle.textContent = "Collapse";
  } else {
    collapsibleSection.classList.remove("expanded");
    expandToggle.textContent = "Expand";
  }
});

/* Buttons */
document.querySelector('[data-testid="test-todo-delete-button"]').addEventListener("click", () => {
  alert("Delete clicked");
});
