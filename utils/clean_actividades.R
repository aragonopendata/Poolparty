options(stringsAsFactors = F)
setwd("~/Dropbox/Jacathon/raw_data/actividades/")

install.packages("pxR")
require("pxR")
require("reshape2")
require("plyr")

# Read the px and store it as a data frame
actividades <- read.px( url("http://servicios3.aragon.es/iaeaxi_docs/11/03/03/11030302.px" ) )
actividades <- as.data.frame(actividades)
# Change the column names
names(actividades) <- c("actividad", "territorio", "date", "value")

# Save the file as .csv
write.csv(actividades, "actividades.csv", row.names = FALSE)

# Subset the data from Jaca

actividades <- read.csv("actividades.csv", header = TRUE)

actividades_mun <- subset(actividades, grepl("^[0-9]{5}", actividades$territorio))

c <- colsplit(actividades_mun$territorio, " ", c("cod", "mun"))
actividades_mun <- cbind(actividades_mun, c)

actividades_mun$territorio <- NULL


for (i in 1:length(unique(actividades_mun$cod))) {
	print(i)
	actividades_cod <- subset(actividades_mun, actividades_mun$cod == unique(actividades_mun$cod)[i])
	
	# Remove the rows that have value = 0 
	actividades_cod <- subset(actividades_cod, value != 0)
	
	# Remove the Total row
	actividades_cod <- subset(actividades_cod, actividad != "Total")
	
	# Subset only the values for the last year available (2012)
	actividades_cod <- subset(actividades_cod, date == "2012")
	
	# Remove the date variable
	actividades_cod$date <- NULL
	
	# Split the 'actividad' in code and description
	cols <- colsplit(actividades_cod$actividad, " \\(", c("descripcion", "cod"))
	value <- actividades_cod$value
	actividades_cod <- cbind(cols, value)
	
	# Get rid off everything except the (first) number 
	r <- regexpr("[0-9]{2}", actividades_cod$cod)
	actividades_cod$cod <- regmatches(actividades_cod$cod, r)
	actividades_cod$cod <- gsub("^0", "", actividades_cod$cod)
	
	actividades_cod$cod <- as.numeric(actividades_cod$cod)
	
	# Join the df with the cnae official list
	
	cnae <- read.csv("cnae.csv", header = TRUE)
	
	actividades_cod <- join(actividades_cod, cnae[ ,1:3], by = "cod")
	actividades_cod <- actividades_cod[ ,c(4,5,2,1,3)]
	
	actividades_cod$act_descripcion <- gsub("; reparación de vehículos de motor y motocicletas", "", actividades_cod$act_descripcion, fixed = T)
	
	actividades_cod <- aggregate(value ~ actividad + act_descripcion, data = actividades_cod, sum)
	actividades_cod <- actividades_cod[order(actividades_cod$actividad), ]
	
	actividades_cod$cod <- actividades_mun$cod[i]
	actividades_cod$mun <- actividades_mun$mun[i]
	
	cod <- unique(actividades_mun$cod)[i]
	name <- paste("actividades_", cod, sep = "")
	assign(name, actividades_cod)
	write.csv(actividades_cod, paste(name, ".csv", sep = ""), row.names = F)
	
}
