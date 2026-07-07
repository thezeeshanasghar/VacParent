import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

/**
 * Shared bottom-sheet used across the refresh (booking-type chooser, date
 * picker, vaccine detail). Replaces the hand-rolled `position:fixed` overlays.
 *
 * Usage:
 *   <app-bottom-sheet [isOpen]="open" (dismissed)="open = false">
 *     ...projected content...
 *   </app-bottom-sheet>
 *
 * Slides up (~250ms ease-out), scrim fades in; dismiss on scrim tap or a
 * downward drag of the grab-handle. Set [dismissable]="false" to keep it modal.
 */
@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent {
  @Input() isOpen = false;
  @Input() dismissable = true;
  /** Extra bottom padding class hook, e.g. tall sheets that scroll. */
  @Input() scroll = false;

  @Output() dismissed = new EventEmitter<void>();

  private dragStartY: number | null = null;
  dragOffset = 0;

  @HostBinding('class.is-open') get openClass() { return this.isOpen; }

  onScrim() {
    if (this.dismissable) this.dismiss();
  }

  dismiss() {
    this.dragOffset = 0;
    this.dragStartY = null;
    this.dismissed.emit();
  }

  onHandleStart(ev: TouchEvent | MouseEvent) {
    if (!this.dismissable) return;
    this.dragStartY = this.pointY(ev);
  }

  onHandleMove(ev: TouchEvent | MouseEvent) {
    if (this.dragStartY == null) return;
    const dy = this.pointY(ev) - this.dragStartY;
    this.dragOffset = dy > 0 ? dy : 0;
  }

  onHandleEnd() {
    if (this.dragStartY == null) return;
    if (this.dragOffset > 90) {
      this.dismiss();
    } else {
      this.dragOffset = 0;
      this.dragStartY = null;
    }
  }

  private pointY(ev: TouchEvent | MouseEvent): number {
    if ((ev as TouchEvent).touches && (ev as TouchEvent).touches.length) {
      return (ev as TouchEvent).touches[0].clientY;
    }
    if ((ev as TouchEvent).changedTouches && (ev as TouchEvent).changedTouches.length) {
      return (ev as TouchEvent).changedTouches[0].clientY;
    }
    return (ev as MouseEvent).clientY;
  }
}
