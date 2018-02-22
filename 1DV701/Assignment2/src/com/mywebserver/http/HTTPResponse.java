package com.mywebserver.http;

import java.io.File;

public abstract class HTTPResponse {
	
	protected File file;
	protected String content;
	
	public abstract String getResponse();
	
	public File getFile(){
		return this.file;
	}
	
	public String getContent(){
		return this.content;
	}
}
