$ = require 'jquery'

do fill = (item = 'All the Creative minds in Art') ->
  $('.tagline').append "#{item}"
fill