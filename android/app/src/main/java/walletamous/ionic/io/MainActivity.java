package walletamous.ionic.io;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;


public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(EchoPlugin.class);
        registerPlugin(TEE.class);
        super.onCreate(savedInstanceState);
    }
}