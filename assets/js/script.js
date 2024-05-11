// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

const body = $('body');
const taskTitleInput = $('#task-title');
const taskDescriptionInput = $('#task-description');
const taskDateInput = $('#task-date');

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let task = {
    id : $.now(),
    title : taskTitleInput.val(),
    description : taskDescriptionInput.val(),
    date : taskDateInput.val(),
  }

  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  console.log(taskList);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // I think this can be to make a task card appear after making a new one, the render task list loads previously saved tasks on page load?
  // Also, rewrite this more concisely, like I did on the renderTaskList
  // Create elements
  const toDoSection = $('#todo-cards');
  const taskCardEl = $('<div class="task-card card m-4 mt-2">');
  const taskTitleEl = $('<h5 class="card-header">');
  const cardBodyEl = $('<div class="card-body">');
  const taskDescriptionEl = $('<p class="card-text">');
  const taskDateEl = $('<p class="card-text">');
  const deleteBtnEl = $('<button class="btn btn-danger delete">Delete</button>');

  // Add text
  // Todo: replace this test text with form input
  taskTitleEl.text(task.title);
  taskDescriptionEl.text(task.description);
  taskDateEl.text(task.date);

  // Print to To Do section
  toDoSection.prepend(taskCardEl);
  taskCardEl.append(taskTitleEl, cardBodyEl);
  cardBodyEl.append(taskDescriptionEl, taskDateEl, deleteBtnEl);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  taskList.forEach(task => {
    $('#todo-cards').prepend(`
      <div class = "task-card card m-4 mt-2 z-3" id=${task.id}>
        <h5 class="card-header">${task.title}</h5>
        <div class="card-body">
          <p class="card-text">${task.description}</p>
          <p class="card-text">${task.date}</p>
          <button class="btn btn-danger delete">Delete</button>
        </div>
      </div>
    `);
  });

    $('.task-card').draggable({
      cursor: 'move',
      revert: "invalid",
      zIndex: 100,
      // I need to figure out how to get the items to 'make room' for the dropped element and snap in place.. handleDrop function
    });
  };

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  const btnClicked = $(event.target);
  btnClicked.parents('.task-card').remove();
  // this deletes the task card element, but not from local storage
}

// listen for a click on element with class of delete
body.on('click', '.delete', handleDeleteTask);

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();


  const submitTask = $('#submit-task');

  submitTask.on('click', function (event) {
    event.preventDefault();
    generateTaskId();
    createTaskCard();
  })

  // listen for a click on element with class of delete
  body.on('click', '.delete', handleDeleteTask);

  $('.lane').droppable({
    //I need to figure out how to get the dropped elements to snap in place.. Prob a handleDrop function!
  });

});
