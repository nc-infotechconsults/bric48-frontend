import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const appConfig = inject(AppConfigService);

  if (appConfig.getAccessToken()) {
    const clonedreq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + appConfig.getAccessToken().token
      )
    });
    return next(clonedreq);
  } else {
    return next(req);
  }
};
