package NetworkedCheckers;

import org.java_websocket.WebSocket;

public class Player {
    private WebSocket conn;
    private int id;

    public Player(WebSocket conn, int id){
        this.conn = conn;
        this.id = id;
    }

    public WebSocket getWebSocket(){
        return conn;
    }

    public int getId(){
        return id;
    }

}
