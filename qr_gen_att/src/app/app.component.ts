import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInWeeks, parseISO } from 'date-fns';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <form [formGroup]="form" (ngSubmit)="generateQRCode()">
        <mat-form-field>
          <mat-label>Select Class</mat-label>
          <mat-select formControlName="selectedOption">
            <mat-option *ngFor="let option of options" [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="selectedDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          Generate QR Code
        </button>
      </form>

      <div *ngIf="showQRCode">
        <qrcode
          [qrdata]="qrData"
          [width]="256"
          [errorCorrectionLevel]="'M'"
        ></qrcode>
      </div>
    </div>
  `,
  styles: [`
    div { padding: 20px; }
    form { display: flex; flex-direction: column; gap: 10px; max-width: 300px; }
    mat-form-field { width: 100%; }
  `]
})
export class AppComponent {
  form: FormGroup;
  qrData: string = '';
  showQRCode: boolean = false;

  options = [
    { value: 'data-science-monday', viewValue: 'Data Science - Monday - AARY' },
    { value: 'data-science-wednesday', viewValue: 'Data Science - Wednesday' },
    { value: 'data-science-thursday', viewValue: 'Data Science - Thursday - AARY' },
    { value: 'web-dev-tuesday-1st-class', viewValue: 'Web Dev Tuesday' },
    { value: 'web-dev-tuesday-2nd-class', viewValue: 'Web Dev Tuesday - AARY' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedOption: ['', Validators.required],
      selectedDate: ['', Validators.required]
    });
  }

  generateQRCode() {
    if (this.form.valid) {
      const formData = this.form.value;
      const selectedDate = formData.selectedDate;
      const selectedOption = formData.selectedOption;

      let baseDate;
      let baseSessionId;
      let classId;

      if (selectedOption === 'data-science-monday') {
        baseDate = parseISO('2024-10-28');
        baseSessionId = 164931;
        classId = 1970;
      } else if (selectedOption === 'data-science-wednesday') {
        baseDate = parseISO('2024-10-30');
        baseSessionId = 164909;
        classId = 1970;
      } else if (selectedOption === 'data-science-thursday') {
        baseDate = parseISO('2024-10-31');
        baseSessionId = 177015;
        classId = 1970;
      } else if (selectedOption === 'web-dev-tuesday-1st-class') {
        baseDate = parseISO('2024-09-24');
        baseSessionId = 176940;
        classId = 1984;
      } else if (selectedOption === 'web-dev-tuesday-2nd-class') {
        baseDate = parseISO('2024-10-29');
        baseSessionId = 165216;
        classId = 1984;
      } else {
        // Handle other options if needed
        return;
      }

      const weeksDifference = differenceInWeeks(selectedDate, baseDate);
      const sessionId = baseSessionId + weeksDifference;

      this.qrData = JSON.stringify({
        classId: classId,
        sessionId: sessionId
      });
      this.showQRCode = true;
    }
  }
}