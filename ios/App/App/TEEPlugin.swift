//
//  TEEPlugin.swift
//  App
//
//  Created by Alcibiade on 23/10/23.
//

import Capacitor

@objc(TEEPlugin)
public class TEEPlugin: CAPPlugin {
    static let NAME = "ppp"
    static let BIOMETRY = false
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
}


