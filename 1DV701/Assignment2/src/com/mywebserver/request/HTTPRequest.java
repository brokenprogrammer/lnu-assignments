package com.mywebserver.request;

import java.util.Map;

public class HTTPRequest {
	
	String type;
	String url;
	private Map<HTTPHeader.Header, HTTPHeader> headers;
	
	public HTTPRequest(String type, String url, Map<HTTPHeader.Header, HTTPHeader> headers) {
		this.type = type;
		this.url = url;
		this.headers = headers;
		
		//TODO Validate that headers contains "Host".
	}
}
