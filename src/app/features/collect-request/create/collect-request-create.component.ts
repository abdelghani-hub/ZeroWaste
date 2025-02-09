import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import WasteType from "../../../core/enums/WasteType";
import {CollectRequestState} from "../../../store/collect-request/collect-request.reducer";
import {NotificationUtil} from "../../../core/utils/NotificationUtil";
import CollectRequestStatus from "../../../core/enums/CollectRequestStatus";
import {CollectRequest, CollectRequestDetail} from "../../../core/models/collectRequest.model";
import {createRequest} from "../../../store/collect-request/collect-request.actions";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ProfileComponent} from "../../settings/profile/profile.component";

@Component({
  selector: 'app-collect-request-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './collect-request-create.component.html'
})
export class CollectRequestCreateComponent implements OnInit, OnDestroy {
  requestForm: FormGroup;
  wasteTypes = Object.values(WasteType);
  timeSlots = this.generateTimeSlots();
  serverErrors: { [key: string]: string[] } = {};
  private storeSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ collectRequest: CollectRequestState }>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { parent: ProfileComponent }
  ) {
    this.requestForm = this.fb.group({
      types: this.fb.array([], [Validators.required, Validators.maxLength(4)]),
      address: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      note: [''],
      photos: [[]]
    });

    this.storeSub = this.store.select(state => state.collectRequest).subscribe(
      state => {
        if (state.error) {
          this.serverErrors = {error: [state.error.toString()]};
          NotificationUtil.error(state.error.toString());
        }
      }
    );
  }

  ngOnInit() {
    this.addType();
  }

  ngOnDestroy() {
    this.storeSub?.unsubscribe();
  }

  get typesFormArray() {
    return this.requestForm.get('types') as FormArray;
  }

  get totalWeight(): number {
    return this.typesFormArray.controls
      .reduce((sum, control) => sum + (control.get('weight')?.value || 0), 0);
  }

  addType() {
    if (this.canAddMoreTypes()) {
      const typeForm = this.fb.group({
        type: [null, Validators.required],
        weight: [null, [Validators.required, Validators.min(0)]]
      });
      this.typesFormArray.push(typeForm);
    }
  }

  removeType(index: number) {
    this.typesFormArray.removeAt(index);
  }

  canAddMoreTypes(): boolean {
    return this.typesFormArray.length < 4;
  }

  isWeightValid(): boolean {
    return this.totalWeight >= 1000 && this.totalWeight <= 10000;
  }

  generateTimeSlots(): string[] {
    return Array.from({length: 9}, (_, i) => {
      const hour = i + 9;
      return `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
    });
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.requestForm.patchValue({
        photos: Array.from(files)
      });
    }
  }

  onSubmit() {
    this.serverErrors = {};
    let scheduleDate = this.calcScheduledDate();
    if (scheduleDate < new Date()) {
      NotificationUtil.error('Please select a future date');
      return;
    }

    function removeDuplicate(types: CollectRequestDetail[]): CollectRequestDetail[] {
      return types.filter((value, index, self) => self.indexOf(value) === index);
    }

    if (this.requestForm.valid && this.isWeightValid()) {
      const formValue = this.requestForm.value;

      const request: Partial<CollectRequest> = {
        types: removeDuplicate(formValue.types),
        address: formValue.address,
        scheduledDate: scheduleDate,
        note: formValue.note,
        status: CollectRequestStatus.PENDING,
        photos: formValue.photos,
        totalWeight: this.totalWeight
      };

      this.store.dispatch(createRequest({request}));
      this.router.navigate(['/profile']).then(() => {
          NotificationUtil.success('Request created successfully');
          this.data.parent.closeDialog();
        });
    } else {
      NotificationUtil.error('Please check form data');
    }
  }

  calcScheduledDate(): Date {
    const scheduledDate = new Date(this.requestForm.get('scheduledDate')?.value);
    const timeSlot = this.requestForm.get('timeSlot')?.value;
    const [startHour] = timeSlot.split(' - ').map((time: string) => parseInt(time.split(':')[0]));

    scheduledDate.setHours(startHour, 0, 0, 0);
    return scheduledDate;
  }
}
