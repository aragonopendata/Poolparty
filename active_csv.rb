require 'csv'

class ActiveCsv
  def open(path)
    @csv = {}

    CSV.read(path, headers: true).each do |row|
      @csv[row['ine']] = {
        name:    row['name'],
        ine:     row['ine'],
        region:  row['comarca'],
        cp:      row['cp']
      }
    end
  end

  def find(ine)
    @csv[ine]
  rescue
    nil
  end

  def find_by_name(name)
    @csv.detect{|h| h[1][:name].downcase == name.downcase }[1]
  rescue
    nil
  end

end
