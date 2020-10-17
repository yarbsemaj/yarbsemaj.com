import 'bootstrap';
import './main.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import Typewriter from 'typewriter-effect/dist/core';

new Typewriter('#typewriter', {
    strings: [
        'React JS', 
        'PHP', 
        'SQL', 
        'AWS',
        '<a href="https://z80.yarbsemaj.com">Z80 Assembly</a>',
        'CSS',
        'SASS',
        'NodeJS', 
        'Serverless',
        'HTML', 
        'Dynanamo DB', 
        'Lambda', 
        'Webpack', 
        'AngularJS', 
        'Javascript', 
        'Java'],
    autoStart: true,
    loop: true
});