const navButtons = document.querySelectorAll("[data-nav]");
const allSections = document.querySelectorAll(".view");
const todo_Foam = document.querySelector("#todo-form");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById('addTaskBtn');
const todoFilterBtns = document.querySelectorAll('[data-filter]')
const clockDisplay = document.getElementById('clockDisplay');
// const clockPeriod = document.getElementById('clockService');
const dateDisplay = document.getElementById('dateDisplay');

const now = new Date();

const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
const customDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);

const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
const customTime = timeString.split(' ')[0]; 
const customPeriod = timeString.split(' ')[1].toUpperCase(); 


clockDisplay.innerHTML = `${customTime} <span class="datetime-widget__meridiem" >${customPeriod}</span>`;
dateDisplay.textContent = customDate

let tasks = [
  
  ]
let updateId = null;

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSection = document.getElementById(button.dataset.nav);
    allSections.forEach((element) => {
      element.classList.remove("view--active");
      targetSection.classList.add("view--active");
    });
  });
});

todo_Foam.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("newTaskInput").value;

  if (input.trim() === "") {
    alert("please fill input");
    return;
  } else {
    let inpObj = {
      id: Date.now(),
      title: input,
      completed: false,
      important: false,
    };

    
    // console.log(checkId)

    if(updateId !== null){
      let task = tasks.find(elem => elem.id === updateId);
         task.title = input;
         updateId = null
         
          addTaskBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add task" ;
         renderTasks(tasks)
    }else{
      
      tasks.push(inpObj);
      renderTasks(tasks);
    }
    // console.log(tasks)
  }

  todo_Foam.reset();
});

todoFilterBtns.forEach(button => {
  button.addEventListener('click' , ()=>{
    todoFilterBtns.forEach(btn => {

      btn.classList.remove('filter-chip--active')

    });

    const filterBtn = button.dataset.filter;
    console.log(filterBtn)
    
    if(filterBtn === "all"){
      button.classList.add('filter-chip--active');
      renderTasks(tasks)
    }

     if(filterBtn === "completed"){
      const completed = tasks.filter(task => task.completed === true )
      button.classList.add('filter-chip--active');
      renderTasks(completed)
    }
    if (filterBtn === "important"){
       const important = tasks.filter(task => task.important === true )
      button.classList.add('filter-chip--active');
       renderTasks(important)
    }
    if(filterBtn === "active"){
      const aciveTasks = tasks.filter(task => task.completed  === false && task.important === false )
      button.classList.add('filter-chip--active');
      renderTasks(aciveTasks)
    }


      })

});

renderTasks(tasks); 

function renderTasks(data = tasks) {
  console.log(data)
  taskList.innerHTML = "";

  data.forEach((task) => {
    taskList.innerHTML += `
    <li class="task-item">
    <label class="task-item__check">
    <input type="checkbox" onclick="completedTask(${task.id})" ${task.completed ? "checked" : ""} >
              <span class="task-item__box"><i class="fa-solid fa-check"></i></span>
            </label>
            <span class="${task.completed ? "task-item__text task-item__text--done" : "task-item__text"}">${task.title}</span>
            ${(task.completed
        ? "<span class='badge badge--success'>Completed</span>"
        : "") ||
      (task.important
        ? "<span class='badge badge--warning'>Important</span>"
        : "")
      }

            <button class="${task.important ? "icon-btn badge--warning" : "icon-btn icon-btn--waring"}" onclick="importantTask(${task.id})" }  type="button" aria-label="Important task">
              <i class="${task.important ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
            </button>
            <button class="icon-btn icon-btn--primary" onclick="editTask(${task.id})" aria-label="Edit Task">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button onclick='deleteTask(${task.id})' class="icon-btn icon-btn--danger" type="button" aria-label="Delete task">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </li>
          `;
  });
}

const deleteTask = (id) => {
  tasks = tasks.filter((elem) => elem.id !== id);
  // console.log(task)
  renderTasks(tasks);
};

const completedTask = (id) => {
  tasks.forEach((task) => {
    if (task.id === id) {
      task.important = false;
      task.completed = !task.completed;
      renderTasks(tasks);
    }
  });
};

const importantTask = (id) => {
  tasks.forEach((task) => {
    if (task.id === id) {
      if(task.completed !== true ){
        task.completed = false;
        task.important = !task.important;
        renderTasks(tasks);
      }
    }
  });
};

const editTask = (id) => {
const task = tasks.find((task)=> task.id === id)
if(task.completed !== true ){

  todo_Foam[0].value = task.title
  addTaskBtn.textContent = "Update"
  
  updateId = task.id;
  console.log(task)
}
 };

 

