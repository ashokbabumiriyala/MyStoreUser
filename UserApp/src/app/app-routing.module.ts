import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./Shared/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./Shared/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./Shared/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'category-search',
    loadChildren: () => import('./category-search/category-search.module').then( m => m.CategorySearchPageModule)
  },
  {
    path: 'service-info',
    loadChildren: () => import('./service-info/service-info.module').then( m => m.ServiceInfoPageModule)
  },
  {
    path: 'product-info',
    loadChildren: () => import('./product-info/product-info.module').then( m => m.ProductInfoPageModule)
  },
  {
    path: 'service-list',
    loadChildren: () => import('./service-list/service-list.module').then( m => m.ServiceListPageModule)
  },
  {
    path: 'product-list',
    loadChildren: () => import('./product-list/product-list.module').then( m => m.ProductListPageModule)
  },  {
    path: 'maps',
    loadChildren: () => import('./Shared/maps/maps.module').then( m => m.MapsPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./Shared/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
