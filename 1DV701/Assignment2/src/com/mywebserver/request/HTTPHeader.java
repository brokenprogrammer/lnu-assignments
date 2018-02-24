package com.mywebserver.request;

import java.util.HashMap;
import java.util.Map;

/**
 * HTTPHeader object containing a Header together with its value in String form.
 * 
 * @author Oskar
 * @version 00.00.00
 * @name HTTPHeader.java
 */
public class HTTPHeader {
	
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
	
	/**
	 * Static helper method that extracts a header from a String and returns a HTTPHeader object
	 * based on the Header that was extracted.
	 * 
	 * @param s - Target string to retrieve HTTPHeader from.
	 * 
	 * @return - HTTPHeader extracted from String.
	 * 
	 * @throws Exception - If target String is not a valid HTTPHeader.
	 */
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
	
	/**
	 * Static helper method that parses all the headers from a String array and returns them in the 
	 * form of a Map of Header and HTTPHeader pairs.
	 * 
	 * @param headers - String array of all the headers to be parsed.
	 * 
	 * @return - Map of Header and HTTPHeader pairs.
	 * 
	 * @throws Exception - If failed to parse a header.
	 */
	public static Map<Header, HTTPHeader> parseHeaders(String[] headers) throws Exception {
		Map<Header, HTTPHeader> parsedHeaders = new HashMap<Header, HTTPHeader>();
		
		for (int i = 1; i < headers.length; i++) {
			HTTPHeader header = headerFromString(headers[i]);
			parsedHeaders.put(header.type, header);
		}
		
		return parsedHeaders;
	}
}
