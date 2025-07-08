const config = { 
	// Optional values for default: "true" or "false" 
	default: false, 

	//"true" --> pdf will be downloaded from the folder "default" 
	filename: "", 

	//"false" --> pdf(s) will be downloaded from the folder(s) with the active language 
	filenames : {
        "en_GB": ""
} 

	// NOTE: If a filename is empty (""), the download button for this language/folder will be hidden. 
	// NOTE: If the filename differs from the real name, the file can not be traced and the download will fail. 
};