package eu.forkbomb.didroom;

public class OldAndroidVersionException extends Exception {
    OldAndroidVersionException() {
        super("Android version less than minimum supported");
    }
}
