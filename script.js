const navButtons = document.querySelectorAll("[data-nav]");
const allSections = document.querySelectorAll(".view");
const todo_Foam = document.querySelector("#todo-form");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById('addTaskBtn');
const todoFilterBtns = document.querySelectorAll('[data-filter]')
const clockDisplay = document.getElementById('clockDisplay');
const dateDisplay = document.getElementById('dateDisplay');
const weatherCard = document.querySelector('.weather-card');
const now = new Date();
const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
const customDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
const quoteBtn = document.getElementById('newQuoteBtn')

const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
const customTime = timeString.split(' ')[0];
const customPeriod = timeString.split(' ')[1].toUpperCase();
clockDisplay.innerHTML = `${customTime} <span class="datetime-widget__meridiem" >${customPeriod}</span>`;
dateDisplay.textContent = customDate;

const body = document.body;
const themeSwitch = document.getElementById("themeSwitch");
const currentPage = localStorage.getItem("currentPage") || "dashboard";
const API_KEY = "8d57e81a368c42e7acb111827261407";
const BASE_URL = "https://api.weatherapi.com/v1";
const searchBtn = document.getElementById('weather-search');

quoteBtn.addEventListener('click', () => {
  getQuote();
})

async function getQuote() {
  try {
    const quoteApi = "https://dummyjson.com/quotes/random";
    const res = await fetch(quoteApi);
    const data = await res.json();

    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    quoteText.textContent = `${data.quote}`;
    quoteAuthor.textContent = `—${data.author}`;

  } catch (error) {
    alert(error.message)
  }
}

