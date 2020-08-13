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
    private boolean turn = true;

    public Server() {
        super(new InetSocketAddress(TCP_PORT));
        conns = new HashSet<>();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        conns.add(conn);
        System.out.println("New connection from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
        playerCount++;
        String connectionMsg = "";
        if (playerCount == 1) {
            player1 = new Player(conn, playerCount);
            player1.getWebSocket().send( "Player1 connected.");
            player1.getWebSocket().send("SYSTEM: You are Player1 (red pieces).");
        }
        if (playerCount == 2) {
            player2 = new Player(conn, playerCount);
            player1.getWebSocket().send( "Player2 connected.");
            player2.getWebSocket().send( "Player2 connected.");
            player2.getWebSocket().send("SYSTEM: You are Player2 (black pieces).");
        }
        if (playerCount == 2){
            for (WebSocket sock : conns) {
                sock.send("SYSTEM: The match has started!");
                sock.send("SYSTEM: Player1 goes first.");
            }
        }
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        conns.remove(conn);
        if (player1.getWebSocket() == conn || player2.getWebSocket() == conn) {
            for (WebSocket sock : conns) {
                sock.send("SYSTEM: A player has disconnected. The match has ended.");
            }
        }
        System.out.println("Closed connection to " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println(message);
        if (message.equals("_{}*getid")) {
            conn.send(getPlayerId(conn));

        } else if (message.equals("_{}*getturn")) {
            conn.send(whosTurn());
        } else if (message.contains("_{}*update")) {
            if (turn) {
                player2.getWebSocket().send(updateBoard(message));
            } else {
                player1.getWebSocket().send(updateBoard(message));
            }
            turn = !turn;
            if (turn) {
                player1.getWebSocket().send("SYSTEM: Player1's turn.");
                player2.getWebSocket().send("SYSTEM: Player1's turn.");
            }
            else{
                player1.getWebSocket().send("SYSTEM: Player2's turn.");
                player2.getWebSocket().send("SYSTEM: Player2's turn.");
            }
            player1.getWebSocket().send(whosTurn());
            player2.getWebSocket().send(whosTurn());
        } else if (message.contains("_{}*hopped1")) {
            player1.getWebSocket().send(message);
            player2.getWebSocket().send(message);
        } else if (message.contains("_{}*hopped2")) {
            player1.getWebSocket().send(message);
            player2.getWebSocket().send(message);
        } else if (message.contains("_{}*hpUpdt")) {
            if (turn) {
                player2.getWebSocket().send(updateBoard(message));
            } else {
                player1.getWebSocket().send(updateBoard(message));
            }
            player1.getWebSocket().send(whosTurn());
            player2.getWebSocket().send(whosTurn());
        } else if (message.contains("_{}*kings1")) {
            player2.getWebSocket().send(message);
            for (WebSocket sock : conns) {
                sock.send("SYSTEM: Player1 has crowned a king.");
            }
        } else if (message.contains("_{}*kings2")) {
            player1.getWebSocket().send(message);
            for (WebSocket sock : conns) {
                sock.send("SYSTEM: Player2 has crowned a king.");
            }
        }
        else if (message.equals("_{}*gameover1")){
            for (WebSocket sock : conns) {
                sock.send("SYSTEM: Player1 wins!");
            }
        }
        else if (message.equals("_{}*gameover2")){
            for (WebSocket sock : conns) {
                sock.send("SYSTEM: Player2 wins!");
            }
        }
        else {
            String sender = "";
            if (player1 != null && player1.getWebSocket() == conn) {
                sender = "Player1: ";
                System.out.println(sender + message);
            } else if (player2 != null && player2.getWebSocket() == conn) {
                sender = "Player2: ";
                System.out.println(sender + message);
            }
            for (WebSocket sock : conns) {
                sock.send(sender + message);
            }
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

    private String getPlayerId(WebSocket conn) {
        if (player1.getWebSocket() == conn) {
            return "_{}*id1";
        } else if (player2.getWebSocket() == conn) {
            return "_{}*id2";
        }
        return "";
    }

    private String whosTurn() {
        return (turn ? "_{}*turn1" : "_{}*turn2");
    }

    private String updateBoard(String str) {
        str = str.substring(11, str.length());
        String newStr = "_{}*update ";
        boolean prevIsNumber = false;
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == ',') {
                newStr += "_";
            } else if (str.charAt(i) != ',' && str.charAt(i + 1) != ',') {
                newStr += "" + str.charAt(i) + str.charAt(i + 1) + " ";
                i += 2;
            } else if (str.charAt(i) != ',') {
                newStr += str.charAt(i) + " ";
                i++;
            }
        }
        return newStr;
    }

    public static void main(String[] args) {
        Server server = new Server();
        server.start();
    }
}
