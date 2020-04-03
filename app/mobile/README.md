# How to Build & Run the App

Right now, the documentation is focused on building and running the app on a Mac. However, most steps should be adaptable to Windows quite easily. Building the app for iOS works only on Mac, though.

In the following, we list the needed steps in shortened form from the official [React Native documentation](https://reactnative.dev/docs/environment-setup); if something does not work, have a look there.

## Setup Mac

If you have the tool already installed, skip the respective step.

1. Install node & watchman
   
   ```bash
    brew install node@12
    brew install watchman

    # if needed, install brew (https://brew.sh/):
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
   ```

1. Install cocoapods (iOS only)
   
   ```bash
   sudo gem install cocoapods

   # if needed, install ruby
   brew install ruby
   ```

1. Install yarn

   ```bash
   brew install yarn
   ```

1. Install Java (> v8)
   
   ```bash
   brew tap AdoptOpenJDK/openjdk
   brew cask install adoptopenjdk8
   ```

1. Setup Android environment

   1. Install Android Studio & SDK: [Instructions](https://developer.android.com/studio/index.html)
   1. Configure the required environment variables, by adding following lines to your `$HOME/.bash_profile` or `$HOME/.bashrc` config file:

    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```

    In your current terminal, source the respective file to apply the changes: `source $HOME/.bash_profile`

## Build and Run The App

1. Clone the repo: `git clone https://github.com/cotect/cotect`
1. Install libraries

    ```bash
    cd cotect/app/mobile

    # install the node modules
    yarn install
    cd ios/
    # install step for iOS
    pod install
    cd ../
    ```
   > Note: If you get `gyp: No Xcide or CLI version detected!` error, run: 
   ```bash
    sudo rm -rf $(xcode-select -print-path)
    xcode-select --install
    sudo xcode-select --switch /Applications/Xcode.app
   ```

1. Add configuration files. The respective services have to exist if you want to have Cotect running. Get in touch with the administrator of an existing project using this code to get the information or set up the services for a fresh project.
   1. Add `.env` file to `app/mobile`:
        ```bash
        COTECT_BACKEND_URL=https://...
        ```

        > This is the URL where the Cotect backend can be reached. You find the code for it also in this repository.

    1. Add Firebase configuration. We use the services *Phone Authentication* and *Crashlytics* from Firebase. You can configure a Firebase project [here](https://console.firebase.google.com/).
        1. Android: Download the `google-service.json` and add it to `android/app`
        2. iOS:  Download the `GoogleService-Info.plist` and add it to `ios/`
    2. Add Google Places configuration. We use Google Places for picking locations within the application. No automatic tracking of the user should happen. You can find the Google Places docs [here](https://developers.google.com/places/web-service/intro).
       1. Android: before building / running the Android version,  execute this in your terminal: `export RNGP_ANDROID_API_KEY=YOUR KEY`
       2. iOS: 
          1. create a file `ios/GooglePlaces-Info.plist`
            ```xml
            <?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
            <plist version="1.0">
            <dict>
                <key>GMS_PLACES_API_KEY</key>
                <string>YOUR KEY</string>
            </dict>
            </plist>
            ```
            1. [only once] In Xcode, right click on the project > click on "Add file..." > select `GooglePlaces-Info.plist (make sure "Copy files if needed" is selected)` (make sure "Copy files if needed" is selected)
1. Run iOS version (make sure Xcode is installed; there you can also install an emulator): `npx react-native run-ios`
1. Run Android version: `npx react-native run-android`

### Build a Release Version

> Important: Don't use the debug certificates / keys you find in this repo for releasing your app. Rather, generate release keys and build the app with them!

1. Android: `cd android && ./gradlew app:assembleRelease`
1. iOS: Use XCode, select the right provisioning profile, and then build the app with. Follow standard iOS release practices from there (e.g. creating an .ipa file manually or an archive from XCode)

### Add new Fonts

1. Add a font to the assets folder
1. Run `react-native link`
1. Restart the application (`npx react-native run-*`)

> Note: iOS uses the PostScript name (see this [Medium post](https://medium.com/@mehran.khan/ultimate-guide-to-use-custom-fonts-in-react-native-77fcdf859cf4)), so for example instead of 'roboto-300' it is 'roboto-light'. Add the font to FontBook and click on information to see the PostScript font name.


## Troubleshooting

When running the app and (weird) errors occur, do the following to recompile everything:

```bash
watchman watch-del-all
rm -rf node_modules && yarn install
npx react-native run-*
```
