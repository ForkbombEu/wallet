package com.didroom.wallet;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;


public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TEE.class);
        super.onCreate(savedInstanceState);
    }
}
