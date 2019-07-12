var $, fill;

$ = require('jquery');

(fill = function(item) {
  return $('.tagline').append(`${item}`);
})('All the Creative minds in Art');

fill;
