// API URL
const apiUrl = '/api/TodoItems';

// DOM элементы
const todosList = document.getElementById('todos-list');
const addNameInput = document.getElementById('add-name');
const addButton = document.getElementById('add-button');
const editDiv = document.getElementById('editTodo');
const editIdInput = document.getElementById('edit-id');
const editNameInput = document.getElementById('edit-name');
const editIsCompleteInput = document.getElementById('edit-isComplete');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');

// События
addButton.addEventListener('click', addTodo);
saveButton.addEventListener('click', saveTodo);
cancelButton.addEventListener('click', cancelEdit);

// Загрузка задач при открытии страницы
document.addEventListener('DOMContentLoaded', getTodos);

// GET - получить все задачи
function getTodos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayTodos(data))
        .catch(error => console.error('Не удалось получить задачи.', error));
}

// POST - добавить новую задачу
function addTodo() {
    const name = addNameInput.value.trim();
    if (name === '') {
        alert('Название задачи не может быть пустым');
        return;
    }

    const item = {
        name: name,
        isComplete: false
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getTodos();
            addNameInput.value = '';
        })
        .catch(error => console.error('Не удалось добавить задачу.', error));
}

// PUT - обновить задачу
function saveTodo() {
    const todoId = parseInt(editIdInput.value);
    const item = {
        id: todoId,
        name: editNameInput.value.trim(),
        isComplete: editIsCompleteInput.checked
    };

    fetch(`${apiUrl}/${todoId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            getTodos();
            closeEditForm();
        })
        .catch(error => console.error('Не удалось обновить задачу.', error));
}

// DELETE - удалить задачу
function deleteTodo(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getTodos())
        .catch(error => console.error('Не удалось удалить задачу.', error));
}

// Показать форму редактирования
function showEditForm(id, name, isComplete) {
    editIdInput.value = id;
    editNameInput.value = name;
    editIsCompleteInput.checked = isComplete;
    editDiv.style.display = 'block';
}

// Закрыть форму редактирования
function closeEditForm() {
    editDiv.style.display = 'none';
}

// Отменить редактирование
function cancelEdit() {
    closeEditForm();
}

// Отобразить задачи в таблице
function displayTodos(data) {
    todosList.innerHTML = '';

    data.forEach(item => {
        const tr = document.createElement('tr');

        // Ячейка с названием
        const nameTd = document.createElement('td');
        nameTd.textContent = item.name;
        tr.appendChild(nameTd);

        // Ячейка с чекбоксом (статус выполнения)
        const isCompleteTd = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.isComplete;
        checkbox.disabled = true;
        isCompleteTd.appendChild(checkbox);
        tr.appendChild(isCompleteTd);

        // Ячейка с кнопками действий
        const actionsTd = document.createElement('td');
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '8px';

        // Кнопка редактирования
        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            showEditForm(item.id, item.name, item.isComplete);
        });
        buttonContainer.appendChild(editButton);

        // Кнопка удаления
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            deleteTodo(item.id);
        });
        buttonContainer.appendChild(deleteButton);

        actionsTd.appendChild(buttonContainer);
        tr.appendChild(actionsTd);
        todosList.appendChild(tr);
    });
}