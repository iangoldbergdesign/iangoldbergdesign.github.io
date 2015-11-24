$(document).ready(function () {
  var el = $('#image-one');

  el.mouseenter(function() {
    console.log("hi");
    el.addClass("red");
  })

  el.mouseleave(function () {
    console.log("bye");
    el.removeClass("red");
  })

});
