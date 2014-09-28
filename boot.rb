require 'rubygems'
require 'bundler'
Bundler.require

require 'byebug'              if development?
require 'sinatra/base'
require 'sinatra/reloader'    if development?
require 'csv'
require 'active_support/core_ext/string'

# Models
require_relative 'lib/active_csv'
