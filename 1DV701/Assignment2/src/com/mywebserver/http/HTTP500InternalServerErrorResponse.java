package com.mywebserver.http;

public class HTTP500InternalServerErrorResponse extends HTTPResponse{

	@Override
	public String getResponse() {
		String content = "<html><body><h1>500 Internal server error</h1></body></html>";
		String response = ("HTTP/1.1 500 Internal server error\r\n");
		response += "Content-Type: text/html\r\n";
		response += "Content-Length: " + content.getBytes().length + "\r\n";
		response += "\r\n";
		return response;
	}
}
