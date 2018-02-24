package com.mywebserver.request;

/**
 * Enum that conatins the types of Headers available in a HTTPRequest.
 * 
 * @author Oskar
 * @version 00.00.00
 * @name Header.java
 */
public enum Header {
	Host("Host"),
	ContentType("Content-Type"), 
    ContentLength("Content-Length"), 
    Connection("Connection"),
    CacheControl("Cache-Control"),
    Accept("Accept"),
    UserAgent("User-Agent"),
    AcceptEncoding("Accept-Encoding"),
    AcceptLanguage("Accept-Language"),
    UnknownHeader("Unknown-Header");
	
	String headerName;
	
	private Header(String headerName) {
		this.headerName = headerName;
	}
}