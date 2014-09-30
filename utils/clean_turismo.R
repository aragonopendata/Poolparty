options(stringsAsFactors = F)
setwd("~/Dropbox/Jacathon/raw_data/")
require(reshape2)
require(plyr)

turismo <- read.csv("turismo.csv", header = F)
names(turismo) <- as.character(turismo[1, ])
turismo <- turismo[-1, 1:10]

for (i in 1:length(unique(turismo$cp))) {
	turismo_cod <- subset(turismo, turismo$cp == turismo$cp[i])
	turismo_t <- as.data.frame(t(turismo_cod[ ,-1:-2]))
	turismo_t$description <- row.names(turismo_t)
	
	names(turismo_t)[1] <- c("value")
	
	c <- colsplit(turismo_t$description, "_", c("ep", "tipo"))
	turismo_t <- cbind(turismo_t, c)
	turismo_t$description <- NULL
	
	turismo_t <- as.data.frame(acast(turismo_t, tipo ~ ep ))
	turismo_t$tipo <- c("Apartamentos", "Campings", "Casas Rurales", "Hoteles")
	names(turismo_t)[1:2] <- c("establecimientos", "plazas")
	turismo_t$cod <- turismo$cp[i]
	turismo_t$mun <- turismo$municipio[i]
	
	turismo_t <- as.data.frame(apply(turismo_t, 2, function(x) gsub("^ ", "", x)))
	turismo_t[ ,1:2] <- as.data.frame(apply(turismo_t[ ,1:2], 2, function(x) as.numeric(x)))
	
	turismo_t <- turismo_t[order(turismo_t$plazas, decreasing = T), ]
	
	
	cod <- turismo$cp[i]
	name <- paste("turismo_", cod, sep = "")
	assign(name, turismo_t)
	write.csv(turismo_t, paste(name, ".csv", sep = ""), row.names = F)
}