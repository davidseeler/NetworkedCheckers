package NetworkedCheckers;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.util.HashSet;
import java.util.Set;

public class Server extends WebSocketServer {

    private static int TCP_PORT = 4444;
    private Set<WebSocket> conns;
    private Player player1, player2;
    private int playerCount = 0;

    public Server() {
        super(new InetSocketAddress(TCP_PORT));
        conns = new HashSet<>();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        if (playerCount < 2) {
            conns.add(conn);
            System.out.println("New connection from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
            playerCount++;
            if (playerCount == 1) {
                player1 = new Player(conn, playerCount);
            }
            if (playerCount == 2) {
                player2 = new Player(conn, playerCount);
            }
        }
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        conns.remove(conn);
        System.out.println("Closed connection to " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        if (player1 != null && player1.getWebSocket() == conn) {
            System.out.println("Player1: " + message);
        }
        else if (player2 != null && player2.getWebSocket() == conn) {
            System.out.println("Player2: " + message);
        }
        for (WebSocket sock : conns) {
            sock.send(message);
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        //ex.printStackTrace();
        if (conn != null) {
            conns.remove(conn);
            // do some thing if required
        }
        System.out.println("ERROR from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    public static void main(String[] args) {
        Server server = new Server();
        server.start();
    }
}
