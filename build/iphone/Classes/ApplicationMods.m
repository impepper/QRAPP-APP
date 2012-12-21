#import "ApplicationMods.h"

@implementation ApplicationMods

+ (NSArray*) compiledMods
{
	NSMutableArray *modules = [NSMutableArray array];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"ti.cloud",@"name",@"ti.cloud",@"moduleid",@"2.3.0",@"version",@"1056b5d2-2bb5-4339-b930-297637aeec4e",@"guid",@"",@"licensekey",nil]];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"acktie mobile qr ios",@"name",@"com.acktie.mobile.ios.qr",@"moduleid",@"1.7",@"version",@"daf68a87-c5c5-44b0-84ef-6498e75cbc1e",@"guid",@"",@"licensekey",nil]];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"admob",@"name",@"ti.admob",@"moduleid",@"1.3",@"version",@"0d005e93-9980-4739-9e41-fd1129c8ff32",@"guid",@"",@"licensekey",nil]];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"imagefactory",@"name",@"ti.imagefactory",@"moduleid",@"1.1",@"version",@"0aab25d7-0486-40ab-94a3-ed4f9a293414",@"guid",@"",@"licensekey",nil]];
	return modules;
}

@end
