import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import CollectRequestStatus from '../../../core/enums/CollectRequestStatus';

interface StatusOption {
  value: string;
  label: string;
  color: string;
  darkModeColor: string;
}

@Component({
  selector: 'app-status-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-select.component.html',
})
export class StatusSelectComponent {
  @Input() currentStatus: string = CollectRequestStatus.PENDING;
  @Output() statusChange = new EventEmitter<string>();

  private readonly statusConfig: Record<string, StatusOption> = {
    [CollectRequestStatus.PENDING]: {
      value: CollectRequestStatus.PENDING,
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      darkModeColor: 'dark:bg-yellow-900 dark:text-yellow-100'
    },
    [CollectRequestStatus.VALIDATED]: {
      value: CollectRequestStatus.VALIDATED,
      label: 'Validated',
      color: 'bg-sky-100 text-sky-800',
      darkModeColor: 'dark:bg-sky-900 dark:text-sky-100'
    },
    [CollectRequestStatus.ACCEPTED]: {
      value: CollectRequestStatus.ACCEPTED,
      label: 'Accepted',
      color: 'bg-purple-100 text-purple-800',
      darkModeColor: 'dark:bg-purple-900 dark:text-purple-100'
    },
    [CollectRequestStatus.INPROGRESS]: {
      value: CollectRequestStatus.INPROGRESS,
      label: 'In Progress',
      color: 'bg-indigo-100 text-indigo-800',
      darkModeColor: 'dark:bg-indigo-900 dark:text-indigo-100'
    },
    [CollectRequestStatus.COMPLETED]: {
      value: CollectRequestStatus.COMPLETED,
      label: 'Completed',
      color: 'bg-green-100 text-green-800',
      darkModeColor: 'dark:bg-green-900 dark:text-green-100'
    },
    [CollectRequestStatus.REJECTED]: {
      value: CollectRequestStatus.REJECTED,
      label: 'Rejected',
      color: 'bg-red-100 text-red-800',
      darkModeColor: 'dark:bg-red-900 dark:text-red-100'
    }
  };

  private readonly statusTransitions: Record<string, string[]> = {
    [CollectRequestStatus.PENDING]: [
      CollectRequestStatus.VALIDATED,
      CollectRequestStatus.REJECTED
    ],
    [CollectRequestStatus.VALIDATED]: [
      CollectRequestStatus.ACCEPTED
    ],
    [CollectRequestStatus.ACCEPTED]: [
      CollectRequestStatus.INPROGRESS
    ],
    [CollectRequestStatus.INPROGRESS]: [
      CollectRequestStatus.COMPLETED
    ],
    [CollectRequestStatus.COMPLETED]: [],
    [CollectRequestStatus.REJECTED]: []
  };

  getAvailableStatuses(): string[] {
    return [this.currentStatus, ...this.statusTransitions[this.currentStatus]];
  }

  getStatusStyles(status: string): string {
    const statusOption = this.statusConfig[status];
    return `${statusOption.color} ${statusOption.darkModeColor}`;
  }

  formatStatus(status: string): string {
    return this.statusConfig[status].label;
  }

  onStatusChange(event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    if (this.isValidTransition(newStatus)) {
      this.statusChange.emit(newStatus);
    }
  }

  private isValidTransition(newStatus: string): boolean {
    return this.currentStatus === newStatus ||
      this.statusTransitions[this.currentStatus].includes(newStatus);
  }
}
