import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '@shared';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, BreadcrumbComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ContentLayoutComponent { }
