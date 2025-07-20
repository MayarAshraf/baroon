import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { addDays, addHours, addMinutes, addWeeks, format } from 'date-fns';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { TabMenuModule } from 'primeng/tabmenu';
import { TooltipModule } from 'primeng/tooltip';
import { distinctUntilChanged, tap } from 'rxjs';
@Component({
  selector: 'formly-data-picker-field',
  templateUrl: './date-picker.component.html',
  standalone: true,
  styleUrls: ['./date-picker.component.scss'],
  imports: [
    NgClass,
    TooltipModule,
    FormlyModule,
    CalendarModule,
    TabMenuModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent extends FieldType<FieldTypeConfig> {
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  @ViewChild('datePicker') datePicker!: Calendar;
  forceDisplay = signal<boolean>(false);

  presetItems = [
    {
      label: 'Set Date On Calendar',
      icon: 'pi pi-calendar',
      command: () => {
        this.forceDisplay.set(true);
        setTimeout(() => {
          // this.datePicker.inputfieldViewChild?.nativeElement.click();
          this.datePicker.inputfieldViewChild?.nativeElement.dispatchEvent(
            new Event('click')
          );
        }, 0);
      },
    },
    {
      label: 'After 15 minutes',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(15);
      },
    },
    {
      label: 'After 30 minutes',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(30);
      },
    },
    {
      label: 'After 1 hour',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(1, 'hour');
      },
    },
    {
      label: 'After 2 hours',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(2, 'hour');
      },
    },
    {
      label: 'After 3 hours',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(3, 'hour');
      },
    },
    {
      label: 'Tomorrow',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(1, 'day');
      },
    },
    {
      label: 'Day After Tom.',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(2, 'day');
      },
    },
    {
      label: 'After 1 Week',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(1, 'week');
      },
    },
    {
      label: 'After 2 Weeks',
      command: () => {
        this.forceDisplay.set(false);
        this.addToNow(2, 'week');
      },
    },
  ];

  ngOnInit() {
    this.forceDisplay.set(!this.props.withPresets);

    if (this.formControl?.value && this.field.model.id) {
      // check if field has a value (if it was edit mode)
      const value = this.formControl.value; // "Oct 25, 2023" or "Oct 25, 2023 | 02:03 PM"
      const dateKey = this.field.key;

      const formatString = this.props.showTime
        ? 'yyyy-MM-dd HH:mm'
        : 'yyyy-MM-dd';

      const formattedDate = format(new Date(value), formatString);
      this.formControl?.setValue(new Date(formattedDate));
      this.field.model[dateKey as string] = formattedDate;
    }

    this.formControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap((value) => {
          const dateKey = this.field.key;
          let formattedDate;

          if (Array.isArray(value) && value.length === 2) {
            // Handle the date range array
            const [startDate, endDate] = value;
            const formatString = this.props.showTime
              ? 'yyyy-MM-dd HH:mm'
              : 'yyyy-MM-dd';
            const formattedStartDate = format(
              new Date(startDate),
              formatString
            );
            const formattedEndDate = format(new Date(endDate), formatString);
            formattedDate = `${formattedStartDate} / ${formattedEndDate}`;
          } else {
            // Handle single date value
            formattedDate = this.props.showTime
              ? format(new Date(value), 'yyyy-MM-dd HH:mm')
              : format(new Date(value), 'yyyy-MM-dd');
          }

          this.field.model[dateKey as string] = formattedDate;
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  addToNow(amount: number, unit = 'minute') {
    const currentDate = new Date();
    let presetDate: Date;

    switch (unit) {
      case 'minute':
        presetDate = addMinutes(currentDate, amount);
        break;
      case 'hour':
        presetDate = addHours(currentDate, amount);
        break;
      case 'day':
        presetDate = addDays(currentDate, amount);
        break;
      case 'week':
        presetDate = addWeeks(currentDate, amount);
        break;
      default:
        presetDate = currentDate;
        break;
    }

    this.formControl?.setValue(presetDate);
  }
}
