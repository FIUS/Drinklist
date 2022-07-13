import {Component, Input, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-confirmation-modal',
  template: `
    <ng-template #content let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Confirmation</h4>
        <button type="button" class="close" (click)="modal.dismiss()">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <ng-content></ng-content>
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" ngbAutofocus class="btn btn-outline-secondary" (click)="modal.dismiss()">{{no}}</button>
        <button type="button" class="btn btn-danger" (click)="callback(); modal.close()">{{yes}}</button>
      </div>
    </ng-template>
  `,
  styles: []
})
export class AdminConfirmationModalComponent {
  @Input() yes = 'Yes';
  @Input() no = 'No';
  @Input() callback!: () => void;

  @ViewChild('content', {static: true}) content: any;

  constructor(
    private modalService: NgbModal,
  ) {
  }

  open(): void {
    if (this.modalService.hasOpenModals()) {
      return;
    }
    this.modalService.open(this.content, {backdrop: 'static', size: 'lg'});
  }

}
