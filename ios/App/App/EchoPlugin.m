//
//  EchoPlugin.m
//  App
//
//  Created by Alcibiade on 06/10/23.
//

#import <Capacitor/Capacitor.h>

CAP_PLUGIN(EchoPlugin, "Echo",
    CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
)
