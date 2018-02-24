package com.mywebserver.request;

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