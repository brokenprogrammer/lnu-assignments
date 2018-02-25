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
import com.mywebserver.request.Header;
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
	
	/**
	 * Reads the socket's InputStream to retrieve a string version of the HTTP request
	 * that was sent to the server.
	 * 
	 * @return - String with the content of the HTTP request that was sent to the server.
	 * 
	 * @throws IOException - If unexpectedly reaching EOF when reading the HTTP request.
	 */
	private String getRequest() throws IOException {
		// DataInputStream is deprecated for this task so buffered reader is used instead.
		BufferedReader in = new BufferedReader(new InputStreamReader((this.socket.getInputStream())));
		
		// Read everything in the inputstream.
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
			
			// Parse the Content Length value if the current read header is the content length.
			if (line.startsWith("Content-Length:")) {
				String number = line.substring(16);
				contentLength = Integer.parseInt(number); 
			}
		}
		
		// Parse the rest of the content in the request based on the content length.
		for (int i = 0; i < contentLength; i++) {
			content.append((char)in.read());
		}
		
		return content.toString();
	}
	
	/**
	 * Parses a a HTTPRequest from a String into a HTTPRequest object. Also parses all the headers
	 * and stores them together with the request type within the HTTPRequest object.
	 * 
	 * @param request - String of read request made to the server.
	 * 
	 * @return - A HTTPRequest object created through parsing the contents of the HTTP request string.
	 * 
	 * @throws Exception - If the format of the String doesn't match a valid HTTP request.
	 */
	private HTTPRequest parseRequest(String request) throws Exception {
		
		String[] lines = request.split("\r\n");
		String first = lines[0];
		
		// First line contains the request type and path, a format of length 3. If this doesn't match
		// then its not a valid request String.
		String type = first.split(" ").length == 3 ? first.split(" ")[0] : null;
		if (type == null) {
			throw new Exception("Invalid Request Type.");
		}
		
		// Switch over the request type.
		switch(type) {
			case "GET":
			{
				Map<Header, HTTPHeader> httpHeaders = HTTPHeader.parseHeaders(lines);
				return new HTTPRequest("GET", first.split(" ")[1], httpHeaders);
			}
		}
		
		// No valid request type was found.
		return null;
	}
	
	/**
	 * Evaluates a HTTPRequest and constructs and returns a HTTPResponse based on the 
	 * evaluation of the HTTPRequest.
	 * 
	 * @param request - HTTPRequest to evaluate.
	 * 
	 * @return - HTTPResponse based on the evaluation of the HTTPRequest.
	 */
	private HTTPResponse getResponse(HTTPRequest request) {
		switch (request.getType()) {
			case "GET":
			{
				try {
					// If the request URL is pointing to a directory set to be redirected to another URL
					// or HTTP code 302.
					if (request.getUrl().contains("/workinprogress")) {
						return new HTTP302FoundResponse("/");
					}
					
					// Set directory that returns a error response for testing purposes.
					if (request.getUrl().contains("/errordir")) {
						return new HTTP500InternalServerErrorResponse();
					}
					
					// Set directory that returns a forbidden response for testing purposes.
					if (request.getUrl().contains("/forbiddendir")) {
						return new HTTP403ForbiddenResponse();
					}
					
					// Read the file located at the URL of the HTTPRequest.
					File file = translateURL(request.getUrl());
					return new HTTP200OKResponse(file);
					
				} catch (FileNotFoundException e) {
					// If no such file was found a HTTP response of code 404 is sent back.
					return new HTTP404FileNotFoundResponse();
				} catch (SecurityException e) {
					// If the file or directory is protected a HTTP response of code 403 is sent back.
					return new HTTP403ForbiddenResponse();
				} catch (IOException e) {
					// If any errors have occurred by the server then a HTTP response of code 500 is sent back.
					return new HTTP500InternalServerErrorResponse();
				}
			}
		}
		
		// If a request of a type that is not implemented a HTTP response of code 500 is sent back.
		return new HTTP500InternalServerErrorResponse();
	}
	
	/**
	 * Translates an URL to a valid file. 
	 * 
	 * @param url - Target URL to retrieve file from.
	 * 
	 * @return - File at given URL from the shared path or error if the file doesn't exist or is protected.
	 * 
	 * @throws IOException
	 */
	private File translateURL(String url) throws IOException {
		if (url.endsWith("/") || url.endsWith("\\")) {
			url += "index.html";
		}
		
		File shared = new File(TCPEchoServer.SHAREDFOLDER);
		File file = new File(shared.getAbsolutePath() + url);
		
		// Search for the index.html if the user only specified an URL to a directory.
		if (file.isDirectory()) {
			file = new File(file.getAbsolutePath() + "/index.html");
		}
		
		// If user tries to access non-shared folder
		String filePath = file.getCanonicalPath();
		if (!filePath.substring(0, shared.getAbsolutePath().length()).equals(shared.getAbsolutePath())) {
			throw new SecurityException();
		}
		
		// If the file exist simply return the file.
		if (file.exists()) {
			return file;
		}
		
		// If the file was not found.
		throw new FileNotFoundException();
	}
	
	/**
	 * Writes a response back to the client based on a HTTPResponse object.
	 * 
	 * @param response - HTTPResponse object to write to the client.
	 * 
	 * @throws IOException
	 */
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
			String request;
			
			try {
				// Retrieve HTTP request sent to the server.
				request = getRequest();
				
				// Initialize a HTTPRequest object using the read HTTP response.
				HTTPRequest httpRequest = parseRequest(request);
				
				// Uses the HTTPRequest object to determine what type of HTTPResponse to send back to the client.
				HTTPResponse httpResponse = getResponse(httpRequest);
				
				// Write the HTTPResponse back to the client.
				writeResponse(httpResponse);
			
			} catch (Exception e) {
				// If parsing failed we return a HTTP response of a Internal error.
				HTTPResponse internalErrorResponse = new HTTP500InternalServerErrorResponse();
				writeResponse(internalErrorResponse);
			}
			
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