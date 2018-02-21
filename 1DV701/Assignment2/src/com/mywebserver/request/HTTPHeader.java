package com.mywebserver.request;

import java.util.HashMap;
import java.util.Map;

public class HTTPHeader {
	
	// Return map???? of headers or construct yourself.. (booring)
	
	// Headers:
//	Host("Host"), 
//    ContentType("Content-Type"), 
//    ContentLength("Content-Length"), 
//    Connection("Connection"),
//    CacheControl("Cache-Control"),
//    Accept("Accept"),
//    UserAgent("User-Agent"),
//    AcceptEncoding("Accept-Encoding"),
//    AcceptLanguage("Accept-Language"),
//    UnknownHeader("Unknown-Header");
	
	
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
	
	private Header type;
	private String value;
	
	public HTTPHeader(Header type, String value) {
		this.type = type;
		this.value = value;
	}
	
	public Header getHeader() {
		return this.type;
	}
	
	public String getValue() {
		return this.value;
	}
	
	public static HTTPHeader headerFromString(String s) throws Exception {
		String[] content = s.split(": ");
		if (content.length != 2) {
			throw new Exception("Invalid header: " + s);
		}
		
		for (Header h : Header.values()) {
			if (s.startsWith(h.headerName)) {
				return new HTTPHeader(h, content[1]);
			}
		}
		
		return new HTTPHeader(Header.UnknownHeader, content[1]);
	}
	
	public static Map<Header, HTTPHeader> parseHeaders(String[] headers) throws Exception {
		Map<Header, HTTPHeader> parsedHeaders = new HashMap<Header, HTTPHeader>();
		
		for (int i = 1; i < headers.length; i++) {
			HTTPHeader header = headerFromString(headers[i]);
			parsedHeaders.put(header.type, header);
		}
		
		return parsedHeaders;
	}
}
