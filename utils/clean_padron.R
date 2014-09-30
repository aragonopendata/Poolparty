options(stringsAsFactors = F)
setwd("~/Dropbox/Jacathon/raw_data/padron/")

# # Remove the .html extension for every file (run only once)
# a <- list.files(pattern="*.csv.html")
# b <- gsub("\\.html", "", a)
# file.rename(a, b)
# rm(a, b)

files <- list.files(pattern = ".csv")
names <- gsub("\\.csv", "", files)
names <- gsub("raw_", "", names)

padron <- data.frame()

for (i in 1:length(files)) {
	print(files[i])
	df <- read.csv(files[i], header = F)
	
	## Remove every column that has only NAs.
	df <- df[ ,apply(!is.na(df), 2, all)]
	
	## Remove the whitespaces at the beginning of every cell
	df <- as.data.frame(apply(df, 2, function(x) gsub("^ ", "", x)))
	
	## Remove every column before a column that has '22001' (first code) as value.
	ncol <- ncol(df)
	
	for(j in 1:ncol) {
		z <- which(df[ ,j] == "22001")
		if (length(z) == 1) {
			first_col <- j
			break
		}
	}
	
	df <- df[ ,first_col:ncol]
	
	## Remove every row which first column is not a 'number string'.
	df <- df[grepl("^[0-9]", df[ ,1]), ]
	
	## Add a date (year) column
	year <- strsplit(names[i], "_")[[1]][2]
	df$date <- year
	
	## Assign column names
	names(df) <- c("cod", "mun", "all", "male", "female", "date")
	
	print(names[i])
	assign(names[i], df)
	filepath <- paste("~/Dropbox/Jacathon/data/padron/",names[i], ".csv", sep="")
	write.csv(df, filepath, row.names = F)
	
	padron <- rbind(padron, df)
}
names(padron) <- c("cod", "mun", "all", "male", "female", "date")
rm(df, i, j, z, ncol, files, first_col, names, filepath, year)

# Normalice the data 
padron$cod <- gsub("\\.0", "", padron$cod)
padron[ ,3:5] <- apply(padron[ ,3:5], 2, function(x) round(as.numeric(x), 0))
names(padron) <- c("cod", "mun", "total", "hombres", "mujeres", "date")

# Save the data
write.csv(padron, "~/Dropbox/Jacathon/data/padron/padron.csv", row.names = F)


# Extract the csv files for each 'municipio'
padron <- read.csv("~/Dropbox/Jacathon/data/padron/padron.csv", header = T)

for (i in 1:length(unique(padron$cod))) {
	padron_cod <- subset(padron, padron$cod == padron$cod[i])
	cod <- padron$cod[i]
	name <- paste("padron_", cod, sep = "")
	assign(name, padron_cod)
	write.csv(padron_cod, paste(name, ".csv", sep = ""), row.names = F)
}
