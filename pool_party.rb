require 'rubygems'
require 'bundler'
Bundler.require

require 'sinatra'
require 'sinatra/reloader' if development?

require_relative './active_csv'

set :public_folder, settings.root + '/public'
set :views, settings.root + '/templates'

csv_cities = File.join(settings.root, 'public', 'assets', 'ine_cp.csv')
cities = ActiveCsv.new
cities.open(csv_cities)

get '/' do
  erb :index
end

post '/form' do
  if @city = cities.find_by_name(params[:name])
    redirect '/' + @city[:name]
  else
    @error = "No se ha encontrado ningún municipio '#{params[:name]}'"
    erb :index
  end
end

get '/:name' do
  if @city = cities.find_by_name(params[:name])
    erb :city
  else
    @error = "No se ha encontrado ningún municipio '#{params[:name]}'"
    erb :index
  end
end
