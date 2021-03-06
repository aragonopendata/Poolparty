class ActiveCsv
  def initialize(path)
    @data = {}

    CSV.read(path, headers: true, encoding: 'UTF-8').each do |row|
      guid = normalize(row['name'])

      @data[guid] = {
        ine:    row['ine'],
        name:   row['name'],
        guid:   guid,
        region: row['comarca'],
        lon:    row['lon'],
        lat:    row['lat'],
        cp:     row['cp']
      }
    end
  end

  def find_by_name(name)
    @data[normalize(name)]
  end

  def find_by_prefix(prefix)
    @data.invert.keys.select{|h| h[:name].downcase.include?(prefix.downcase) }.map do |h|
      {value: h[:name]}
    end
  end

  private

  def normalize(name)
    name.parameterize
  end
end
