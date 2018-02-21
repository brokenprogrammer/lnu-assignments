package com.mywebserver.http;

public class HTTP404FileNotFoundResponse extends HTTPResponse{

	@Override
	public String getResponse() {
		String content = "<html><body><h1>404 Not found</h1></body></html>";
		String response = ("HTTP/1.1 404 Not Found\r\n");
		response += "Content-Type: text/html\r\n";
		response += "Content-Length: " + content.getBytes().length + "\r\n";
		response += "\r\n";
		return response;
	}
}
