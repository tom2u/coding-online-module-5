var tasks = []; // I changed this to {} to be consistent with its use in the routine.

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
 
  var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(taskDate);

  var taskP = $("<p>").addClass("m-1").text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);

  // check due date
  auditTask(taskLi);

  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var auditTask = function(taskEl) {
  // get date from task element
  var date = $(taskEl).find("span").text().trim();

  console.log(date); // The update to this function under "Check If the Date Is in the Past" should have deleted this

  // convert to moment object at 5:00pm
  var time = moment(date, "L").set("hour", 17);

  console.log(time); // The update to this function under "Check If the Date Is in the Past" should have deleted this

  // remove any old classes from element
  $(taskEl).removeClass("list-group-item-warning list-group-item-danger");

  // apply new class if task is near/over due date
  if (moment().isAfter(time)) {
    $(taskEl).addClass("list-group-item-danger");
  } 
  else if (Math.abs(moment().diff(time, "days")) <= 2) {
    $(taskEl).addClass("list-group-item-warning");
  }
};

// enable draggable/sortable feature on list-group elements
$(".card .list-group").sortable({
  // enable dragging across lists
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",

// ********************** //
// ----- DIFF START ----- //
// ********************** //

// AUTHOR REPO HAS:
  activate: function(event, ui) {
    console.log(ui);
  },
  deactivate: function(event, ui) {
    console.log(ui);
  },
  over: function(event) {
    console.log(event);
  },
  out: function(event) {
    console.log(event);
  },

/*
// LESSON HAS:
  activate: function(event) {
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
// COMMENT: None of the above is indicated in the instructions through 5.4.6.
*/

// ******************** //
// ----- DIFF END ----- //
// ******************** //

  update: function() {
    var tempArr = [];

    // loop over current set of children in sortable list

// ********************** //
// ----- DIFF START ----- //
// ********************** //

// AUTHOR REPO HAS:
    $(this).children().each(function() {
        // save values in temp array
        tempArr.push({
          text: $(this)
            .find("p")
            .text()
            .trim(),
          date: $(this)
            .find("span")
            .text()
            .trim()
        });
      });

/*
// LESSON HAS:
    $(this).children().each(function() {
      var text = $(this)
        .find("p")
        .text()
        .trim();

      var date = $(this)
        .find("span")
        .text()
        .trim();

      // add task data to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });
*/

// ******************** //
// ----- DIFF END ----- //
// ******************** //

    // trim down list's ID to match object property
    var arrName = $(this)
      .attr("id")
      .replace("list-", "");

    // update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();

// ********************** //
// ----- DIFF START ----- //
// ********************** //

// AUTHOR REPO HAS:
  },
  stop: function(event) {
    $(this).removeClass("dropover");
  }

// LESSON HAS:
/*
    console.log(tempArr);
  }
*/

// ******************** //
// ----- DIFF END ----- //
// ******************** //

});

// trash icon can be dropped onto
$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",

// ********************** //
// ----- DIFF START ----- //
// ********************** //

// AUTHOR REPO HAS:
  drop: function(event, ui) {
    // remove dragged element from the dom
    ui.draggable.remove();
  },
  over: function(event, ui) {
    console.log(ui);
  },
  out: function(event, ui) {
    console.log(ui);
  }

// LESSON HAS:
/*
  drop: function(event, ui) {
    console.log("drop");
    ui.draggable.remove();
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }

*/

// ******************** //
// ----- DIFF END ----- //
// ******************** //
});

// convert text field into a jquery date picker
$("#modalDueDate").datepicker({
  // force user to select a future date
  minDate: 1
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// task text was clicked
$(".list-group").on("click", "p", function() {
  // get current text of p element
  var text = $(this)
    .text()
    .trim();

  // replace p element with a new textarea
  var textInput = $("<textarea>").addClass("form-control").val(text);
  $(this).replaceWith(textInput);
  // auto focus new element
  textInput.trigger("focus");
});

// editable field was un-focused
$(".list-group").on("blur", "textarea", function() {

// ********************** //
// ----- DIFF START ----- //
// ********************** //

// AUTHOR REPO HAS:
  // get current value of textarea
  var text = $(this).val();

// LESSON HAS:
/*
  // get the textarea's current value/text
  var text = $(this).val().trim();
*/

// ******************** //
// ----- DIFF END ----- //
// ******************** //

  // get status type and position in the list
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].text = text;
  saveTasks();

  // recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  // replace textarea with new content
  $(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);
  $(this).replaceWith(dateInput);

  // enable jquery ui date picker
  dateInput.datepicker({
    minDate: 1,
    onClose: function() {
      // when calendar is closed, force a "change" event
      $(this).trigger("change");
    }
  });

  // automatically bring up the calendar
  dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("change", "input[type='text']", function() {
  var date = $(this).val();

  // get status type and position in the list
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span and insert in place of input element
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);
    $(this).replaceWith(taskSpan);
    auditTask($(taskSpan).closest(".list-group-item"));
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }

// ********************** //
// ----- DIFF START ----- //
// ********************** //

// AUTHOR REPO HAS:
  console.log(tasks);

// LESSON HAS:

// ******************** //
// ----- DIFF END ----- //
// ******************** //

  saveTasks();
});

// load tasks for the first time
loadTasks();
