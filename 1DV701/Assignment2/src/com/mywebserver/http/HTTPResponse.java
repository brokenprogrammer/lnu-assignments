package com.mywebserver.http;

import java.io.File;

public abstract class HTTPResponse {
	
	protected File file;
	
	public abstract String getResponse();
	
	public File getFile(){
		return this.file;
	}
}
