require 'rubygems'
require 'bundler'
Bundler.require

require 'sinatra'
require 'sinatra/reloader' if development?

set :public_folder, settings.root + '/public'
set :views, settings.root + '/templates'

get '/' do
  erb :city
end

get '/city/:id' do
  erb :city
end
