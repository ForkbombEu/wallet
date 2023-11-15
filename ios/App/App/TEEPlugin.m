//
//  TEEPlugin.m
//  App
//
//  Created by Alcibiade on 23/10/23.
//


#import <Capacitor/Capacitor.h>

CAP_PLUGIN(TEEPlugin, "TEE",
    CAP_PLUGIN_METHOD(generateKey, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(doEncrypt, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(doDecrypt, CAPPluginReturnPromise);
)
