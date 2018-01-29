/*
  UDPEchoClient.java
  A simple echo client with no error handling
*/

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;

/**
 * UDPEchoClient extending the EchoClient that connects to remote using a 
 * UDP through specified arguments in the form of:
 * 	[IP] [PORT] [BUFFER LENGTH] [TRANSFER RATE]
 * 
 * Where transfer rate is the number of messages per second.
 * 
 * @author Oskar
 * @version 00.00.00
 * @name UDPEchoClient.java
 */
public class UDPEchoClient extends EchoClient {

    public static final String MSG= "An Echo Message!";
    DatagramSocket socket;
    DatagramPacket sendPacket;
    DatagramPacket receivePacket;
    
    public UDPEchoClient(String[] args) {
		super(args);
		
		// Initialize socket and bind it to local point.
		try {
			socket= new DatagramSocket(null);
			socket.bind(localBindPoint);
		} catch(SocketException e) {
			e.printStackTrace();
		}
		
		// Initialize send and receive packets.
		sendPacket = new DatagramPacket(MSG.getBytes(), MSG.length(), remoteBindPoint);
		receivePacket= new DatagramPacket(buffer, buffer.length);
		
		// Run echoing to the server for 1 second.
		runSecond(new Thread(this));
		
		socket.close();
	}

	@Override
	public void run() {
		// Send messages based on the transfer rate which is specified as messages per second.
		for (int messages = 0; messages < transferRate; messages++) {
			performSendAndRecieve();
			
			// Perform delay
			try {
				Thread.sleep(1000 / transferRate);
			} catch (InterruptedException e) {
				return;
			}
		}
	}
	
	/**
	 * Performs the sending and receiving of messages and then
	 * compares the verified received message with the sent one to verify
	 * that they are equal.
	 */
	@Override
	public void performSendAndRecieve() {
		try {
			// Send and receive message
			socket.send(sendPacket);
			socket.receive(receivePacket);
			
			//Compare sent and received packets.
			String receivedString = new String(receivePacket.getData(), receivePacket.getOffset(), receivePacket.getLength());
			
			if (receivedString.compareTo(MSG) == 0) {
			    System.out.printf("%d bytes sent and received\n", receivePacket.getLength());
			} else {
			    System.out.printf("Sent and received msg not equal!\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
}