/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"G9hDIrjjAWUaRqvBwEpXxmUls8zYKM70"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"tfV8s02WZEqv3qDhZUSHolwMu0ToO2fl"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"n7MsybAWCWZApQv1MKLVKTwAK6X65aPs"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"9uGJIEhrwBBK0BK3Tkd6KpxRyVYq4ldZ"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"pEn5tvLeSD8v1QaC3UAW74tXKE2KiNJI"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"LGw5sY0z72d1Qlced8dN2N8K3zKAcwo9"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