async function getWeather(cityInput = "", city = "karachi") {

  try {
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`;
    const res = await fetch(url);
    const data = await res.json()

    if (data.error) {
      throw new Error("city not found please enter valid city name");
      return;
    }

    weatherCard.innerHTML = `
  <div class="weather-card-section">
        <div class="weather-card__top">
          <div>
            <p class="weather-card__city" id="weatherCity">${data.location.name}, ${data.location.country}</p>
            <p class="weather-card__condition" id="weatherCondition">${data.current.condition.text}</p>
          </div>
          <div class="weather-card__icon" aria-hidden="true">
            <img src="${data.current.condition.icon}" alt="">
          </div>
        </div>

        <p class="weather-card__temp" id="weatherTemp">${(data.current.temp_c).toFixed()}°<span class="weather-card__unit">C</span></p>

        <div class="weather-grid">
          <div class="weather-stat">
            <i class="fa-solid fa-droplet"></i>
            <span class="weather-stat__value" id="weatherHumidity">${data.current.humidity}%</span>
            <span class="weather-stat__label">Humidity</span>
          </div>
          <div class="weather-stat">
            <i class="fa-solid fa-wind"></i>
            <span class="weather-stat__value" id="weatherWind">${data.current.wind_kph} km/h</span>
            <span class="weather-stat__label">Wind</span>
          </div>
          <div class="weather-stat">
            <i class="fa-solid fa-temperature-half"></i>
            <span class="weather-stat__value" id="weatherFeelsLike">${data.current.feelslike_c}°C</span>
            <span class="weather-stat__label">Feels like</span>
          </div>
        </div>
        </div>
  `;
    cityInput.value = "";
  } catch (error) {
    console.log("error => ", error.message)
    alert(error.message)
    cityInput.value = "";

  }
}

getQuote()
getWeather();

searchBtn.addEventListener('click', () => {
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value;
  if (city.trim() === "") {
    alert("Enter City Name!")
    return;
  }
  getWeather(cityInput, city);
})


let theme = localStorage.getItem("theme") || "light";

if (theme !== "light") {
  body.classList.add('dark')
  themeSwitch.checked = true;

} else {
  body.classList.remove('dark')
  themeSwitch.checked = false;
}


themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    themeSwitch.checked = true;;
    body.classList.add('dark')
    localStorage.setItem('theme', "dark")
  } else {
    body.classList.remove('dark')
    themeSwitch.checked = false;
    localStorage.setItem('theme', "light")
  }
})

allSections.forEach(element => {
  element.classList.remove('view--active');
  const targetSection = document.getElementById(currentPage)
  targetSection.classList.add('view--active')
});

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let updateId = null;

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem('currentPage', button.dataset.nav);
    const targetSection = document.getElementById(button.dataset.nav);
    allSections.forEach((element) => {
      element.classList.remove("view--active");
    });
    targetSection.classList.add("view--active");

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

    if (updateId !== null) {
      let task = tasks.find(elem => elem.id === updateId);
      task.title = input;
      updateId = null
      addTaskBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add task";
      localStorage.setItem('tasks', JSON.stringify(tasks))
      renderTasks(tasks)
    } else {
      tasks.push(inpObj);
      localStorage.setItem('tasks', JSON.stringify(tasks))
      renderTasks(tasks);
    }
    // console.log(tasks)
  }

  todo_Foam.reset();
});

todoFilterBtns.forEach(button => {
  button.addEventListener('click', () => {
    todoFilterBtns.forEach(btn => {

      btn.classList.remove('filter-chip--active')

    });

    const filterBtn = button.dataset.filter;
    console.log(filterBtn)

    if (filterBtn === "all") {
      button.classList.add('filter-chip--active');
      renderTasks(tasks)
    }

    if (filterBtn === "completed") {
      const completed = tasks.filter(task => task.completed === true)
      button.classList.add('filter-chip--active');
      renderTasks(completed)
    }
    if (filterBtn === "important") {
      const important = tasks.filter(task => task.important === true)
      button.classList.add('filter-chip--active');
      renderTasks(important)
    }
    if (filterBtn === "active") {
      const aciveTasks = tasks.filter(task => task.completed === false && task.important === false)
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
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
};

const completedTask = (id) => {
  tasks.forEach((task) => {
    if (task.id === id) {
      task.important = false;
      task.completed = !task.completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks(tasks);
    }
  });
};

const importantTask = (id) => {
  tasks.forEach((task) => {
    if (task.id === id) {
      if (task.completed !== true) {
        task.completed = false;
        task.important = !task.important;
        localStorage.setItem('tasks', JSON.stringify(tasks))
        renderTasks(tasks);
      }
    }
  });
};

const editTask = (id) => {
  const task = tasks.find((task) => task.id === id)
  if (task.completed !== true) {
    todo_Foam[0].value = task.title
    addTaskBtn.textContent = "Update"
    updateId = task.id;
    console.log(task)
  }
};

function pomodoro() {

  const timerDisplay = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const progressCircle = document.querySelector(".pomodoro-ring__progress");
  
  const radius = 90;
  const circumference = (2 * Math.PI * radius);
  const defaultMinute = 25;
  const defaultSecond = 0;

  let minute = defaultMinute;
  let second = defaultSecond;

const totalSecond = defaultMinute * 60 + defaultSecond;
  
  let timer = null;
  
  
  showTime()
  updateRing()
  
  
  function showTime() {
    let m = minute;
    let s = second;
    
    if (m < 10) {
      m = `0${m}`
    }

    if (s < 10) {
      s = `0${s}`
    }

    timerDisplay.textContent = `${m}:${s}`
  }
function updateRing(){
  const currentSeconds = minute * 60 + second
    const progress = currentSeconds / totalSecond
    const offset = circumference * (1- progress);
    progressCircle.style.strokeDashoffset = offset;
}
  startBtn.addEventListener('click', () => {
    
    if(timer){
      return
    }
    
    timer = setInterval(() => {

      // showTime()
    
  if (minute === 0 && second === 0) {
    showTime()
    updateRing()
    clearInterval(timer);
    timer = null
    alert('Session Completed')

  }
  else if (second === 0 ) {
    minute--
    second = 59
    showTime()
    updateRing()
      }
      else {
        second--
        showTime()
        updateRing()
      }
      
    }, 1000);
  })
  

  pauseBtn.addEventListener('click',()=>{
    clearInterval(timer);
    timer = null
  })

  resetBtn.addEventListener('click',()=>{
    console.log()
    minute = 25;
    second = 0;
    clearInterval(timer)
    timer = null
    showTime()
    updateRing()
  })

}

pomodoro()