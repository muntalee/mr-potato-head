// the jquery code
$(document).ready(function () {
  // we initially hide the button to close the capture
  $(".button-container").hide();

  // dragging is initially false
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  // important to distinguish what is draggable
  let $currentDraggable = null;

  // used so that the element doesnt fidget when selected
  $(".draggable-element").css({
    border: "2px solid transparent",
  });

  // just for hovering and selecting
  $(".draggable-element").hover(
    function () {
      if ($(this).css("opacity") === "1") {
        $(this).css("border", "2px dotted red");
      }
    },
    function () {
      if ($(this).css("opacity") === "1") {
        $(this).css("border", "2px solid transparent");
      }
    }
  );

  $(".draggable-element").mousedown(function (event) {
    // we first see if its visible (meaning if it is in use)
    if ($(this).css("opacity") === "1") {
      // we are dragging, and this is the current draggable element
      isDragging = true;
      $currentDraggable = $(this);
      // find the offset and position
      offset.x = event.pageX - $currentDraggable.offset().left;
      offset.y = event.pageY - $currentDraggable.offset().top;
      event.preventDefault();
    }
  });

  $(".draggable-element").mousemove(function (event) {
    if (isDragging && $currentDraggable) {
      // move to new position only when its draggable and its the current draggable element
      const newX = event.pageX - offset.x;
      const newY = event.pageY - offset.y;
      $currentDraggable.css({ left: newX, top: newY });
    }
  });

  $(".draggable-element").mouseup(function () {
    // once done dragging, we set drag to false, and unknown current draggable element
    isDragging = false;
    $currentDraggable = null;
  });

  // animation code for capture

  // used to prevent any issues
  let isAnimating = false;

  // when we hover over our capture, we do our animation
  $("#capture").on("mouseenter", function () {
    // check first if we're in animation
    if (!isAnimating) {
      $("#capture").animate(
        // we animate to the full screen width
        {
          width: "100%",
          height: "auto",
          right: 0,
          bottom: 0,
          padding: 0,
        },
        {
          duration: 300,
          // once done, we end animation, and show a closing button
          complete: function () {
            $(".button-container").show();
            isAnimating = false;
          },
        }
      );
      isAnimating = true; // animation is in progress
    }
  });

  // a close button for our capture
  $(".close-button").click(function () {
    // first check if we're already animating
    if (!isAnimating) {
      // otherwise, we animate the capture to go to original dimensions
      // first hide the button
      $(".button-container").hide();
      // then animate
      $("#capture").animate(
        {
          right: "0px",
          bottom: "0px",
          width: "300px",
          height: "auto",
          padding: "10px",
        },
        {
          duration: 300,
          // once done, we end the animation
          complete: function () {
            isAnimating = false;
          },
        }
      );
      isAnimating = true; // animation is in progress
    }
  });
});

// function to toggle each body part from said button
function togglePart(part, button) {
  // get the element of said part
  let element = document.getElementById(part);

  // first check if its not visible using opacity
  if (element.style.opacity === "0") {
    // if not, we set it visible, enable pointer events
    element.style.opacity = "1";
    element.style.pointerEvents = "auto";
    // change up the look of button using bootstrap
    button.classList.add("bg-primary", "text-white");
  } else {
    // do the opposite of previous if statement
    element.style.opacity = "0";
    element.style.pointerEvents = "none";
    button.classList.remove("bg-primary", "text-white");
  }
}

// funciton for getting the screenshot
function getScreenShot(selector) {
  // use html to canvas
  html2canvas(document.querySelector("#canvas"), { useCORS: true }).then(
    (canvas) => {
      // get the image
      const img = canvas.toDataURL("image/png");
      // either we use the screenshot for downloading it
      if (selector == 1) downloadScreenShot(img);
      // or we capture it (part of problem 2)
      else if (selector == 2) captureScreenShot(img);
    }
  );
}

// downloading our screenshot
function downloadScreenShot(src) {
  // prompt the user to enter the image name
  const imgName = prompt("Enter Image Name:");
  // we create a link to add our image to it
  const link = document.createElement("a");
  link.href = src;
  link.download = imgName;
  // we then initialize a click, and download the image
  link.click();
}

// get a capture of our screenshot
function captureScreenShot(src) {
  // add it to a div as an img tag
  let capture = document.getElementById("capture");
  capture.innerHTML = `<img id="capture-img" src=${src}>`;
  // set the div to be visible
  capture.style.display = "inline";
}

// just an issue on my code, where i want all the parts to be hidden
function startup() {
  const buttons = document.querySelectorAll("#partButton");

  // so i simply trigger each button to toggle it
  buttons.forEach((button) => {
    button.click();
  });
}

// then call the function on load
startup();
