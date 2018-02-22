package com.mywebserver.http;

public class HTTP302FoundResponse extends HTTPResponse{
	
	private String location;
	
	public HTTP302FoundResponse(String location){
		this.location = location;
	}

	@Override
	public String getResponse() {
		this.content = "<html><body><h1>302 Found</h1></body></html>";
		String response = ("HTTP/1.1 302 Found\r\n");
		response += "Content-Type: text/html\r\n";
		response += "Content-Length: " + content.getBytes().length + "\r\n";
		response += "Location: " + this.location + "\r\n";
		response += "\r\n";
		return response;
	}
}
