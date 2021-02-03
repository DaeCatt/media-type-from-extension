"use strict";

const fs = require("fs");
const path = require("path");

/**
 * @param {string=} sourcePath Path to media type data. Defaults to /etc/mime.types
 */
const makeLookup = (sourcePath = "/etc/mime.types") => {
	const extnameToMediaTypeMap = new Map();
	for (const line of fs.readFileSync(sourcePath, "utf-8").split(/\n/g)) {
		if (line.startsWith("#")) continue;
		if (line.length === 0) continue;

		const [mediaType, ...extensions] = line.split(/\s+/g);
		for (const extension of extensions) {
			const extname = "." + extension;
			extnameToMediaTypeMap.set(extname, mediaType);
		}
	}

	/**
	 * @param {string} filePath
	 * @return {string|null}
	 */
	const mediaTypeFromExtension = (filePath) => {
		const extname = path.extname(filePath);
		if (extname === "" || extname === ".") return null;
		return extnameToMediaTypeMap.get(extname) ?? null;
	};

	return mediaTypeFromExtension;
};

module.exports = makeLookup;
