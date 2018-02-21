package com.mywebserver.http;

import java.io.File;

public class HTTP200OKResponse extends HTTPResponse{
	
	private File file;
	
	public HTTP200OKResponse(File file){
		this.file = file;
		if(this.file.isDirectory()){
			File[] files = this.file.listFiles();
			for(int i = 0; i < files.length; i++){
				if(files[i].equals("index.htm") || files[i].equals("index.html")){
					this.file = files[i];
				}
			}
		}
	}
	
	@Override
	public String getResponse(){
		String res = "HTTP/1.1 200 OK\r\n\r\n";
		String path = file.getName();
		String[] parts = path.split("\\.");
		String end = parts[parts.length - 1];
		
		if(end.equals("html") || end.equals("htm")){
			end = "text/html";
		} else if(end.equals("png")){
			end = "image/png";
		} else{
			end = "application/unknown";
		}
		
		res += "Content-Type: " + end + "\r\n";
		res += "Content-Length: " + file.length() + "\r\n";	
		return res;
	}
}
