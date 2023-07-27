(function () {

    // создаем и возвращаем заколовок
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary')
        button.textContent = 'Добавить дело';
        button.setAttribute('disabled', true);

        input.addEventListener('input', function() {
            if (input.value.trim() === '') {
              button.setAttribute('disabled', true);
            } else {
              if (button.hasAttribute('disabled')) {
                button.removeAttribute('disabled');
              }
            }
        });

        input.addEventListener('blur', function() {
            if (input.value.trim() === '') {
                button.setAttribute('disabled', true);
            }
        });

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);


        return {
            form,
            input,
            button,
        };
    }

    // создаем и возвращаем список
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {

        let todo = {name};

        let item = document.createElement('li');

        item.textContent = todo.name;

        // кнопки перемещаем в элемент, который покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок в его 
        // правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };

    }

    let todos = [];

    function createTodoApp(container, title = 'Список дел', listName) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // проверяем наличие данных в localStorage
        if (localStorage.getItem(listName)) {
            todos = JSON.parse(localStorage.getItem(listName));

            // отрисовываем элементы списка из массива todos
            todos.forEach(function (todo) {

                let todoItem = createTodoItem(todo.name);
                todoItem.item.setAttribute('id', todo.id);

                if (todo.done) {
                    todoItem.item.classList.add('list-group-item-success');
                }

                todoItem.doneButton.addEventListener('click', function() {
                    todoItem.item.classList.toggle('list-group-item-success')
                    todo.done = true;
                    saveToLocalStorage(listName);
                });

                todoItem.deleteButton.addEventListener('click', function() {
                    let index = todos.findIndex(function(todo){
                        return todo.id === todo.id;
                    });
                    todos.splice(index, 1);
                    if (confirm('Вы уверены?')) {
                        todoItem.item.remove();
                    }
                    saveToLocalStorage(listName);
                });
                todoList.append(todoItem.item);
            })
        }
        
        // submit для на форме по нажатию Enter или на кнопку по созданию дела
        todoItemForm.form.addEventListener('submit', function(e) {

            // чтобы не было перезагрузки при отправки формы
            e.preventDefault();

            let newTask = {
                name: todoItemForm.input.value,
                id: Date.now(),
                done: false,
            };
    
            todos.push(newTask);
            console.log(todos);

            // игнорируем создание элемента при пустом поле
            if (!todoItemForm.input.value) {
                return;
            } 
            
            let todoItem = createTodoItem(todoItemForm.input.value);

            todoItem.item.setAttribute('id', newTask.id);

            let id = Number(todoItem.item.id);

            let index = todos.findIndex(function(todo){
                if (todo.id === id) {
                    return true;
                }
            });

            // добавляем обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success')
                newTask.done = true;
                saveToLocalStorage(listName);
            });
            todoItem.deleteButton.addEventListener('click', function() {
                newTask.done = false;
                todos.splice(index, 1);
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();
                }
                saveToLocalStorage(listName);
            });

            // создаем и добавляем в список новое дело с названием из поля ввода
            todoList.append(todoItem.item);

            // обнуляем значение в поле, чтобы не пришлось делать вручную
            todoItemForm.input.value = '';
            saveToLocalStorage(listName);
        });
    }

    function saveToLocalStorage(listName) {
        localStorage.setItem(listName, JSON.stringify(todos))
    }

    window.createTodoApp = createTodoApp;
}) ();
