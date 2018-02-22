package com.mywebserver.http;

public class HTTP403ForbiddenResponse extends HTTPResponse{

	@Override
	public String getResponse() {
		this.content = "<html><body><h1>403 Forbidden</h1></body></html>";
		String response = ("HTTP/1.1 403 Forbidden\r\n");
		response += "Content-Type: text/html\r\n";
		response += "Content-Length: " + content.getBytes().length + "\r\n";
		response += "\r\n";
		return response;
	}
}
