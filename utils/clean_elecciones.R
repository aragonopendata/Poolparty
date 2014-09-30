options(stringsAsFactors = F)
setwd("~/Dropbox/Jacathon/raw_data/elecciones/")
require(plyr)

files <- list.files(pattern = ".csv")
names <- gsub("\\.csv", "", files)

for (i in 1:length(files)) {
	df <- read.csv(files[i], header = TRUE)
	df[ ,3:length(df)] <- as.data.frame(apply(df[ ,3:length(df)], 2, function(x) round(as.numeric(x),0)))
	df[is.na(df)] <- 0
	date = unlist(strsplit(names[i], "_"))[2]
	df$date = date
	
	df_votos <- df[ ,c(1:2,9:length(df))]
	name_votos <- paste("votos_", names[i], sep = "")
	
	df_part <- df[ ,c(1:8,length(df))]
	name_part <- paste("part_", names[i], sep = "")	
	
	assign(names[i], df)
	assign(name_votos, df_votos)
	assign(name_part, df_part)
}

rm(df, df_part, df_votos, ec_2007, ec_2011, em_2007, em_2011)
rm(part_ec_2007, part_ec_2011, part_em_2007, part_em_2011, votos_ec_2007, votos_ec_2011)


# Formatting data for votos_em (2007 & 2011)
for (i in 1:length(unique(votos_em_2007$cod))) {
	#Subset the data
	cod_em_2007 <- subset(votos_em_2007, votos_em_2007$cod == unique(votos_em_2007$cod)[i])
	cod_em_2011 <- subset(votos_em_2011, votos_em_2011$cod == unique(votos_em_2007$cod)[i])
	
	#Remove every parti variable equal to 0.
	cod_em_2007 <- cod_em_2007[ , !apply(cod_em_2007==0,2,all)]
	cod_em_2011 <- cod_em_2011[ , !apply(cod_em_2011==0,2,all)]
	
	# Bind the two datasets
	cod_em <- rbind.fill(cod_em_2007, cod_em_2011)
	
	# Remove the 'mun' and 'cod' variables
	cod_em$mun <- NULL
	cod_em$cod <- NULL
	
	# Melt the data
	cod_em_melt <- melt(cod_em)
	
	#Paste the 'date' and 'variable' columns
	# columns to paste together
	cols <- c("variable", "date")
	
	# create a new column `x` with the three columns collapsed together
	cod_em_melt$target <- apply(cod_em_melt[ , cols], 1 ,paste, collapse = " ")
	
	# remove the unnecessary rows
	cod_em_melt <- cod_em_melt[ , !(names(cod_em_melt) %in% cols ) ]
	
	# Store the values for the candidatures and remove them
	candidaturas_2007 <- cod_em_melt$value[cod_em_melt$target == "Candidaturas 2007"]
	candidaturas_2011 <- cod_em_melt$value[cod_em_melt$target == "Candidaturas 2011"]
	
	cod_em_melt <- subset(cod_em_melt, !grepl("^Candidaturas", target))
	
	#Remove NAs
	
	cod_em_melt <- subset(cod_em_melt, !is.na(value))
	
	# FORMAT THE DATA FOR THE SANKEY
	# first flow, from candidaturas 2007 to their respective parties votes
	# subset every party for 2007 with their values
	parties_2007 <- subset(cod_em_melt, grepl("*.2007", target))
	# Add a 'source' column
	first <- parties_2007
	first$source <- "Votos a candidaturas 2007"
	
	#Second flow: the source would be the current target, so:
	second <- parties_2007
	second$source <- second$target
	
	#And the target is for every row "Votos a candidaturas 2011"
	second$target <- "Votos a candidaturas 2011"
	
	# the third flow, is from candidaturas 2011, to the votes to every party. Exactly the same we did in the first flow
	parties_2011 <- subset(cod_em_melt, grepl("*.2011", target))
	third <- parties_2011
	# Add a 'source' column
	third$source <- "Votos a candidaturas 2011"
	
	# Bind the third to the sankey
	sankey <- rbind(first, second, third)
	
	# Order the data
	sankey <- sankey[ ,c("source", "target", "value")]
	
	cod <- unique(votos_em_2007$cod)[i]
	name <- paste("sankey_", cod, sep = "")
	assign(name, sankey)
	write.csv(sankey, paste(name, ".csv", sep = ""), row.names = F)
}

