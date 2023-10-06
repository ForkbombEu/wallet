//
//  EchoPlugin.swift
//  App
//
//  Created by Alcibiade on 06/10/23.
//

import Capacitor

@objc(EchoPlugin)
public class EchoPlugin: CAPPlugin {
    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve(["value": value])
    }
}
