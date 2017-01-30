var chartLoad = false;
$( document ).ready(function() {
    $('#epButtonBox').click(function(){
        $('#epMore').slideToggle();
        $('#epLessButton').fadeToggle();
        $('#epMoreButton').fadeToggle();
    });

$(function() {
  $('a[href*="#"]:not([href="#"], .carousel-control)').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});


$(window).scroll(function() {
	squareThis('.chart');
   var hT = $('#webChart').offset().top,
       hH = $('#webChart').outerHeight(),
       wH = $(window).height(),
       wS = $(this).scrollTop();
   if (wS > (hT+hH-wH) && !chartLoad){
	console.log(chartLoad);  
	chartLoad=true;
	console.log(chartLoad);
	$("#webChart").html("").drawDoughnutChart([
    	{ title: "Web",   value :90,  color: "#337cbb" },
    	{ title: "",        value : (20),   color: "transparent" }]);
	
	$("#javaChart").html("").drawDoughnutChart([
    	{ title: "Java/Android",   value : 70,  color: "#337cbb" },
    	{ title: "",        value : (30),   color: "transparent" }]);
	
	$("#cChart").html("").drawDoughnutChart([
    	{ title: "Web",   value : 50,  color: "#337cbb" },
    	{ title: "",        value : (50),   color: "transparent" }]);
   	}
});



});




