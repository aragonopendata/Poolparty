require 'sinatra'
require 'sinatra/reloader' if development?

set :public_folder, settings.root + '/static'
set :views, settings.root + '/templates'

get '/' do
  'Lista ciudades'
end

get '/city/:id' do
  "Ciudad con id: #{params[:id]}"
end
