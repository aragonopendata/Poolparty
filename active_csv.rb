require 'csv'
require 'active_support/core_ext/string'

class ActiveCsv
  def initialize(path)
    @data = {}

    CSV.read(path, headers: true, encoding: 'UTF-8').each do |row|
      guid = normalize(row['name'])

      @data[guid] = {
        ine:     row['ine'],
        name:    row['name'],
        guid:    guid,
        region:  row['comarca']
      }
    end
  end

  def find_by_name(name)
    @data[normalize(name)]
  end

  private

  def normalize(name)
    name.parameterize
  end
end
