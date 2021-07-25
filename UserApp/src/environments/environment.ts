// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //localhost
  // authenticationServiceUrl: 'https://localhost:44337/api/UserAuthentication/',
  // storeMasterServiceUrl: 'https://localhost:44337/api/Store/',
  // userOperationServiceUrl: 'https://localhost:44337/api/UserAppOperation/',
  // serviceMasterServiceUrl: 'https://localhost:44337/api/Service/',
  // adminServiceUrl: 'https://localhost:44337/api/Admin/',

  // test
  // authenticationServiceUrl:
  //   'https://my3apitest.itprototypes.com/api/UserAuthentication/',
  // storeMasterServiceUrl: 'https://my3apitest.itprototypes.com/api/Store/',
  // serviceMasterServiceUrl: 'https://my3apitest.itprototypes.com/api/Service/',
  // adminServiceUrl: 'https://my3apitest.itprototypes.com/api/Admin/',
  // userOperationServiceUrl:
  //   'https://my3apitest.itprototypes.com/api/UserAppOperation/',
  // pushTokenServiceUrl: 'https://my3apitest.itprototypes.com/api/PushToken/',

  authenticationServiceUrl:
    'https://my3api.itprototypes.com/api/UserAuthentication/',
  storeMasterServiceUrl: 'https://my3api.itprototypes.com/api/Store/',
  serviceMasterServiceUrl: 'https://my3api.itprototypes.com/api/Service/',
  adminServiceUrl: 'https://my3api.itprototypes.com/api/Admin/',
  userOperationServiceUrl:
    'https://my3api.itprototypes.com/api/UserAppOperation/',
  pushTokenServiceUrl: 'https://my3api.itprototypes.com/api/PushToken/',

  // authenticationServiceUrl: 'https://localhost:5001/api/UserAuthentication/',
  // storeMasterServiceUrl: 'https://localhost:5001/api/Store/',
  // userOperationServiceUrl: 'https://localhost:5001/api/UserAppOperation/',
  // serviceMasterServiceUrl: 'https://localhost:5001/api/Service/',
  // adminServiceUrl: 'https://localhost:5001/api/Admin/',
  // pushTokenServiceUrl: 'https://localhost:5001/api/PushToken/',
  razorPaymentkey: 'rzp_live_BCrYXIrnh8hw2v',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
