options(stringsAsFactors = F)
setwd("~/Dropbox/Jacathon/raw_data/paro/")
require(plyr)


# Read the paro file
paro <- read.csv("paro.csv", colClasses = "character", header = T)

# Remove the '.' and convert to numeric
paro[, 3:5] <- apply(paro[ ,3:5], 2, function(x) as.numeric(gsub(".", "", x, fixed = T)))

# Subset the total column
paro <- paro[ ,c(1:3,6)]
names(paro) <- c("cod", "mun", "Paro", "date")


# Read the padron file
padron <- read.csv("padron.csv")

# Subset the total column
padron <- padron[ ,c(1:3,6)]
names(padron)[3] <- "Padron"

# subset the years in padron for the paro data
years <- unique(paro$date)
padron_a <- padron[padron$date %in% years, ]

# Join the two datasets
poblacion_paro <- join(paro, padron_a, by = c("cod", "date") )
poblacion_paro[ ,5] <- NULL


# Población activa
files <- list.files(pattern = "piramide.+csv")
names <- gsub("\\.csv", "", files)


activos <- data.frame()

for (i in 1:length(files)) {
	df <- read.csv(files[i])
	names(df)[3] <- "cod"
	df <- subset(df, grepl("[0-9]{5}", df$cod))
	
	# 
	cols <- c("19", "24", "29", "34", "39", "44", "49", "54", "59", "64")
	
	
	
	valid_cols <- c()
	for (colname in 1:length(colnames(a))) {
		for (j in cols) {
			if (grepl(j, colnames(a)[colname])) {
				valid_cols <- cbind(colname, valid_cols)
				print(colname)
			}
		}
	}
	
	total <- apply(df[ ,valid_cols], 1, sum)
	df$total <- total
	
	df <- df[ ,c(3,length(df))]
	
	year <- strsplit(names[i], "_")[[1]][2]
	df$date <- year
	
	names(df) <- c("cod", "Activos", "date")
	
	activos <- rbind(activos, df)
}

# Join the activos to the poblacion_paro

poblacion_paro <- join(poblacion_paro, activos, by = c("cod", "date") )

write.csv(poblacion_paro, "poblacion_paro.csv", row.names = F)

poblacion_paro <- read.csv("poblacion_paro.csv", header = T)
poblacion_paro <- subset(poblacion_paro, date != "2005")

# Subset every cod

for (i in 1:length(unique(poblacion_paro$cod))) {
	poblacion_paro_cod <- subset(poblacion_paro, poblacion_paro$cod == poblacion_paro$cod[i])
	cod <- poblacion_paro$cod[i]
	name <- paste("poblacion_paro_", cod, sep = "")
	assign(name, poblacion_paro_cod)
	poblacion_paro <- poblacion_paro[order(poblacion_paro$date, decreasing = F), ]
	write.csv(poblacion_paro_cod, paste(name, ".csv", sep = ""), row.names = F)
}

