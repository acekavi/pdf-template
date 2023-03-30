import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfExportPage } from './pdf-export.page';

describe('PdfExportPage', () => {
  let component: PdfExportPage;
  let fixture: ComponentFixture<PdfExportPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PdfExportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
