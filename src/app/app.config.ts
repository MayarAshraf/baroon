import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QuillConfigModule } from 'ngx-quill';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { routes } from './app.routes';
import {
  constants,
  customFormlyConfig,
  CustomPageTitleProvider,
  HttpRequestInterceptor,
  HttpResponseInterceptor,
  LangService,
  RefreshTokenInterceptor,
} from './shared';

export function initializeLangFactory(langService: LangService) {
  const lang = langService.currentLanguage() || constants.DEFAULT_LANGUAGE;
  return () => langService.switchLanguage(lang);
}

// AoT requires an exported loader function for factories.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    MessageService,
    DynamicDialogConfig,
    DynamicDialogRef,
    DialogService,
    ConfirmationService,
    CustomPageTitleProvider,
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: 'ignore', // "ignore" (The default), "reload"
        paramsInheritanceStrategy: 'always', // 'always' (The default), 'emptyOnly'
      }),
      withInMemoryScrolling({
        // Enable scrolling to anchors
        anchorScrolling: 'enabled',
        // Configures if the scroll position needs to be restored when navigating back.
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        RefreshTokenInterceptor,
        HttpResponseInterceptor,
        HttpRequestInterceptor,
      ])
    ),
    importProvidersFrom(
      LoadingBarHttpClientModule,
      FormlyPrimeNGModule,
      QuillConfigModule.forRoot({}),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: FORMLY_CONFIG,
      useFactory: customFormlyConfig,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLangFactory,
      deps: [LangService],
      multi: true,
    },
  ],
};
