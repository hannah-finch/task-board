/*
Ideas for improvement
- Sort taskList by due date instead of index so due soon goes to top of list
- Get the cards to drop in place without reloading the page... running the renderTaskList function again will duplicate all the cards, so I'd have to clear all the cards first. It also leaves the dropped card (duplicated) right where it is. Changing the css position of the dropped card to relative has so far not worked either.
Oh maybe....innerHTML="" and then renderTaskList. Try that later
*/

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Generate a unique task id
// This is vital to delete and arrange tasks
function generateTaskId() {
  // generate nextId by getting it's timestamp, save in storage
  nextId = $.now();
  localStorage.setItem('nextId', nextId);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
 
  const taskCardEl =
  $(`<div class = "task-card card m-4 mt-2" id=${task.taskId}>
      <h5 class="card-header">${task.title}</h5>
      <div class="card-body">
        <p class="card-text">${task.description}</p>
        <p class="card-text">${task.date}</p>
        <button class="btn btn-danger border border-white delete">Delete</button>
      </div>
    </div>`);

  // append card to right section (maybe this could go in render function?)
  if (task.status == "done-cards") {
    $('#done-cards').append(taskCardEl);
  } 
  else if (task.status == "in-progress-cards") {
    $('#in-progress-cards').append(taskCardEl);
  } 
  else {
    $('#todo-cards').append(taskCardEl);
  }

  // use dayjs to add classes if something is due or past due
  const today = dayjs();
  let dueDate= dayjs(task.date);
  
  // only adds class if not done
  if (task.status != "done-cards") {
    if (dueDate.isSame(today, 'day')) {
      taskCardEl.addClass('bg-warning text-white')
    } else if (dueDate.isBefore(today, 'day')) {
      taskCardEl.addClass('bg-danger text-white');
    }
  }
  
  // generate a new taskID each time a task is made
  generateTaskId();

  // make the task cards draggable
  $('.task-card').draggable({
    revert: "invalid",
    zIndex: 100,
    appendTo: '.drop',
  })
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  taskList.forEach(task => {
    createTaskCard(task);
    // cardColor(task);
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  // this function should use form data to make a new task, add it to the taskList, and maybe also create a card for it?

  const taskTitleInput = $('#task-title');
  const taskDescriptionInput = $('#task-description');
  const taskDateInput = $('#task-date');

  let task = {
    title : taskTitleInput.val(),
    description : taskDescriptionInput.val(),
    date : taskDateInput.val(),
    status : 'todo',
    taskId : nextId,
  }

  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  console.log(taskList);

  createTaskCard(task);
}

// Function to handle deleting a task

function handleDeleteTask(event){
  //gets the id of the task card (which I've set to coordinate with its task in storage, see createTaskCard function)
  let taskId = $(this).parents('.task-card').attr('id');
  console.log(taskId);
  //finds the task in the array with matching taskId by it's index
  let toDelete = taskList.findIndex(task => task.taskId == taskId);
  //deletes the task from the tasklist
  taskList.splice(toDelete, 1);
  console.log(taskList);
  //saves the updated list back in storage
  localStorage.setItem('tasks', JSON.stringify(taskList));
  //removes the grandparent .task-card of the delete button that was clicked
  const btnClicked = $(event.target);
  btnClicked.parents('.task-card').remove();
}

// Todo: create a function to handle dropping a task into a new status lane
// I actually wrote this below on page load, consider moving it here, or delete this function
function handleDrop(event, ui) {

}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  //render task cards on page load
  renderTaskList();

  // make the date input a date picker
  $('#task-date').datepicker();

  // make submit task button handleAddTask
  const submitTask = $('#submit-task');
  submitTask.on('click', function(event) {
    event.preventDefault();
    handleAddTask();
  });

  // handleDeleteTask on click of any delete button in body
  const body = $('body');
  body.on('click', '.delete', handleDeleteTask);

  $(".drop").droppable({
    accept: '.task-card',
    drop: function(event, ui) {
      // gets the id of the dropped task so I can change it in the array
      let taskId = ui.draggable.attr('id');
      // finds the task in the array with matching taskId by it's index
      let toChange = taskList.find(task => task.taskId == taskId);
      // gets the id of the lane it's dropped on and makes that the task's status
      let newStatus = $(this).attr('id');
      toChange.status = newStatus;

      console.log(toChange);
      localStorage.setItem('tasks', JSON.stringify(taskList));
      console.log(taskList);

      // reloads the page so the cards are rendered in their lanes, not overlapping and not hidden under the lane.
      location.reload();

      // Currently this function is not necessary
      handleDrop();
    }

  });
});

