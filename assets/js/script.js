/*
Left to do:
- Write handle drop function
- Make date input fancy with jQuery ui
- Make color change when due and past due
- Make add task modal button also close modal

*/




// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const body = $('body');

// Todo: create a function to generate a unique task id
function generateTaskId() {
  nextId = $.now();
  localStorage.setItem('nextId', nextId);
}
// the id of the card should be the same value as the taskId in storage, so I can find the card id to get the storage with same taskId to delete.


// Todo: create a function to create a task card
function createTaskCard(task) {
 
  const taskCardEl =
  $(`<div class = "task-card card m-4 mt-2" id=${task.taskId}>
      <h5 class="card-header">${task.title}</h5>
      <div class="card-body">
        <p class="card-text">${task.description}</p>
        <p class="card-text">${task.date}</p>
        <button class="btn btn-danger delete">Delete</button>
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
      taskCardEl.addClass('due-today')
    } else if (dueDate.isBefore(today, 'day')) {
      taskCardEl.addClass('past-due')
    }
  }
  

 


  // const today = dayjs();
  // let dueDate= dayjs(task.date);

  // if (dueDate.isSame(today, 'day')) {

  // }

  // // maybe get element of matching id and change color
  //   let dueTask = taskList.find(task => (dayjs(task.date) == dayjs()));

  //   let dueTaskId = dueTask.id;
  //   console.log(dueTaskId);
  //   // $(`#${dueTaskId}`).addClass('bg-warning text-white');



  generateTaskId();

  $('.task-card').draggable({
    revert: "invalid",
    zIndex: 100,
    appendTo: '.drop',
  })
}

// function cardColor(task) {
//   const today = dayjs();
//   let dueDate= dayjs(task.date);

//   if (dueDate.isSame(today, 'day')) {
//     taskCardEl.child.addClass('due-today')
//   }
// }

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

// Todo: create a function to handle deleting a task
// How I'm thinking this might work... I know I can delete the element from the page by getting the button's parents with class .taskCard. I also need to get task from array with taskID matching the id of the card. Actually, moving that id off the card and on to the button instead should save a step.
//So maybe... get id of button and make it a variable... get task from array with taskId == variable... delete that task from the array... update the array in storage... then delete the taskCard element.

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
// when something is dropped, it's status attribute should update, if dropped in done, it's extra background/text color classes and such should be removed... Wait I have to have it saved in local, so I'll have to get the task with matching Id as a variable, change its status property, and save it back into storage... It's in an array, so I'll probably have to reset the whole array with that object updated
// maybe when I drop it has to update the array, clear all the cards, and re render them? Then it'd be sorted... seems too messy to be right
// so maybe... if get task of matching id... if dropped on #to-do-cards, change status property to todo, on #in-progress-cards change to in-progress, on #done change status to done AND remove extra classes from the element... update the task in the array... update the array in local storage
function handleDrop(event, ui) {
  // let thisCard = $(this);
  // let taskId = $('.task-card').attr('id');

  // let taskId = ui.draggable.attr('id');
  // alert(taskId);
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  renderTaskList();

  // make the input a date picker
  $('#task-date').datepicker();

  const submitTask = $('#submit-task');
  submitTask.on('click', function(event) {
    event.preventDefault();
    handleAddTask();
  });

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
      // I bet there is a better way to do this... running the renderTaskList function again will duplicate all the cards, so I'd have to clear all the cards first. It also leaves the dropped card (duplicated) right where it is. Changing the css position of the dropped card to relative has so far not worked either.
      //Oh maybe....innerHTML="" and then renderTaskList. Try that later
      location.reload();

      handleDrop();
    }

  });
});

/*
pseudo-code a drop:

on drop...
- get the object from the array that matches the id of the delete button (maybe I should put the id on the div instead of button?)
- change that object's status attribute
- update the array in storage

- append the element to the new parent (see if that one div is taking whole space or not)
- make the element snap in line
  - maybe either make the element's position be relative to parent
  - or maybe sort the parent according to id#
  - or maybe look into the sortable attribute



*/


