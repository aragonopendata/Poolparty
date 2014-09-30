options(stringsAsFactors = F)
setwd("~/Dropbox/Jacathon/raw_data/municipios/")

require("ggmap")

# Read the 'mnicipios' csv list.
municipios <- read.csv("municipios.csv", col.names = "mun", header = T)

# Add a 'geo' column,specifying thst the 'municipios' are all in 'aragon'
municipios$geo <- municipios$mun
municipios$geo <- sapply(municipios$geo, function(x) paste (x, "aragón"))

# Geocode the municipios by the 'geo' variable.
geocoded <- sapply(municipios$geo, function(x) geocode(x, output = c("latlona")))
geocoded <- as.data.frame(t(geocoded))
geocoded$geo <- row.names(geocoded)

mun_geocoded <- merge(geocoded, municipios)


# Add the geocoded mun to the current list
ine_cp <- read.csv("~/Dropbox/Jacathon/Poolparty/public/assets/ine_cp.csv", col.names = c("mun", "comarca", "ine"), header = T)

# Look for diferences
a <- ine_cp[!(ine_cp$mun %in% mun_geocoded$mun), ]
b <- mun_geocoded[!(mun_geocoded$mun %in% ine_cp$mun), ]

mun_geocoded_right <- mun_geocoded[(mun_geocoded$mun %in% ine_cp$mun), ]
b$mun <- a$mun
mun_geocoded <- rbind(mun_geocoded_right, b)

mun_geocoded <- merge(ine_cp, mun_geocoded)

names(mun_geocoded)[1] <- "name"
mun_geocoded <- as.data.frame(apply(mun_geocoded, 2, unlist))

# Get rid off everything but the postal code when available
for (i in 1: length(mun_geocoded$address)) {
	r <- regexpr("^[0-9]{5}", mun_geocoded$address[i])
	if (r != -1) {
		mun_geocoded$cp[i] <- regmatches(mun_geocoded$address[i], r)
	} else {
		mun_geocoded$cp[i] <- NA
	}
}
rm(r)

# Remove unnecessary variables
mun_geocoded$address <- NULL
mun_geocoded$geo <- NULL

# Save the file
write.csv(mun_geocoded, "mun_geocoded.csv", row.names = F)

