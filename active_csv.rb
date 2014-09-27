require 'csv'

class ActiveCsv
  def open(path)
    @csv = {}

    CSV.read(path, headers: true).each do |row|
      @csv[row['ine']] = {
        name:    row['name'],
        region:  row['comarca'],
        cp:      row['cp']
      }
    end
  end

  def find(ine)
    @csv[ine]
  end
end
