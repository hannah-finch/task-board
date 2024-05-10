/*
Where I'm at:

Crete task card is functioning, currently using test text. Need to replace it with form input.

Delete button works.
*/


// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const body = $('body');

// Todo: create a function to generate a unique task id
function generateTaskId() {

}

// Function to create a task card
function createTaskCard(task) {
  // Create elements
  const toDoSection = $('#todo-cards');
  const taskCardEl = $('<div class="task-card card m-4 mt-2">');
  const taskNameEl = $('<h5 class="card-header">');
  const cardBodyEl = $('<div class="card-body">');
  const taskDescriptionEl = $('<p class="card-text">');
  const taskDateEl = $('<p class="card-text">');
  const deleteBtnEl = $('<button class="btn btn-danger delete">Delete</button>');

  // Add text
  // Todo: replace this test text with form input
  taskNameEl.text('Test Name');
  taskDescriptionEl.text('Test description');
  taskDateEl.text('test date');

  // Print to To Do section
  toDoSection.prepend(taskCardEl);
  taskCardEl.append(taskNameEl, cardBodyEl);
  cardBodyEl.append(taskDescriptionEl, taskDateEl, deleteBtnEl);
}

createTaskCard(); // here temporarily to test

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// function to handle deleting a task
function handleDeleteTask(event){
  const btnClicked = $(event.target);
  btnClicked.parents('.task-card').remove();
}

// uses delegation on the body to listen for a click on element with class of delete
body.on('click', '.delete', handleDeleteTask);

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
