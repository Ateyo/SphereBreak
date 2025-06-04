# SphereBreak

This project is an [Ionic Angular](https://ionicframework.com/docs/angular/overview) application.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Ionic CLI](https://ionicframework.com/docs/cli)  
  Install globally if not already:
  ```sh
  npm install -g @ionic/cli
  ```

## Install dependencies

```sh
npm install
```

## Start the app in development

```sh
ionic serve
```

- Opens the app in your browser with live reload.

## Build the app

### For web (production)

```sh
ionic build --prod
```

- Output in the `www/` directory.

### For Android

```sh
ionic capacitor build android
```

### For iOS

```sh
ionic capacitor build ios
```

## Run on device/emulator

- Add the platform (if not already added):
  ```sh
  ionic capacitor add android
  ionic capacitor add ios
  ```
- Then run:
  ```sh
  ionic capacitor run android
  ionic capacitor run ios
  ```

## Other useful commands

- Lint code:
  ```sh
  npm run lint
  ```
- Run unit tests:
  ```sh
  npm test
  ```
- Open Capacitor project in IDE:
  ```sh
  npx cap open android
  npx cap open ios
  ```

## Resources

- [Ionic Angular Docs](https://ionicframework.com/docs/angular/overview)
- [Capacitor Docs](https://capacitorjs.com/docs)
