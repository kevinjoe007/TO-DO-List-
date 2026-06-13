var tasks = [];
var idCount = 1;

function addTask() {
  var t = document.getElementById('taskInput').value;
  var p = document.getElementById('priorityInput').value;

  if(t == "" || t == null) {
    document.getElementById('errMsg').innerHTML = "⚠ Please enter a task!";
    return;
  }

  document.getElementById('errMsg').innerHTML = "";

  var obj = {
    id: idCount,
    task: t,
    priority: p,
    done: false
  };

  idCount = idCount + 1;
  tasks.push(obj);
  document.getElementById('taskInput').value = "";
  renderTasks('All');
  document.getElementById('filterSel').value = 'All';
}

function deleteTask(id) {
  var ok = confirm("Are you sure you want to delete this task?");
  if(ok) {
    for(var i=0; i<tasks.length; i++) {
      if(tasks[i].id == id) {
        tasks.splice(i, 1);
        break;
      }
    }
    renderTasks(document.getElementById('filterSel').value);
  }
}

function toggleDone(id) {
  for(var i=0; i<tasks.length; i++) {
    if(tasks[i].id == id) {
      if(tasks[i].done == true) {
        tasks[i].done = false;
      } else {
        tasks[i].done = true;
      }
    }
  }
  renderTasks(document.getElementById('filterSel').value);
}

function editTask(id) {
  var newName = prompt("Edit your task:");
  if(newName == null || newName == "") {
    alert("Task name cannot be empty!");
    return;
  }
  for(var i=0; i<tasks.length; i++) {
    if(tasks[i].id == id) {
      tasks[i].task = newName;
    }
  }
  renderTasks(document.getElementById('filterSel').value);
}

function renderTasks(filter) {
  var html = "";
  var count = 0;

  for(var i=0; i<tasks.length; i++) {
    var t = tasks[i];

    if(filter != "All" && t.priority != filter) {
      continue;
    }

    count = count + 1;

    var doneClass = "";
    var taskNameClass = "task-name";
    if(t.done == true) {
      doneClass = " is-done";
      taskNameClass = "task-name done-task";
    }

    var doneText = "Mark Done";
    if(t.done == true) doneText = "Undo";

    html = html + '<div class="task-card priority-' + t.priority + doneClass + '">';
    html = html +   '<div class="card-top">';
    html = html +     '<span class="' + taskNameClass + '">' + t.task + '</span>';
    html = html +     '<span class="priority-badge badge-' + t.priority + '">' + t.priority + '</span>';
    html = html +   '</div>';
    html = html +   '<div class="card-bottom">';
    html = html +     '<button class="done-btn" onclick="toggleDone(' + t.id + ')">' + doneText + '</button>';
    html = html +     '<button class="edit-btn" onclick="editTask(' + t.id + ')">✏ Edit</button>';
    html = html +     '<button class="del-btn" onclick="deleteTask(' + t.id + ')">🗑 Delete</button>';
    html = html +   '</div>';
    html = html + '</div>';
  }

  if(count == 0) {
    html = '<div class="empty-msg">-- no tasks found --</div>';
  }

  document.getElementById('taskList').innerHTML = html;
  document.getElementById('countTxt').innerHTML = "Total: " + count + " task(s)";
}

tasks.push({id:idCount++, task:"Buy groceries from supermarket", priority:"Low",  done:false});
tasks.push({id:idCount++, task:"Submit assignment before friday", priority:"High", done:false});
tasks.push({id:idCount++, task:"Call the doctor for appointment", priority:"Medium", done:false});
renderTasks('All');
