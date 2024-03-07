## Download the latest test release

![qr (1)](https://github.com/ForkbombEu/wallet/assets/10379/5bf716ee-f74e-48fd-a1d6-0911f00d99d3)

### Notes

**Path bug**

If you get an error like:

```
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in your project's local properties file at '/Users/<HOME_NAME>/Documents/GitHub/wallet/android/local.properties'.
```

duplicate `android/local.properties.example` as `android/local.properties` and set correct path


## Run in web browser

Use node 20 and npm.

Update all submodules.
```
git submodule update --init --recursive
```

Copy configuration in place
```
cp .env.example .env
```

Install the node submodules
```
npm i
```

Install ionic cli
```
npm i @ionic/cli
```

Import packages for native platforms (not needed in all cases):
```
./node_modules/.bin/ionic cap sync
```

To launch in browser: 
```
./node_modules/.bin/ionic serve
```

To open in Android Studio
```
./node_modules/.bin/ionic cap open android
```

