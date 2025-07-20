import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-all-settings',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './all-settings.component.html',
  styleUrl: './all-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AllSettingsComponent {}
