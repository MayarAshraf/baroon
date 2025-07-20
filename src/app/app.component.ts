import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoadingBarModule,
    ToastModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  #primengConfig = inject(PrimeNGConfig);

  ngOnInit() {
    this.#primengConfig.ripple = true;
  }
}
