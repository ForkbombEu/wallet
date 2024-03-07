package eu.forkbomb.didroom;

import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Pair;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.nio.ByteBuffer;
import java.security.KeyStore;
import java.util.Base64;
import java.util.Collections;
import java.util.Enumeration;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

@CapacitorPlugin(name = "TEE")
public class TEE extends Plugin {
    private final static String ALIAS = "DID";
    private static final String CIPHER = "AES/GCM/NoPadding";
    private static final int TAG_LENGTH_BIT = 128;
    private static final int IV_LENGTH_BYTE = 12;
    private static final int AES_KEY_BIT = 256;
    private static final String ENCODING = "UTF-8";

    private static Pair encrypt(byte[] pText, SecretKey secret) throws Exception {
        Cipher cipher = Cipher.getInstance(CIPHER);
        cipher.init(Cipher.ENCRYPT_MODE, secret);
        byte[] iv = cipher.getIV();
        return new Pair(cipher.doFinal(pText), iv);
    }
    // prefix IV length + IV bytes to cipher text
    public static byte[] encryptWithPrefixIV(byte[] pText, SecretKey secret) throws Exception {
        Pair p = encrypt(pText, secret);
        byte[] cipherText = (byte[])p.first;
        byte[] iv = (byte[])p.second;

        return ByteBuffer.allocate(iv.length + cipherText.length)
                .put(iv)
                .put(cipherText)
                .array();

    }

    private static byte[] decrypt(byte[] cText, SecretKey secret, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance(CIPHER);
        // TODO: remove hardcoded tag length
        cipher.init(Cipher.DECRYPT_MODE, secret, new GCMParameterSpec(128, iv));
        return cipher.doFinal(cText);
    }
    public static byte[] decryptWithPrefixIV(byte[] cText, SecretKey secret) throws Exception {

        ByteBuffer bb = ByteBuffer.wrap(cText);

        byte[] iv = new byte[IV_LENGTH_BYTE];
        bb.get(iv);
        //bb.get(iv, 0, iv.length);

        byte[] cipherText = new byte[bb.remaining()];
        bb.get(cipherText);

        return decrypt(cipherText, secret, iv);
    }


    @PluginMethod()
    public void generateKey(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("success", true);


        KeyGenerator kg = null;
        try {
            // Build.VERSION_CODES.M required for keystore
            // Build.VERSION_CODES.O required for base64
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                throw new OldAndroidVersionException();
            }

            // On the emulator AES was not found KeyProperties.KEY_ALGORITHM_EC
            kg = KeyGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");

            kg.init(new KeyGenParameterSpec.Builder(
                    ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .build());
            kg.generateKey();

            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);
            byte[] encoded = Base64.getEncoder().encode(keyStore.getKey(ALIAS, null).getEncoded());

            ret.put("result", new String(encoded));
        } catch (Exception e) {
            ret.put("success", false);
            ret.put("error", e.getMessage());
        }
        call.resolve(ret);
    }

    @PluginMethod()
    public void listAliases(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("success", true);
        try {
            KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
            ks.load(null);
            Enumeration<String> aliases = ks.aliases();
            ret.put("result", new JSArray(Collections.list(aliases).toArray()));
        } catch(Exception e) {
            ret.put("success", false);
            ret.put("error", e.getMessage());
        }
        call.resolve(ret);
    }

    @PluginMethod()
    public void doEncrypt(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("success", true);
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                throw new OldAndroidVersionException();
            }
            byte[] msg = call.getString("msg").getBytes(ENCODING);

            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);
            SecretKey sk = (SecretKey) keyStore.getKey(ALIAS, null);

            byte[] encr = encryptWithPrefixIV(msg, sk);
            byte[] encoded = Base64.getEncoder().encode(encr);

            ret.put("result", new String(encoded));
        } catch(Exception e) {
            ret.put("success", false);
            ret.put("error", e.getMessage());
        }

        call.resolve(ret);
    }

    @PluginMethod()
    public void doDecrypt(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("success", true);
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                throw new OldAndroidVersionException();
            }
            byte[] msg = Base64.getDecoder().decode(call.getString("msg"));

            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);
            SecretKey sk = (SecretKey) keyStore.getKey(ALIAS, null);

            byte[] decr = decryptWithPrefixIV(msg, sk);

            ret.put("result", new String(decr, ENCODING));
        } catch(Exception e) {
            ret.put("success", false);
            ret.put("error", e.getMessage());
        }

        call.resolve(ret);
    }
}
