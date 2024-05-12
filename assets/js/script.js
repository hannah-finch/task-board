/*
PSEUDO CODE:

After the page loads:
  - task cards should render sorted according to status
If a user adds a task:
  - a unique id is generated for the task
  - the task is assigned a to-do status
  - the task is saved to local storage
  - the task is added to the to-do lane
If a user drags the task:
  - the position should update to append or snap in line with the parent lane
  If the task is dropped in the progress lane
    - the status should be updated to in-progress
    - the new status should be updated in local storage
  IF the task is dropped in the done lane
    - the status should be updated to done
    - any bg-warning text-white border border-white classes should be removed
    - the new status should be updated to done
If a user clicks the delete button
  - the associated task of that id should be deleted from local storage
  - the task card element should also be deleted

*/


// This is an example task list so I could test the renderTaskList function.
// const taskList = [{title : 'To do', description: 'test description', date: 'Test date', status: 'todo', taskId: 1,}, {title : 'In progress', description: 'test description', date: 'Test date', status: 'in-progress', taskId: 2,}, {title : 'Done', description: 'test description', date: 'Test date', status: 'done', taskId: 3,},]



// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  nextId = $.now();
  localStorage.setItem('nextId', nextId);
}
// the id of the card should be the same value as the taskId in storage, so I can find the card id to get the storage with same taskId to delete.
// Todo: create a function to create a task card
function createTaskCard(task) {
  if (task.status == "done") {
    $('#done-cards').append(`
      <div class = "task-card card m-4 mt-2" id=${task.taskId}>
        <h5 class="card-header">${task.title}</h5>
        <div class="card-body">
          <p class="card-text">${task.description}</p>
          <p class="card-text">${task.date}</p>
          <button class="btn btn-danger delete">Delete</button>
        </div>
      </div>
    `);
  } else if (task.status == "in-progress") {
    $('#in-progress-cards').append(`
    <div class = "task-card card m-4 mt-2" id=${task.taskId}>
      <h5 class="card-header">${task.title}</h5>
      <div class="card-body">
        <p class="card-text">${task.description}</p>
        <p class="card-text">${task.date}</p>
        <button class="btn btn-danger delete">Delete</button>
      </div>
    </div>
  `);
  } else {
    $('#todo-cards').append(`
    <div class = "task-card card m-4 mt-2" id=${task.taskId}>
      <h5 class="card-header">${task.title}</h5>
      <div class="card-body">
        <p class="card-text">${task.description}</p>
        <p class="card-text">${task.date}</p>
        <button class="btn btn-danger delete">Delete</button>
      </div>
    </div>
  `);
  }

  generateTaskId();

  $('.task-card').draggable({
    revert: "invalid",
    zIndex: 100,
  })
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  taskList.forEach(task => {
    createTaskCard(task);
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
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  renderTaskList();

  const submitTask = $('#submit-task');

  submitTask.on('click', function(event) {
    event.preventDefault();
    handleAddTask();
  });

});
