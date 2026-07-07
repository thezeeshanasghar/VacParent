import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';

@NgModule({
  declarations: [BottomSheetComponent],
  imports: [CommonModule, IonicModule],
  exports: [BottomSheetComponent]
})
export class SharedModule {}
