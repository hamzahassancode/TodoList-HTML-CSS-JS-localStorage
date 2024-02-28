function DOMContentLoaded() {
  return new Promise((resolve, _reject) => {
    document.addEventListener("DOMContentLoaded", resolve);
  });
}
var oldValue="";
async function mainFunction() {
  await DOMContentLoaded();
  const addButton = document.getElementById("add_button");
  addButton.addEventListener("click", addTask);

  let initialIncompleted = JSON.parse(localStorage.getItem("incompleted"));
  if (initialIncompleted === null) {
    initialIncompleted = [];
  }
  
  initialIncompleted.forEach((taskFromLocalStorage) => {
    const emptyEvent = null;
    addTask(emptyEvent, taskFromLocalStorage);
  });
////////////////
let initialCompleted = JSON.parse(localStorage.getItem("completed"));
  if (initialCompleted === null) {
    initialCompleted = [];
  }
  initialCompleted.forEach((taskFromLocalStorage) => {
    const emptyEvent = null;
    addTask(emptyEvent, taskFromLocalStorage);
  });

//////////////
  /// handle only existing tasks
  document
    .querySelectorAll("#incomplete-tasks input[type='checkbox']")
    .forEach((checkBox) => {
      checkBox.addEventListener("change", handleIncomplete);
    });

  document
    .querySelectorAll("#completed-tasks input[type='checkbox']")
    .forEach((checkBox) => {
      checkBox.addEventListener("change", handleCompleted);
    });

  document.querySelectorAll(".delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
      const parent = e.target.parentElement;
      const taskName = parent.querySelector("input[type='text']").value;
    });
  });

  document.querySelectorAll(".edit").forEach((editButton) => {
    editButton.addEventListener("click", handleEdit);
  });

  document.querySelectorAll(".save").forEach((saveButton) => {
    saveButton.addEventListener("click", handleSave);
  });
}

mainFunction();


function createTask(taskName) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  const input = document.createElement("input");
  input.type = "text";

  input.value = taskName;
  input.readOnly = true;

  const save = document.createElement("button");
  save.className = "save hide";
  save.textContent = "Save";

  save.addEventListener("click", handleSave);

  const edit = document.createElement("button");
  edit.className = "edit";
  edit.textContent = "Edit";

  edit.addEventListener("click", handleEdit);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", handleDelete);

  li.appendChild(checkbox);
  li.appendChild(input);
  li.appendChild(save);
  li.appendChild(edit);
  li.appendChild(deleteButton);

  return li;
}

function createCompleted(taskName) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;
  const input = document.createElement("input");
  input.type = "text";
  input.value = taskName;
  input.readOnly = true;

  const save = document.createElement("button");
  save.className = "save hide";
  save.textContent = "Save";

  save.addEventListener("click", handleSave);

  const edit = document.createElement("button");
  edit.className = "edit";
  edit.textContent = "Edit";

  edit.addEventListener("click", handleEdit);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", (e) => {
    const parent = e.target.parentElement;
    const taskName = parent.querySelector("input[type='text']").value;
    deleteTask(parent, taskName);
  });

  li.appendChild(checkbox);
  li.appendChild(input);
  li.appendChild(save);
  li.appendChild(edit);
  li.appendChild(deleteButton);

  return li;
}

function addTask(_e, taskFromLocalStorage) {
  let taskInput;
  let taskName;
  let li;
  const listOfIncompleteTasks = document.getElementById("incomplete-tasks");
  if (!taskFromLocalStorage) {
    taskInput = document.getElementById("new-task");
    taskName = taskInput.value;
    li = createTask(taskName);
    taskInput.value = ""; // empty out the add input
    addToIncompletedStorage(taskName);
  } else {
    li = createTask(taskFromLocalStorage);
  }

  listOfIncompleteTasks.prepend(li);

  listOfIncompleteTasks
    .querySelectorAll("li input[type='checkbox']")[0]
    .addEventListener("change", handleIncomplete);
}

function handleIncomplete(e) {
  const checked = e.target.checked;
  if (checked) {
    const parent = e.target.parentElement;
    const inputValue = parent.querySelector("input[type='text']").value;
    const listOfcompletedTasks = document.getElementById("completed-tasks");
    const li = createCompleted(inputValue);
    listOfcompletedTasks.prepend(li);
    const checkbox = li.querySelectorAll("li input[type='checkbox']")[0];
    checkbox.addEventListener("change", handleCompleted);


    ///////////////
    addToCompletedStorage(inputValue);
    //////////

    deleteTask(parent, inputValue,true);
  }
}

