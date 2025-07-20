import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, LangService } from '@shared';
import { finalize } from 'rxjs';

let totalRequests = 0;
let completedRequests = 0;

const excludedEndpoints = ['assets/i18n/', 'auth/login'];

const shouldExcludeRequest = (request: HttpRequest<unknown>) => {
  return excludedEndpoints.some((segment) => request.url.includes(segment));
};

export const HttpRequestInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = inject(AuthService).accessToken;
  const currentLang = inject(LangService).currentLanguage;
  const startTime = Date.now();

  totalRequests++;

  if (shouldExcludeRequest(request)) {
    return next(request);
  }

  const headers: { [key: string]: string | string[] } = {
    Accept: 'application/json',
    'X-localization': currentLang(),
    Authorization: `Bearer ${token()}`,
  };

  if (!(request.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  request = request.clone({ setHeaders: headers });

  return next(request).pipe(
    finalize(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      completedRequests++;
      console.log(
        `${completedRequests} of ${totalRequests} ${request.url} - (${duration}ms)`
      );
      if (completedRequests === totalRequests) {
        completedRequests = 0;
        totalRequests = 0;
      }
    })
  );
};
