//находим элементы
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

//функции
function addTask(event) {
  //Отмена отправки формы
  event.preventDefault();
  //достаем текст задачи из поля ввода
  const taskText = taskInput.value;
  if (taskText === "") {
    // ".list-group-item".css("display", "none");
    //} else {
    // ".list-group-item".css("display", "block");
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //добавляем задачу в массив с задачами

  if (newTask.text === "") {
    alert("Добавьте новую задачу!");
    let filteredArr = tasks.filter(newTask);
    return filteredArr;
  }
  tasks.push(newTask);
  //сохраняем список задач в хранилище браузера LocalStorage
  saveToLocalStorage();

  renderTask(newTask);

  //очистить поле ввода
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  //проверяем если  клик был не по кнопке 'удалить задачу'
  if (event.target.dataset.action !== "delete") return;

  // проверяем что клик был по кнопке "удалить задачу"
  const parentNode = event.target.closest(".list-group-item");

  //определяем id задачи
  const id = Number(parentNode.id);

  //удаляем задачу через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id);

  //сохраняем список задач в хранилище браузера LocalStorage
  saveToLocalStorage();

  //удаляем задачу из разметки
  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  //проверяем что клик был не по кнопке 'задача выполнена'
  if (event.target.dataset.action !== "done") return;
  //проверяем что клик был по кнопке "задача выполнена"
  const parentNode = event.target.closest(".list-group-item");

  // определяем id задачи
  const id = Number(parentNode.id);

  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  //сохраняем список задач в хранилище браузера LocalStorage
  saveToLocalStorage();

  //console.log(task);
  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img width="48" class="mt-3" src="img/note.png" alt="">
    <div class="empty-list__title">Список дел пуст</div>
</li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  //формируем CSS класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  //новая задача
  const taskHTML = `
                   <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                   <span class="${cssClass}">${task.text}</span>
                   <div class="task-item__buttons">
                   <button type="button" data-action="done" class="btn-action">
                   <img src="img/галочка.jpg" alt="right" width="18" height="18">
                   </button>

                  <button type="button" data-action="delete" class="btn-action">
                  <img src="img/крестик.jpg" alt="wrong" width="18" height="18">
                  </button>
                  </div>
                  </li>`;
  //Добавляем задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
