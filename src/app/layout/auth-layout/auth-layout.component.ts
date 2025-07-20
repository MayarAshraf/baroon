import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
})
export default class AuthLayoutComponent {
  get getDate() {
    return new Date().getFullYear();
  }
}
