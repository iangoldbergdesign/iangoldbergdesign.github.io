$(document).ready(function () {
  var el = $('#image-one');

  el.mouseenter(function() {
    console.log("hi");
    el.addClass("red");
  })

  el.mouseleave(function () {
    el.removeClass("red");
  })

});
