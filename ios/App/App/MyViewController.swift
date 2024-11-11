//
//  MyViewController.swift
//  Didroom
//
//  Created by Alcibiade on 11/11/24.
//

import UIKit
import Capacitor

class MyViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(TEEPlugin())
    }
}
