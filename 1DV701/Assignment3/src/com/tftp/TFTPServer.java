package com.tftp;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class TFTPServer 
{
	public static final int TFTPPORT = 4970;
	public static final int BUFSIZE = 516;
	public static final String READDIR = "shared/read/"; //custom address at your PC
	public static final String WRITEDIR = "shared/write/"; //custom address at your PC
	// OP codes
	public static final int OP_RRQ = 1;
	public static final int OP_WRQ = 2;
	public static final int OP_DAT = 3;
	public static final int OP_ACK = 4;
	public static final int OP_ERR = 5;

	public static void main(String[] args) {
		
		//Starting the server
		try 
		{
			TFTPServer server= new TFTPServer();
			server.start();
		}
		catch (SocketException e) 
			{e.printStackTrace();}
	}
	
	private void start() throws SocketException 
	{
		byte[] buf= new byte[BUFSIZE];
		
		// Create socket
		DatagramSocket socket= new DatagramSocket(null);
		
		// Create local bind point 
		SocketAddress localBindPoint= new InetSocketAddress(TFTPPORT);
		socket.bind(localBindPoint);

		System.out.printf("Listening at port %d for new requests\n", TFTPPORT);

		// Loop to handle client requests 
		while (true) 
		{        
			
			final InetSocketAddress clientAddress = receiveFrom(socket, buf);
			
			// If clientAddress is null, an error occurred in receiveFrom()
			if (clientAddress == null) 
				continue;

			final StringBuffer requestedFile= new StringBuffer();
			final int reqtype = ParseRQ(buf, requestedFile);
			
			// DEBUG..
			System.out.println(reqtype);
			System.out.println(requestedFile.toString());
			
			new Thread() 
			{
				public void run() 
				{
					try 
					{
						DatagramSocket sendSocket= new DatagramSocket(0);

						// Connect to client
						sendSocket.connect(clientAddress);						
						
						System.out.printf("%s request for %s from %s using port %d\n",
								(reqtype == OP_RRQ)?"Read":"Write",
								clientAddress.getHostName(), clientAddress.getPort(), TFTPPORT);  
								
						// Read request
						if (reqtype == OP_RRQ) 
						{      
							requestedFile.insert(0, READDIR);
							HandleRQ(sendSocket, requestedFile.toString(), OP_RRQ);
						}
						// Write request
						else 
						{                       
							requestedFile.insert(0, WRITEDIR);
							HandleRQ(sendSocket,requestedFile.toString(),OP_WRQ);  
						}
						sendSocket.close();
					} 
					catch (SocketException e) 
						{e.printStackTrace();}
				}
			}.start();
		}
	}
	
	/**
	 * Reads the first block of data, i.e., the request for an action (read or write).
	 * @param socket (socket to read from)
	 * @param buf (where to store the read data)
	 * @return socketAddress (the socket address of the client)
	 */
	private InetSocketAddress receiveFrom(DatagramSocket socket, byte[] buf) 
	{
		// Create datagram packet
		DatagramPacket packet = new DatagramPacket(buf, buf.length);
		
		// Receive packet
		try {
			socket.receive(packet);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		// Get client address and port from the packet
		int port = packet.getPort();
		InetAddress address = packet.getAddress();
		
		return new InetSocketAddress(address, port);
	}

	/**
	 * Parses the request in buf to retrieve the type of request and requestedFile
	 * 
	 * @param buf (received request)
	 * @param requestedFile (name of file to read/write)
	 * @return opcode (request type: RRQ or WRQ)
	 */
	private int ParseRQ(byte[] buf, StringBuffer requestedFile) 
	{
		// See "TFTP Formats" in TFTP specification for the RRQ/WRQ request contents		
		int opcode = ((buf[0] & 0xFF) << 8) | (buf[1] & 0xFF);
		if (opcode < 1 || opcode > 5) {
			// Errors.. 
		}
		
		requestedFile.append(new String(buf, 2, buf.length-2));
		
		
		return opcode;
	}

	/**
	 * Handles RRQ and WRQ requests 
	 * 
	 * @param sendSocket (socket used to send/receive packets)
	 * @param requestedFile (name of file to read/write)
	 * @param opcode (RRQ or WRQ)
	 */
	private void HandleRQ(DatagramSocket sendSocket, String requestedFile, int opcode) 
	{		
		if(opcode == OP_RRQ)
		{
			// See "TFTP Formats" in TFTP specification for the DATA and ACK packet contents
			Path path = Paths.get(requestedFile.split("\u0000")[0]);
			byte[] filecontent = null;
			try {
				filecontent = Files.readAllBytes(path);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			System.out.println("File Length: " + filecontent.length);
			
			short blockNumber = 1;
			byte[] buf = new byte[BUFSIZE];
			short shortVal = (short)OP_DAT;
			boolean result = false;
			if (filecontent.length <= 512) {
				ByteBuffer wrap = ByteBuffer.wrap(buf);
				wrap.putShort(shortVal);
				wrap.putShort(blockNumber);
				wrap.put(filecontent);
				result = send_DATA_receive_ACK(sendSocket, buf);
			} else {
				for (int len = 0; len <= filecontent.length; blockNumber++) {
					buf = new byte[BUFSIZE];
					if (filecontent.length - len > 512) {
						// Read 512
						ByteBuffer wrap = ByteBuffer.wrap(buf);
						wrap.putShort(shortVal);
						wrap.putShort(blockNumber);
						wrap.put(filecontent, len, 512);
						len += 512;
						result = send_DATA_receive_ACK(sendSocket, buf);
					} 
					else {
						// Read Rest
						ByteBuffer wrap = ByteBuffer.wrap(buf);
						wrap.putShort(shortVal);
						wrap.putShort(blockNumber);
						wrap.put(filecontent, len, (filecontent.length - len));
						len = Integer.MAX_VALUE; // Terminates loop.
						result = send_DATA_receive_ACK(sendSocket, buf);
					}
				}
			}
		}
		else if (opcode == OP_WRQ) 
		{
			// Create new file that should be written to..
			Path path = Paths.get(requestedFile.split("\u0000")[0]);
			try {
				Files.deleteIfExists(path);
				path = Files.createFile(path);
				byte[] buf = new byte[BUFSIZE-4];
				
				// Start with sending ack to let client know we are ready to recieve.
				send_ACK_Zero(sendSocket);
				
				while (receive_DATA_send_ACK(sendSocket, buf) == true) {
					Files.write(path, buf, StandardOpenOption.APPEND);
				}
				
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
		else 
		{
			System.err.println("Invalid request. Sending an error packet.");
			// See "TFTP Formats" in TFTP specification for the ERROR packet contents
//			send_ERR(params);
			return;
		}		
	}
	
	/**
	*	TODO: CLEAN
	*/
	private boolean send_DATA_receive_ACK(DatagramSocket sendSocket, byte[] buf)
	{
		ByteBuffer unWrap = ByteBuffer.wrap(buf);
		short sentOpcode = unWrap.getShort();
		short sentBlocknr = unWrap.getShort();
		
		DatagramPacket p = new DatagramPacket(buf, buf.length);
		try {
			sendSocket.send(p);
			sendSocket.setSoTimeout(1000);
			
			while (true) {
				try {
					sendSocket.receive(p);
					
					byte[] data = p.getData();
					
					ByteBuffer wrap= ByteBuffer.wrap(data);
					short opcode = wrap.getShort();
					short blocknr = wrap.getShort();

					if (opcode == OP_ACK && blocknr == sentBlocknr) {
						return true;
					}
					
				} catch (SocketTimeoutException e) {
					// Send packet again if timeout..
					sendSocket.send(p);
				}
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return false;
	}
	
	private boolean receive_DATA_send_ACK(DatagramSocket recieveSocket, byte[] buf) {
		
		byte[] newBUFFER = new byte[BUFSIZE];
		DatagramPacket data = new DatagramPacket(newBUFFER, newBUFFER.length);
		
		try {
			recieveSocket.receive(data);
			
			byte[] datacontent = data.getData();
			ByteBuffer unWrap = ByteBuffer.wrap(datacontent);
			short recvOpcode = unWrap.getShort();
			short recvBlocknr = unWrap.getShort();
			
			// Put recieved bytes into the buffer.
			for (int i = 0, x = 4; i < (BUFSIZE-4); i++, x++) {
				buf[i] = datacontent[x];
			}
			
			
			// Send acknowledges
			byte[] ackbuf = new byte[4];
			ByteBuffer wrap = ByteBuffer.wrap(ackbuf);
			wrap.putShort((short)OP_ACK);
			wrap.putShort(recvBlocknr);
			DatagramPacket ack = new DatagramPacket(ackbuf, ackbuf.length);
			recieveSocket.send(ack);
			
			// If less than 512 was recieved its done recieveing..
			if(datacontent.length < 512) {
				System.out.println("low data false : " + datacontent.length);
				return false;
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		
		return true;
	}
	
	void send_ACK_Zero(DatagramSocket recieveSocket) {
		byte[] ackbuf = new byte[4];
		ByteBuffer wrap = ByteBuffer.wrap(ackbuf);
		wrap.putShort((short)OP_ACK);
		wrap.putShort((short) 0);
		
		DatagramPacket ack = new DatagramPacket(ackbuf, ackbuf.length);
		try {
			recieveSocket.send(ack);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
//	private void send_ERR(params)
//	{}
//	
}



