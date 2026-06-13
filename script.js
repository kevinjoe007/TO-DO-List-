 var tasks = [];
  var idCount = 1;
  var currentTab = 'all';

  function submitForm() {
    var title    = document.getElementById('taskTitle').value.trim();
    var note     = document.getElementById('taskNote').value.trim();
    var priority = document.getElementById('taskPriority').value;
    var category = document.getElementById('taskCategory').value;
    var due      = document.getElementById('taskDue').value;
    var editId   = document.getElementById('editId').value;

    if (title == '') {
      document.getElementById('errMsg').style.display = 'block';
      return;
    }
    document.getElementById('errMsg').style.display = 'none';

    if (editId != '') {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == editId) {
          tasks[i].title    = title;
          tasks[i].note     = note;
          tasks[i].priority = priority;
          tasks[i].category = category;
          tasks[i].due      = due;
        }
      }
      showToast('✏️ Task updated successfully!');
      clearForm();
    } else {
      var task = {
        id: idCount++,
        title: title,
        note: note,
        priority: priority,
        category: category,
        due: due,
        done: false,
        createdAt: new Date().toISOString()
      };
      tasks.push(task);
      showToast('✅ Task added successfully!');
      clearForm();
    }
    renderTasks();
  }

  function clearForm() {
    document.getElementById('editId').value       = '';
    document.getElementById('taskTitle').value    = '';
    document.getElementById('taskNote').value     = '';
    document.getElementById('taskPriority').value = 'Medium';
    document.getElementById('taskCategory').value = 'General';
    document.getElementById('taskDue').value      = '';
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('formHeading').textContent = '➕ Add New Task';
    document.getElementById('submitBtn').textContent   = '+ Add Task';
  }

  function editTask(id) {
    var t = null;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) { t = tasks[i]; break; }
    }
    if (!t) return;
    document.getElementById('editId').value       = t.id;
    document.getElementById('taskTitle').value    = t.title;
    document.getElementById('taskNote').value     = t.note;
    document.getElementById('taskPriority').value = t.priority;
    document.getElementById('taskCategory').value = t.category;
    document.getElementById('taskDue').value      = t.due;
    document.getElementById('formHeading').textContent = '✏️ Edit Task';
    document.getElementById('submitBtn').textContent   = 'Update Task';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    var newList = [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id != id) newList.push(tasks[i]);
    }
    tasks = newList;
    showToast('🗑️ Task deleted.');
    renderTasks();
  }

  function toggleDone(id) {
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        tasks[i].done = !tasks[i].done;
        showToast(tasks[i].done ? '🎉 Task completed!' : '↩️ Marked as pending');
        break;
      }
    }
    renderTasks();
  }

  function setTab(tab, btn) {
    currentTab = tab;
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    btn.classList.add('active');
    renderTasks();
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  }

  function isDueToday(dateStr) {
    if (!dateStr) return false;
    var today = new Date().toISOString().slice(0, 10);
    return dateStr === today;
  }

  function isOverdue(dateStr) {
    if (!dateStr) return false;
    var today = new Date().toISOString().slice(0, 10);
    return dateStr < today;
  }

  function renderTasks() {
    var search   = document.getElementById('searchInput').value.toLowerCase();
    var priF     = document.getElementById('filterPriority').value;
    var catF     = document.getElementById('filterCategory').value;
    var sortBy   = document.getElementById('sortBy').value;

    var filtered = [];
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];
      if (currentTab === 'pending' && t.done)  continue;
      if (currentTab === 'done'    && !t.done) continue;
      if (priF !== 'All' && t.priority !== priF)   continue;
      if (catF !== 'All' && t.category !== catF)   continue;
      if (search && t.title.toLowerCase().indexOf(search) === -1 &&
          t.note.toLowerCase().indexOf(search) === -1) continue;
      filtered.push(t);
    }

    // sort
    filtered.sort(function(a, b) {
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        var order = { High:0, Medium:1, Low:2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'due') {
        if (!a.due) return 1; if (!b.due) return -1;
        return a.due < b.due ? -1 : 1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // stats
    var total = tasks.length;
    var done  = 0;
    var high  = 0;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].done)              done++;
      if (tasks[i].priority === 'High') high++;
    }
    document.getElementById('sTotal').textContent   = total;
    document.getElementById('sPending').textContent = total - done;
    document.getElementById('sDone').textContent    = done;
    document.getElementById('sHigh').textContent    = high;

    var pct = total === 0 ? 0 : Math.round((done / total) * 100);
    document.getElementById('progressPct').textContent  = pct + '%';
    document.getElementById('progressFill').style.width = pct + '%';

    var container = document.getElementById('taskList');

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>No tasks found</p></div>';
      return;
    }

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var t = filtered[i];
      var doneClass  = t.done ? ' is-done'  : '';
      var titleClass = t.done ? ' done'      : '';
      var checkClass = t.done ? ' checked'   : '';
      var checkMark  = t.done ? '✓'          : '';

      var dueTxt = '';
      if (t.due) {
        if (isOverdue(t.due) && !t.done) {
          dueTxt = '<span style="color:#e74c3c;">⚠ Overdue · ' + formatDate(t.due) + '</span>';
        } else if (isDueToday(t.due)) {
          dueTxt = '<span style="color:#f39c12;">📅 Due Today</span>';
        } else {
          dueTxt = '<span>📅 ' + formatDate(t.due) + '</span>';
        }
      }

      html += '<div class="task-card priority-' + t.priority + doneClass + '" id="card-' + t.id + '">';
      html += '  <div class="card-top">';
      html += '    <div class="custom-check' + checkClass + '" onclick="toggleDone(' + t.id + ')">' + checkMark + '</div>';
      html += '    <div class="task-title' + titleClass + '">' + t.title + '</div>';
      html += '    <span class="badge badge-' + t.priority + '">' + t.priority + '</span>';
      html += '  </div>';

      if (t.note) {
        html += '  <div class="task-note">' + t.note + '</div>';
      }

      html += '  <div class="card-meta">';
      html += '    <span>🗂 ' + t.category + '</span>';
      if (dueTxt) html += '    <span>' + dueTxt + '</span>';
      html += '    <span>🕐 ' + new Date(t.createdAt).toLocaleDateString('en-IN') + '</span>';
      html += '  </div>';

      html += '  <div class="card-actions">';
      html += '    <button class="act-btn btn-edit"   onclick="editTask('   + t.id + ')">✏ Edit</button>';
      html += '    <button class="act-btn btn-delete" onclick="deleteTask(' + t.id + ')">🗑 Delete</button>';
      html += '  </div>';
      html += '</div>';
    }

    container.innerHTML = html;
  }

  function showToast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(function() { el.style.display = 'none'; }, 2500);
  }

  // Enter key on title field
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('taskTitle').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') submitForm();
    });
  });

  // Sample data
  tasks.push({ id:idCount++, title:'Complete Web Development project', note:'Submit before deadline', priority:'High', category:'Study', due: new Date(Date.now()+86400000).toISOString().slice(0,10), done:false, createdAt:new Date().toISOString() });
  tasks.push({ id:idCount++, title:'Buy groceries', note:'Milk, eggs, bread, vegetables', priority:'Medium', category:'Shopping', due:'', done:false, createdAt:new Date(Date.now()-86400000).toISOString() });
  tasks.push({ id:idCount++, title:'Morning workout', note:'30 min jog + stretching', priority:'Low', category:'Health', due:'', done:true, createdAt:new Date(Date.now()-172800000).toISOString() });

  renderTasks();