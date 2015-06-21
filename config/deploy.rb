require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
require 'mina/rbenv'  # for rbenv support. (http://rbenv.org)

set :domain,     'blato03'
set :deploy_to,  '/var/www/visual-aragopedia.visualizados.com'
set :repository, 'git@github.com:aragonopendata/Poolparty.git'
set :branch,     'master'

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.
set :shared_paths, ['tmp']

# Optional settings:
set :user, 'ubuntu'
set :port, 22
set :forward_agent, true¬

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  invoke :'rbenv:load'
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/tmp"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/tmp"]
end

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'

    to :launch do
      queue "touch #{deploy_to}/tmp/restart.txt"
    end
  end
end
