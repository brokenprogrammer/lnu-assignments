package com.mywebserver;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;

import com.mywebserver.http.HTTP200OKResponse;
import com.mywebserver.http.HTTP302FoundResponse;
import com.mywebserver.http.HTTP403ForbiddenResponse;
import com.mywebserver.http.HTTP404FileNotFoundResponse;
import com.mywebserver.http.HTTP500InternalServerErrorResponse;
import com.mywebserver.http.HTTPResponse;
import com.mywebserver.request.HTTPHeader;
import com.mywebserver.request.HTTPHeader.Header;
import com.mywebserver.request.HTTPRequest;

/**
 * TCPEchoServer that listens to incoming connections through TCP and 
 * then listens to messages and echoes them back to the client.
 * 
 * @author Oskar
 * @version 00.00.00
 * @name TCPEchoServer.java
 */
public class TCPEchoServer {
    public static final int MYPORT= 8080;
    public static int userNumber = 1;
    public static final String SHAREDFOLDER = "shared"; // Project root.
    
    public static void main(String[] args) throws IOException {
    	// Create server socket.
    	ServerSocket serverSocket = new ServerSocket(MYPORT);
    	
    	System.out.println("Server has been started and is now running..");
    	
    	// Start listening for incoming connections.
    	while (true) {
    		// If connection was found then accept it.
    		Socket socket = serverSocket.accept();
    		
    		// Initialize new client thread.
    		ServerClient serverClient = new ServerClient(socket, userNumber++);
    		
    		// Start the new thread for the client.
    		new Thread(serverClient).start();
    	}
    }
}

class ServerClient implements Runnable {
	public static final int BUFFERSIZE= 1024;
	private byte[] buffer;
	private Socket socket;
	private int userNumber;
	private DataInputStream inputStream;
	private DataOutputStream outputStream;
	
	/**
	 * Initializes a new ServerClient which is used as a thread to listen 
	 * for incoming messages then echo it back to the client.
	 * 
	 * @param socket - Client socket.
	 * @param userNumber - User number for the connected user.
	 */
	public ServerClient(Socket socket, int userNumber) {
		this.socket = socket;
		this.userNumber = userNumber;
		this.buffer = new byte[BUFFERSIZE];
		
		try {
			// Initialize input and output streams.
			this.inputStream = new DataInputStream(this.socket.getInputStream());
			this.outputStream = new DataOutputStream(this.socket.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	private String getRequest() throws IOException {
		BufferedReader in = new BufferedReader(new InputStreamReader((this.socket.getInputStream())));	
		
		// Read all in the input buffer..
		StringBuilder content = new StringBuilder();
		int contentLength = 0;
		while(true) {
			String line = in.readLine();
			
			if (line == null) {
				throw new IOException("Reached end of file.");
			}
			
			content.append(line + "\r\n");
			
			if (line.equals("\r\n") || line.equals("")) {
				break;
			}
			
			if (line.startsWith("Content-Length:")) {
				String number = line.substring(16);
				contentLength = Integer.parseInt(number); 
			}
		}
		
		for (int i = 0; i < contentLength; i++) {
			content.append((char)in.read());
		}
		
		String request = content.toString();
		
		return request;
	}
	
	private HTTPRequest parseRequest(String request) throws Exception {
		
		String[] lines = request.split("\r\n");
		String first = lines[0];
		
		String type = first.split(" ").length == 3 ? first.split(" ")[0] : null;
		if (type == null) {
			throw new Exception("Invalid Request Type.");
		}
		
		
		switch(type) {
			case "GET":
			{
				Map<Header, HTTPHeader> httpHeaders = HTTPHeader.parseHeaders(lines);
				// Doesnt find "Accept Header"...	//TODO: Bug.

				return new HTTPRequest("GET", first.split(" ")[1], httpHeaders);
			}
		}
		
		return null;
	}
	
	private HTTPResponse getResponse(HTTPRequest request) {
		switch (request.getType()) {
		case "GET":
			try {
				if (request.getUrl().contains("/workinprogress")) {
					return new HTTP302FoundResponse("/");
				}
				File file = translateURL(request.getUrl());
				return new HTTP200OKResponse(file);
			} catch (FileNotFoundException e) {
				return new HTTP404FileNotFoundResponse();
			} catch (SecurityException e) {
				return new HTTP403ForbiddenResponse();
			} catch (IOException e) {
				return new HTTP500InternalServerErrorResponse();
			}
		}
		
		return new HTTP500InternalServerErrorResponse();
	}
	
	private File translateURL(String sharedPath) throws IOException {
		String url = sharedPath;
		
		
		if (url.endsWith("/") || url.endsWith("\\")) {
			url += "index.html";
		}
		
		File shared = new File(TCPEchoServer.SHAREDFOLDER);
		File file = new File(shared.getAbsolutePath() + url);
		
		if (file.isDirectory()) {
			file = new File(file.getAbsolutePath() + "/index.html");
		}
		
		// If user tries to access non-shared folder
		String filePath = file.getCanonicalPath();
		if (!filePath.substring(0, shared.getAbsolutePath().length()).equals(shared.getAbsolutePath())) {
			throw new SecurityException();
		}
		
		if (file.exists()) {
			return file;
		}
		
		throw new FileNotFoundException();
	}
	
	private void writeResponse(HTTPResponse response) throws IOException {
		String str = response.getResponse();
		PrintWriter pw = new PrintWriter(this.outputStream, true);
		pw.write(str);
		pw.flush();
		if(response instanceof HTTP200OKResponse){
			FileInputStream in = new FileInputStream(response.getFile());
			OutputStream out = this.outputStream;
			int count = 0;
			while((count = in.read(buffer)) != -1){
				out.write(buffer, 0, count);
			}
			in.close();
		} else {
			pw.write(response.getContent());
			pw.flush();
		}
	}
	
	@Override
	public void run() {
		try {
			String receivedString = "";
			byte[] buffer = new byte[BUFFERSIZE];
			int bytesRead = 0;
			
			String request = getRequest();
			HTTPRequest httpRequest = parseRequest(request);
			
			HTTPResponse httpResponse = getResponse(httpRequest);
			writeResponse(httpResponse);
			
			// Close the socket when done.
			try {
				socket.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}