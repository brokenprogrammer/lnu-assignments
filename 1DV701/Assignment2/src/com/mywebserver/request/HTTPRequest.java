package com.mywebserver.request;

import java.util.Map;

/**
 * HTTPRequest object containing a the request type, url and the Headers sent with the
 * request.
 * 
 * @author Oskar
 * @version 00.00.00
 * @name HTTPRequest.java
 */
public class HTTPRequest {
	
	private String type;
	private String url;
	private Map<Header, HTTPHeader> headers;
	
	public HTTPRequest(String type, String url, Map<Header, HTTPHeader> headers) {
		this.type = type;
		this.url = url;
		this.headers = headers;
	}
	
	public String getType() {
		return this.type;
	}
	
	public String getUrl() {
		return this.url;
	}
	
	public Map<Header, HTTPHeader> getHeaders() {
		return this.headers;
	}
}
