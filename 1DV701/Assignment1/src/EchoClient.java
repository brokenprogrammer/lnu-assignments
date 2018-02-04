import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

/**
 * Abstract class EchoClient extended by different clients. Allows the subclasses to use
 * themselves as a thread connecting to a ip and port.
 * 
 * @author Oskar
 * @version 00.00.00
 * @name EchoClient.java
 */
public abstract class EchoClient implements Runnable {
	// Regex pattern that matches an address format of "0-255.0-255.0.255.0.255".
	// This regex was borrowed from Stackoverflow.
	//	Link: https://stackoverflow.com/questions/5667371/validate-ipv4-address-in-java
	private static final Pattern PATTERN = Pattern.compile(
	        "^(([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([01]?\\d\\d?|2[0-4]\\d|25[0-5])$");
	
	protected String IP;						// IP address to connect to
	protected int port = 4950;					// Port to connect to
	protected int bufferSize = 1024;			// Buffer size, 1024 is standard.
	protected int transferRate;					// Messages per second.
	protected byte[] buffer;					// Buffer for holding incoming datagram.
	protected SocketAddress localBindPoint;		// Local endpoint
	protected SocketAddress remoteBindPoint;	// Remove endpoint
	protected final int MYPORT = 0;				// Let the system pick a port for me.
	
	public EchoClient(String[] args) {
		if (args.length != 4) {
			System.err.println("Incorrect number of arguments.");
			System.err.println("Specify arguments in form of: "
					+ "[IP] [PORT] [BUFFER LENGTH] [TRANSFER RATE]");
			System.exit(1);
		}
		
		verifyArguments(args);
		
		// Initialize Local and Remote endpoints.
		this.localBindPoint = new InetSocketAddress(MYPORT);
		this.remoteBindPoint = new InetSocketAddress(IP, port);
	}
	
	protected abstract void performSendAndRecieve();
	
	/**
	 * Helper method to verify arguments for the EchoClient. 
	 * Exits application with error message on invalid arguments.
	 */
	private void verifyArguments(String[] args) {
		
		if (!isValidIPAddress(args[0])) {
			System.err.println("Invalid IP Address.");
			System.exit(1);
		} else {
			this.IP = args[0];
		}
		
		if (!isValidPort(Integer.parseInt(args[1]))) {
			System.err.println("Invalid Port.");
			System.exit(1);
		} else {
			this.port = Integer.parseInt(args[1]);
		}
		
		if (!isValidBufferSize(Integer.parseInt(args[2]))) {
			System.err.println("Invalid buffer size.");
			System.exit(1);
		} else {
			this.bufferSize = Integer.parseInt(args[2]);
			this.buffer = new byte[bufferSize];
		}
		
		if (!isValidTransferRate(Integer.parseInt(args[3]))) {
			System.err.println("Invalid transfer rate.");
			System.exit(1);
		} else {
			this.transferRate = Integer.parseInt(args[3]);
			if (this.transferRate == 0) {
				this.transferRate = 1; // According to requirements value 0 must result in 1 message.
			}
		}
	}
	
	/**
	 * Validates an IP address in the form of a string and returns true
	 * if it is a valid IP address and false otherwise.
	 * 
	 * @param IP - IP address to validate.
	 * 
	 * @return True if valid; false otherwise.
	 */
	private boolean isValidIPAddress(String IP) {
		return PATTERN.matcher(IP).matches();
	}
	
	/**
	 * Validates the port and returns true if it a valid port.
	 * 
	 * @param port - Port to validate.
	 * 
	 * @return True if valid; false otherwise.
	 */
	private boolean isValidPort(int port) {
		return (port <= 65535 && port >= 1) ? true : false;
	}
	
	/**
	 * Validates the buffer size value and returns true if its a valid
	 * buffer size.
	 * 
	 * @param bufferSize - Buffer size value to validate.
	 * 
	 * @return True if valid; false otherwise.
	 */
	private boolean isValidBufferSize(int bufferSize) {
		return bufferSize > 0 ? true : false;
	}
	
	/**
	 * Validates the transfer rate and returns true if it is a valid
	 * transfer rate.
	 * 
	 * @param transferRate - Transfer rate to validate.
	 * 
	 * @return True if valid; false otherwise.
	 */
	private boolean isValidTransferRate(int transferRate) {
		return transferRate > 0 ? true : false;
	}
	
	/**
	 * Runs the specified Thread for one second. This is a helper
	 * method used for the EchoClients extending this class.
	 * 
	 * @param thread - EchoClient Thread to run for one second.
	 */
	protected void runSecond(Thread thread) {
		final int run = 1000;
		long time = 0;
		
		ExecutorService exec = Executors.newFixedThreadPool(1);
		exec.submit(thread);
		exec.shutdown();
		
		try {
			time = System.currentTimeMillis();
			exec.awaitTermination(run, TimeUnit.MILLISECONDS);
			time = System.currentTimeMillis() - time;
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		exec.shutdownNow();
	}
}
