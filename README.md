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

First install pnpm and configure so that it uses node 20
```
npm i -g pnpm
```

Pin pnpm to node 20, but skip this step if using NVM
```
pnpm env use --global 20
pnpm add -g pnpm
```

Then setup submodules and .env
```
git submodule update --init --recursive
mv .env.example .env
```

install ionic cli with pnpm
```
pnpm i -g @ionic/cli
```

to import packages for native platforms (not needed in all cases):
```
ionic cap sync
```

Then install the node submodules
```
pnpm i
```
To launch in browser: 

```
pnpm web
```
