import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router"; // CLI imports router
import { LogInPageComponent } from "./components/pages/login-page/logIn-page.component";
import { MainPageComponent } from "./components/pages/main-page/main-page.component";
import { UserInfoPageComponent } from "./components/pages/userInfo-page/userInfo-page.component";

const routes: Routes = [
  { path: "", component: LogInPageComponent },
  { path: "main", component: MainPageComponent },
  { path: "user-info", component: UserInfoPageComponent },
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