function addToCompletedStorage(taskName){
  let existingLocalItemCompleted = JSON.parse(localStorage.getItem("completed"));
    if (existingLocalItemCompleted === null) {
      existingLocalItemCompleted = [];
    }

    existingLocalItemCompleted.push(taskName);
    localStorage.setItem("completed", JSON.stringify(existingLocalItemCompleted));
}
function addToIncompletedStorage(taskName){
  let existingLocalItem = JSON.parse(localStorage.getItem("incompleted"));
    if (existingLocalItem === null) {
      existingLocalItem = [];
    }

    existingLocalItem.push(taskName);
    localStorage.setItem("incompleted", JSON.stringify(existingLocalItem));
}

function handleCompleted(e) {
  const checked = e.target.checked;
  if (!checked) {
    const parent = e.target.parentElement;
    const inputValue = parent.querySelector("input[type='text']").value;
    const listOfIncompleteTasks = document.getElementById("incomplete-tasks");
    const li = createTask(inputValue);
    listOfIncompleteTasks.prepend(li);
    listOfIncompleteTasks
      .querySelectorAll("li input[type='checkbox']")[0]
      .addEventListener("change", handleIncomplete);
      //////
      addToIncompletedStorage(inputValue);
      //////

    deleteTask(parent, inputValue,false);
  }
}

function deleteTask(element, taskName,incompletedFlag) {
  element.remove();
  if(incompletedFlag){
 removeFromIncompletedStorage(taskName);
  }else{
    removeFromCompletedStorage(taskName);
  }
 
  
}
function removeFromCompletedStorage(taskName){
  let completeLocalStorage = JSON.parse(localStorage.getItem("completed"));
  if (completeLocalStorage !== null) {
    completeLocalStorage = completeLocalStorage.filter(
      (task) => task !== taskName,
    );
    localStorage.setItem("completed", JSON.stringify(completeLocalStorage));
  }
}
function removeFromIncompletedStorage(taskName){
  let incompleteLocalStorage = JSON.parse(localStorage.getItem("incompleted"));
  if (incompleteLocalStorage !== null) {
    incompleteLocalStorage = incompleteLocalStorage.filter(
      (task) => task !== taskName,
    );
    localStorage.setItem("incompleted", JSON.stringify(incompleteLocalStorage));
  }
}

function handleEdit(e) {
  const el = e.target;
  el.classList.add("hide");
  const parent = el.parentElement;
  const input = parent.querySelector("input[type='text']");
  input.readOnly = false;
 oldValue=input.value;
  input.focus();
  const save = parent.querySelector(".save");
  debugger;
  save.classList.remove("hide");
  debugger;
}
function handleDelete(e){
    const parent = e.target.parentElement;
    const taskName = parent.querySelector("input[type='text']").value;

    const isIncompletedTask = parent.parentElement.id === "incomplete-tasks";
    if (isIncompletedTask) {
      deleteTask(parent, taskName,true);
    } else {
      deleteTask(parent, taskName,false);
    }
  


}

function handleSave(e) {
  const el = e.target;
  el.classList.add("hide");
  const parent = el.parentElement;
  const input = parent.querySelector("input[type='text']");
  const editedTaskName = input.value; 

  console.log('new taks name  '+editedTaskName);
  console.log('old task  '+oldValue);
  input.readOnly = true;
  const edit = parent.querySelector(".edit");

  const isIncompletedTask = parent.parentElement.id === "incomplete-tasks";
  if (isIncompletedTask) {
    updateTaskInStorage("incompleted", oldValue, editedTaskName);
  } else {
    updateTaskInStorage("completed", oldValue, editedTaskName);
  }

  edit.classList.remove("hide");
}

function updateTaskInStorage(storageKey, oldTaskName, newTaskName) {
  let storageData = JSON.parse(localStorage.getItem(storageKey));
  if (storageData !== null) {
    const index = storageData.indexOf(oldTaskName);
    if (index !== -1) {
      
      storageData[index] = newTaskName;
      localStorage.setItem(storageKey, JSON.stringify(storageData));
    }
  }
}
