require 'rubygems'
require 'bundler'
Bundler.require

require 'sinatra'
require 'sinatra/reloader' if development?

require_relative './active_csv'

set :public_folder, settings.root + '/public'
set :views, settings.root + '/templates'

csv_cities = File.join(settings.root, 'public', 'assets', 'ine_cp.csv')
cities = ActiveCsv.new(csv_cities)

get '/' do
  erb :index
end

post '/form' do
  if @city = cities.find_by_name(params[:name])
    redirect '/' + @city[:name]
  else
    error_page(params[:name])
  end
end

get '/:name' do
  if @city = cities.find_by_name(params[:name])
    erb :city
  else
    error_page(params[:name])
  end
end

private

def error_page(name)
  @error = "No se ha encontrado ningún municipio '#{params[:name]}' en la provincia de Aragón"
  erb :index
end
