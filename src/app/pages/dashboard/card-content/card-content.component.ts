import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CardModule, RouterLink],
  templateUrl: './card-content.component.html',
  styleUrl: './card-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardContentComponent {
  title = input<string>('');
  value = input<number>(0);
  icon = input<string>('');
  url = input<string>('');
}
