package com.mywebserver.request;

import java.util.Map;

public class HTTPRequest {
	
	private String type;
	private String url;
	private Map<HTTPHeader.Header, HTTPHeader> headers;
	
	public HTTPRequest(String type, String url, Map<HTTPHeader.Header, HTTPHeader> headers) {
		this.type = type;
		this.url = url;
		this.headers = headers;
		
		//TODO Validate that headers contains "Host".
	}
	
	public String getType() {
		return this.type;
	}
	
	public String getUrl() {
		return this.url;
	}
}
