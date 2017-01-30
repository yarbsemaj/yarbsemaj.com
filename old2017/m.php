<html>
    <head>
    <meta name="viewport" content="width=device-width, user-scalable=no" />
    <meta name="theme-color" content="#b71c1c">
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="css/roboto.min.css" rel="stylesheet">
        <link href="css/material.min.css" rel="stylesheet">
        <link href="css/ripples.min.css" rel="stylesheet">
        <link href="css/m_cards.css" rel="stylesheet" type="text/css">
    <script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
    <script>
  var menshowing = false;
$(document).ready(function(e) {
  $('.menbar').on('click', function(e) {
    e.stopPropagation();
  });
  $('.navbar-header').on('click', function() {
    
    if (!menshowing) {
      $('.menbar').animate({
        left: '0px'
      }, 'fast', function() {
        menshowing = true;
      });
    } 

    
  });
  $(document).on('click', function(e) {
    if (menshowing) {
      $('.menbar').animate({
        left: '-300px'
      }, 'fast', function() {
        menshowing = false;
      });

    }
  });

});

  
  
  </script>
    <title>yarbsemaj</title>
    </head>

    <body>
<div class="navbar navbar-default" style=" background-color: #b71c1c;margin:0px; top:0px; position: fixed;
width: 100%;
z-index: 100;">
  <div class="navbar-header"> <i class="btn btn-fab btn-flat mdi-navigation-menu" style="color:rgba(255,255,255,.84); box-shadow: none;"></i> </div>
</div>
<div class="menbar jumbotron" style="padding-top:70px; padding-left:0px; padding-right:0px; top:0px;"> <img style="display:inline-block; margin-left:10px;" src="img/logo.png" width="50px"; height="50px" />
  <h2 style="display:inline-block;">&nbsp;yarbsemaj</h2>
  <hr />
 
  <div class="mbar_item" onClick="window.location.href = 'http://blog.yarbsemaj.co.uk';"> <i class="mdi-editor-border-color mbar_icon"></i>&nbsp;Blog</div>
   <hr />
 
  <div class="mbar_item" onClick="$('#about-button').click();" > <i class="mdi-social-mood mbar_icon"></i>&nbsp;About me</div>
</div>
<div class="jumbotron main-cards center" style="margin-top:70px; width:100%;">
    <h1>James's Web Toys</h1>
    <p>Take a look around</p>
</div>
<div class="panel panel-primary main-cards center"  >
    <div class="panel-heading">
        <h2 class="panel-title" data-toggle="tooltip" data-placement="right" title="" data-original-title="js and php 2015">Vigenere</h2>
    </div>
    <div class="panel-body">
     <img class="card-icon" src="img/ver.png">
     Encrypt messages using the Vigenere cipher<br>
     <a class="btn btn-primary btn-sm" href="http://vigenere.yarbsemaj.co.uk">Go to site</a>
    </div>
</div>

<div class="panel panel-danger main-cards center">
    <div class="panel-heading">
        <h2 class="panel-title" data-toggle="tooltip" data-placement="right" title="" data-original-title="js, php and sql 2015">ono</h2>
    </div>
    <div class="panel-body">
     <img class="card-icon" src="img/ono.png">
     A dating site where you match based on a users bio <br>
     <a class="btn btn-danger btn-sm" href="http://ono.yarbsemaj.co.uk">Go to site</a>
    </div>
</div>

<div class="panel panel-primary main-cards center"  >
    <div class="panel-heading">
        <h2 class="panel-title" data-toggle="tooltip" data-placement="right" title="" data-original-title="js 2015">20 lines</h2>
    </div>
    <div class="panel-body">
     <img class="card-icon" src="img/20l.png">
    Can you beat the computer in this game of logic<br>
     <a class="btn btn-primary btn-sm" href="http://20lines.yarbsemaj.co.uk">Go to site</a>
    </div>
</div>

<div class="panel panel-danger main-cards center">
    <div class="panel-heading">
        <h2 class="panel-title" data-toggle="tooltip" data-placement="right" title="" data-original-title="js, php and sql 2015">15m</h2>
    </div>
    <div class="panel-body">
     <img class="card-icon" src="img/15m.png">
    Chatroulette with a time limit<br>
     <a class="btn btn-danger btn-sm" href="http://15m.yarbsemaj.co.uk">Go to site</a>
    </div>
</div>

<div class="panel panel-danger main-cards center" >
    <div class="panel-heading">
        <h2 class="panel-title" data-toggle="tooltip" data-placement="right" title="" data-original-title="js, php and sql 2015"  >Qprac</h2>
    </div>
    <div class="panel-body">
     <img class="card-icon" src="img/qpr.png">
   A school labority booking system<br>
     <a class="btn btn-danger btn-sm" href="http://qprac.yarbsemaj.co.uk">Go to site</a>
    </div>
</div>

<div class="panel panel-info main-cards center">
    <div class="panel-heading">
        <h2 class="panel-title" data-toggle="tooltip" data-placement="right" title="" data-original-title="c++ 2012">yarbsemaj games</h2>
    </div>
    <div class="panel-body">
     <img class="card-icon" src="img/games.png">
    A google site with my 1st foray into programing<br>
     <a class="btn btn-info btn-sm" href="http://games.yarbsemaj.co.uk">Go to site</a>
    </div>
</div>

<div class="panel panel-warning main-cards center">
    <div class="panel-heading">
        <h2 class="panel-title" data-toggle="tooltip" data-placement="right" title="" data-original-title="php 2012">edj help</h2>
    </div>
    <div class="panel-body">
     <img class="card-icon" src="img/edj.png">
    My GCSE project at high school<br>
     <a class="btn btn-warning btn-sm" href="http://edjhelp.yarbsemaj.co.uk">Go to site</a>
    </div>
</div>
</div>
<button id="about-button" hidden data-toggle="modal" data-target="#about-dialog">Open dialog</button>
<div id="about-dialog" class="modal fade" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">About me</h4>
      </div>
      <div class="modal-body">
      <img src="img/logo.png" width="200" height="200" style="display: block;" class="center">
    <p>I started programing in 2010 first in html quickly moving into C++. Since then I've been working on website, using php as my backend, mysql to communicate with the database and jQuery to fancy up the front end. This site is a culmination of most of the finished projects I have got working on the webserver.</p>
    <p><a href="https://fezvrasta.github.io/bootstrap-material-design/">Material Design for Bootstrap</a></p>

      </div>
    </div>
  </div>


       

        
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

        <script src="js/ripples.min.js"></script>
        <script src="js/material.min.js"></script>
        <script>
            $(document).ready(function() {
                $.material.init();
        $('[data-toggle="tooltip"]').tooltip({'placement': 'right'});
            });
        </script>

    </body>

</html>
