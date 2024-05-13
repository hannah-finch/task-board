/*
Ideas for improvement
- Sort taskList by due date instead of index so due soon goes to top of list
*/

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Generate a unique task id, vital to delete and sort tasks
function generateTaskId() {
  // generate nextId by getting it's timestamp, save in storage
  nextId = $.now();
  localStorage.setItem('nextId', nextId);
}

// Function to create a task card
function createTaskCard(task) {
  // create the card structure
  const taskCardEl =
  $(`<div class = "task-card card m-4 mt-2" id=${task.taskId}>
      <h5 class="card-header">${task.title}</h5>
      <div class="card-body">
        <p class="card-text">${task.description}</p>
        <p class="card-text">${task.date}</p>
        <button class="btn btn-danger border border-white delete">Delete</button>
      </div>
    </div>`);

  // append card to section coordinating with it's status property
  if (task.status === "done-cards") {
    $('#done-cards').append(taskCardEl);
  } else if (task.status === "in-progress-cards") {
    $('#in-progress-cards').append(taskCardEl);
  } else {
    $('#todo-cards').append(taskCardEl);
  }

  // use dayjs to add classes if something is due or past due
  const today = dayjs();
  let dueDate= dayjs(task.date);
  
  // only adds class if not done
  if (task.status !== "done-cards") {
    if (dueDate.isSame(today, 'day')) {
      taskCardEl.addClass('bg-warning text-white')
    } else if (dueDate.isBefore(today, 'day')) {
      taskCardEl.addClass('bg-danger text-white');
    }
  }
  
  // generate a new taskID each time a new task is made
  generateTaskId();

  // make the task cards draggable
  $('.task-card').draggable({
    revert: "invalid",
    zIndex: 100,
    appendTo: '.drop',
  })
}

// Function to render the task list. This creates a task card for each task in the array.
function renderTaskList() {
  taskList.forEach(task => {
    createTaskCard(task);
  });
}

// Function to handle adding a new task
function handleAddTask(event){
  // get input data
  const taskTitleInput = $('#task-title');
  const taskDescriptionInput = $('#task-description');
  const taskDateInput = $('#task-date');
  // create a new task
  let task = {
    title : taskTitleInput.val(),
    description : taskDescriptionInput.val(),
    date : taskDateInput.val(),
    // the status will change when dropped in a new lane
    status : 'todo-cards',
    // the taskId will be used to connect the task card element with its coordinating task in the taskList in local storage. Important for changing status and deleting.
    taskId : nextId,
  }

  // add the new task to the array and save to local storage
  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  // create a card for the new task
  createTaskCard(task);
}

// Function to handle deleting a task
function handleDeleteTask(event){
  //get the id of the task card (which I've set to coordinate with its task in storage, see createTaskCard function)
  let taskId = $(this).parents('.task-card').attr('id');
  //find the task in the array with matching taskId by it's index
  let toDelete = taskList.findIndex(task => task.taskId == taskId);
  //delete the task from the tasklist
  taskList.splice(toDelete, 1);
  //save the updated list back in storage
  localStorage.setItem('tasks', JSON.stringify(taskList));
  //remove the grandparent .task-card of the delete button that was clicked
  const btnClicked = $(event.target);
  btnClicked.parents('.task-card').remove();
}

//make lanes droppable
$(".drop").droppable({
  accept: '.task-card',
  // function to handle dropping a task into a new status lane
  drop: function(event, ui) {
    // get the id of the dropped task so I can change it in the array
    let taskId = ui.draggable.attr('id');
    // find the task in the array with matching taskId by it's index
    let toChange = taskList.find(task => task.taskId == taskId);
    // get the id of the lane it's dropped on and makes that the task's new status
    toChange.status = $(this).attr('id');
    // update the task list in local storage
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // clears and then re-renders task cards so the dropped card will appear in place in the new lane
    $('.drop').html("");
    renderTaskList();
  }
});

// on page load...
$(document).ready(function () {
  //render task cards if there are some in storage
  if (taskList != []) {
    renderTaskList();
  }

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
});

