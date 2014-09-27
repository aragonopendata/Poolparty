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

get '/city/:id' do
  @city = cities.find(params[:id])
  erb :city
end
