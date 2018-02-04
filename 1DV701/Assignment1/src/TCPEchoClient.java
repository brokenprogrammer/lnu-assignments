import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

/**
 * TCPEchoClient extending the EchoClient that connects to remote using a 
 * TCP connection through specified arguments in the form of:
 * 	[IP] [PORT] [BUFFER LENGTH] [TRANSFER RATE]
 * 
 * Where transfer rate is the number of messages per second.
 * 
 * @author Oskar
 * @version 00.00.00
 * @name UDPEchoClient.java
 */
public class TCPEchoClient extends EchoClient {
	
	public static final String MSG= "An Echo Message!";
	Socket socket;
	DataInputStream inputStream;
	DataOutputStream outputStream;
	
	public TCPEchoClient(String[] args) {
		super(args);
		
		try {
			// Initialize socket and bind it to local point then connect to remote.
			this.socket = new Socket();
			this.socket.bind(localBindPoint);
			this.socket.connect(remoteBindPoint);
			
			// Initialize input and output streams.
			this.inputStream = new DataInputStream(this.socket.getInputStream());
			this.outputStream = new DataOutputStream(this.socket.getOutputStream());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		// Run echoing to the server for 1 second.
		runSecond(new Thread(this));
		
		try {
			this.socket.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
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
	protected void performSendAndRecieve() {
		try {
			System.out.println("BUFFSIZE: " + this.bufferSize);
			// Send the message to the output stream.
			outputStream.write(MSG.getBytes());

			String receivedString = "";
			
			// Proceed to read bytes from the input stream until expected number 
			// or more bytes was read.
			while (receivedString.length() < MSG.length()) {
				this.buffer = new byte[this.bufferSize];
				int numberBytes = inputStream.read(this.buffer);
				receivedString += new String(this.buffer, 0, numberBytes);
			}
			
			// Compare sent and recieved message.
			if (receivedString.trim().compareTo(MSG) == 0) {
			    System.out.printf("%d bytes sent and received\n", receivedString.trim().length());
			} else {
			    System.out.printf("Sent and received msg not equal!\n");
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
