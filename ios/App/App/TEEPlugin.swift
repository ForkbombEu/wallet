//
//  TEEPlugin.swift
//  App
//
//  Created by Alcibiade on 23/10/23.
//

import Capacitor

enum TEEError: Error {
    case runtimeError(String)
}

@objc(TEEPlugin)
public class TEEPlugin: CAPPlugin {
    static let NAME = "ppp"
    static let BIOMETRY = false
    @objc func loadKey(name: String) -> SecKey? {
        let tag = name.data(using: .utf8)!
        let query: [String: Any] = [
            kSecClass as String                 : kSecClassKey,
            kSecAttrApplicationTag as String    : tag,
            kSecAttrKeyType as String           : kSecAttrKeyTypeEC,
            kSecReturnRef as String             : true
        ]
        
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status == errSecSuccess else {
            return nil
        }
        return (item as! SecKey)
    }
    @objc func generateKey(_ call: CAPPluginCall) {
        let flags: SecAccessControlCreateFlags
        if #available(iOS 11.3, *) {
            flags = TEEPlugin.BIOMETRY ?
            [.privateKeyUsage, .biometryCurrentSet] : .privateKeyUsage
        } else {
            flags = TEEPlugin.BIOMETRY ?
            [.privateKeyUsage, .touchIDCurrentSet] : .privateKeyUsage
        }
        let access =
        SecAccessControlCreateWithFlags(kCFAllocatorDefault,
                                        kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
                                        flags,
                                        nil)!
        let tag = TEEPlugin.NAME.data(using: .utf8)!
        let attributes: [String: Any] = [
            kSecAttrKeyType as String           : kSecAttrKeyTypeEC,
            kSecAttrKeySizeInBits as String     : 256,
            kSecAttrTokenID as String           : kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String : [
                kSecAttrIsPermanent as String       : true,
                kSecAttrApplicationTag as String    : tag,
                kSecAttrAccessControl as String     : access
            ]
        ]
        var error: Unmanaged<CFError>?
        do {
            guard let privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
                       throw error!.takeRetainedValue() as Error
            }
           
        }
        
        catch
        {
            call.resolve(["success":false, "errors": error.localizedDescription])
            return
        }
        call.resolve(["success":true, "message": ""])
        
        
        
        return
        
    }
    @objc func doEncrypt(_ call: CAPPluginCall) {
        do {
            
            guard let privateKey = self.loadKey(name: TEEPlugin.NAME) else {
                throw TEEError.runtimeError("Could not load private key")
            }
            guard let clearText = call.getString("msg") else {
                throw TEEError.runtimeError("Must pass msg")
            }
            guard let publicKey = SecKeyCopyPublicKey(privateKey) else {
                throw TEEError.runtimeError("Could not get public key")
                return
            }
            
            let algorithm: SecKeyAlgorithm = .eciesEncryptionCofactorVariableIVX963SHA256AESGCM
            guard SecKeyIsAlgorithmSupported(publicKey, .encrypt, algorithm) else {
                throw TEEError.runtimeError("Algorith not supported")
                return
            }
            var error: Unmanaged<CFError>?
            let clearTextData = clearText.data(using: .utf8)!
            var cipherTextData = SecKeyCreateEncryptedData(publicKey, algorithm,
                                                           clearTextData as CFData,
                                                           &error) as Data?
            guard cipherTextData != nil else {
                throw error!.takeRetainedValue() as Error
                return
            }
            let result = cipherTextData?.base64EncodedString()
            call.resolve(["success":true, "result": result])
        } catch {
            call.resolve(["success": false, "error": error.localizedDescription])
        }
        
        
    }
    @objc func doDecrypt(_ call: CAPPluginCall) {
        do {
            guard let privateKey = self.loadKey(name: TEEPlugin.NAME) else {
                throw TEEError.runtimeError("Could not load private key")
            }
            // cipherTextData is our encrypted data
            let algorithm: SecKeyAlgorithm = .eciesEncryptionCofactorVariableIVX963SHA256AESGCM
            guard SecKeyIsAlgorithmSupported(privateKey, .decrypt, algorithm) else {
                throw TEEError.runtimeError("Alghorthm not supported")
                return
            }
            
            guard let cipherText = call.getString("msg") else {
                throw TEEError.runtimeError("Must pass msg")
            }
            guard let cipherTextData = Data(base64Encoded: cipherText) else {
                throw TEEError.runtimeError("Couldn't convert from base64")
            }
            
            // SecKeyCreateDecryptedData call is blocking when the used key
            // is protected by biometry authentication. If that's not the case,
            // dispatching to a background thread isn't necessary.
            DispatchQueue.global().async {
                var error: Unmanaged<CFError>?
                let clearTextData = SecKeyCreateDecryptedData(privateKey,
                                                              algorithm,
                                                              cipherTextData as CFData,
                                                              &error) as Data?
                DispatchQueue.main.async {
                    guard clearTextData != nil else {
                        call.resolve(["success": false, "error": "Couldn't decrypt"])
                        return
                    }
                    let clearText = String(decoding: clearTextData!, as: UTF8.self)
                    call.resolve(["success":true, "result": clearText])
                }
            }
        }
        catch {
            call.resolve(["success": false, "error": error.localizedDescription])
        }
    }
}


