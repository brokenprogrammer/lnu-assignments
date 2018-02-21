package com.mywebserver;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

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
		
		try {
			// Initialize input and output streams.
			this.inputStream = new DataInputStream(this.socket.getInputStream());
			this.outputStream = new DataOutputStream(this.socket.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	@Override
	public void run() {
		try {
			String receivedString = "";
			byte[] buffer = new byte[BUFFERSIZE];
			int bytesRead = 0;
			
			// While there is bytes to read in the input stream we read them into
			// buffer and echo it back to client.
//			while ((bytesRead = inputStream.read(buffer)) != -1) {
//				receivedString = new String(buffer).trim();
//				
//				if (!receivedString.isEmpty()) {
//					// Echo the message back to the client.
//					outputStream.write(receivedString.getBytes());
//
//					// Print status message.
//					System.out.println("User: " + this.userNumber + ", IP: " + socket.getInetAddress() + 
//							", PORT: " + socket.getPort() + ", Recieved and sent " + receivedString.length() + " bytes");
//				}
//				
//				// Reset buffer.
//				buffer = new byte[BUFFERSIZE];
//			}
			
			outputStream.write(new String("HTTP/1.1 200 OK\r\n\r\nHello world").getBytes());
			//outputStream.write(new String("Hej Testing").getBytes());
			
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