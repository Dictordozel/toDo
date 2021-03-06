// 'use strict';

document.addEventListener('DOMContentLoaded', function() {
const form = document.querySelector('.todo-control');
const todoCont = document.getElementById('todo');
const completedCont = document.getElementById('completed');
const headerInput = document.querySelector('.header-input');

// создаем объект

let data = {

    todo: [],
    completed: []
};

// проверка LocalStorage на наличие данных

if(localStorage.getItem('localData')) {
    data = JSON.parse(localStorage.getItem('localData'));
}

// рендер сохраненных (если есть) данных в LocalStorage

const renderUpdateItems = function() {
if(!data.todo && !data.completed) { 
return;
}
for(let i = 0; i < data.todo.length; i++) {
renderItem(data.todo[i]);
}
for(let i = 0; i < data.completed.length; i++) {
renderItem(data.completed[i], true);
}
};

// функция которая заносит данные в Storage

const dataUpdateStorage = function() {
localStorage.setItem('localData', JSON.stringify(data));
};

// функция добавляет элемент на страницу 

const addItem = function(text) {
renderItem(text);
headerInput.value = ''; // очистка поля ввода
data.todo.push(text); // отправка данных

dataUpdateStorage(); // обновление Storage
};

// Функция удаляет элемент из родителя (todo)

const itemRemove = function(elem) {
const item = elem.parentNode.parentNode;
const itemParent = item.parentNode;
const id = itemParent.id;
const text = item.textContent;

if(id === 'todo') {
data.todo.splice(data.todo.indexOf(text), 1);
} else {
data.completed.splice(data.completed.indexOf(text), 1);   
}

itemParent.removeChild(item);

dataUpdateStorage();
};

// переносит элемент

const itemComplete = function(elem) {
const item = elem.parentNode.parentNode;
const itemParent = item.parentNode;
const id = itemParent.id;
const text = item.textContent;

let target;    
if(id === 'todo') {
target = completedCont;
} else {
target = todoCont;
}

if(id === 'todo') {
data.todo.splice(data.todo.indexOf(text), 1);
data.completed.push(text);
} else {
data.completed.splice(data.completed.indexOf(text), 1); 
data.todo.push(text);   
}

itemParent.removeChild(item);
target.insertBefore(item, target.childNodes[0]);

dataUpdateStorage();
};

// Функция рендеринга одного элемента

const renderItem = function(text, completed = false) {

// создаем элементы    
const item = document.createElement('li');
const btnBlock = document.createElement('div');
const btnRemove = document.createElement('button');
const btnComplete = document.createElement('button');

let list;
if(completed) {
    list = completedCont;
} else {
    list = todoCont;
}

//создаем классы
item.classList.add('todo-item');
btnBlock.classList.add('todo-buttons');
btnRemove.classList.add('todo-remove');
btnComplete.classList.add('todo-complete');

btnRemove.addEventListener('click', function(event) {
itemRemove(event.target);
});

btnComplete.addEventListener('click', function(event) {
itemComplete(event.target);
});

item.textContent = text;
//создаем блоки
btnBlock.appendChild(btnRemove);
btnBlock.appendChild(btnComplete);
item.appendChild(btnBlock);

// помещаем созданный блок item в блок todoCont перед первым(индекс[0]) "ребенком" блока 
list.insertBefore(item, list.childNodes[0]);

};

// обработчик формы
form.addEventListener('submit', function(event) {
event.preventDefault();

if(headerInput.value !== '') {
addItem(headerInput.value.trim());
}
});

renderUpdateItems();

});