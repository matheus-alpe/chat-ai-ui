import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [NgClass],
  template: `
    <div class="flex mb-2">
      <div
        class="py-2.5 rounded-xl max-w-10/12 inline-block"
        [ngClass]="{ 'self-end ml-auto': alignRight }"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class Message {
  @Input() alignRight = false;
}
