package com.forkbomb.wallet;

public class OldAndroidVersionException extends Exception {
    OldAndroidVersionException() {
        super("Android version less than minimum supported");
    }
}