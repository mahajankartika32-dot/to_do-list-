document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDatetime = document.getElementById('task-datetime');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    // Load tasks from localStorage
    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDate = taskDatetime.value;

        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            datetime: taskDate,
            completed: false
        };

        createTaskElement(task);
        saveTask(task);
        
        taskInput.value = '';
        taskDatetime.value = '';
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.classList.add('task-item');
        if (task.completed) {
            li.classList.add('completed');
        }
        li.dataset.id = task.id;

        const taskDetails = document.createElement('div');
        taskDetails.classList.add('task-details');

        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('task-text');
        taskTextSpan.textContent = task.text;

        const taskInfoSpan = document.createElement('span');
        taskInfoSpan.classList.add('task-info');
        if (task.datetime) {
            const dateObj = new Date(task.datetime);
            taskInfoSpan.textContent = `Due: ${dateObj.toLocaleString()}`;
        }

        taskDetails.appendChild(taskTextSpan);
        taskDetails.appendChild(taskInfoSpan);
        
        li.appendChild(taskDetails);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-btn');
        completeButton.textContent = 'Complete';
        
        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Delete';

        actionsDiv.appendChild(completeButton);
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    }

    function handleTaskActions(event) {
        const target = event.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = parseInt(taskItem.dataset.id);

        if (target.classList.contains('complete-btn')) {
            toggleComplete(taskId);
        } else if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (target.classList.contains('edit-btn')) {
            editTask(taskId, taskItem);
        }
    }

    function toggleComplete(id) {
        let tasks = getTasks();
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks(tasks);
        renderTasks();
    }

    function deleteTask(id) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        renderTasks();
    }

    function editTask(id, taskItem) {
        const taskTextSpan = taskItem.querySelector('.task-text');
        const currentText = taskTextSpan.textContent;
        const newText = prompt('Edit your task:', currentText);

        if (newText && newText.trim() !== '') {
            let tasks = getTasks();
            tasks = tasks.map(task => 
                task.id === id ? { ...task, text: newText.trim() } : task
            );
            saveTasks(tasks);
            renderTasks();
        }
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasks();
        taskList.innerHTML = '';
        tasks.forEach(task => createTaskElement(task));
    }

    function renderTasks() {
        loadTasks();
    }
});