import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

// import "hammerjs";

console.log("right-viewer android");
// console.log("-- main.ts environment = ", environment);

// if (environment.production) {
enableProdMode();
// }

// Cordova specific code for init
document.addEventListener(
  "deviceready",
  () => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err: any) => {
        console.error(err);
      });
  },
  false
);
