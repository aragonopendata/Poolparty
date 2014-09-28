require 'csv'

class ActiveCsv
  def initialize(path)
    @data = {}

    CSV.read(path, headers: true, encoding: 'windows-1251:UTF-8').each do |row|
      @data[normalize(row['name'])] = {
        ine:     row['ine'],
        name:    row['name'],
        region:  row['comarca']
      }
    end
  end

  def find_by_name(name)
    @data[normalize(name)]
  end

  private

  def normalize(name)
    name.downcase.strip
  end
end
