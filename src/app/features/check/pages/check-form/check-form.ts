import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, timeout } from 'rxjs/operators';

type PhotoKey =
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top'
  | 'front2'
  | 'back2'
  | 'left2'
  | 'right2'
  | 'top2';

@Component({
  selector: 'app-check-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './check-form.html',
  styleUrl: './check-form.css',
})
export class CheckFormComponent implements OnDestroy {
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  private apiUrl = 'http://192.168.1.137:8000/api/asset-inspections';

  model = {
    assetCode: '',
    assetType: '',
    assetName: '',
    assetModel: '',
    assetColor: '',
    assetAccessory: '',
    assetStatus: '',
    assetDefect: '',
    borrowDate: '',
    endDate: '',
    approver: '',
    inspector: '',
    recordDate: this.today(),
    note: '',
  };

  photoKeys: PhotoKey[] = ['front', 'back', 'left', 'right', 'top'];
  photoKeys2: PhotoKey[] = ['front2', 'back2', 'left2', 'right2', 'top2'];

  files: Partial<Record<PhotoKey, File>> = {};
  previews: Partial<Record<PhotoKey, string>> = {};
  fileInputs: Record<PhotoKey, HTMLInputElement> = {} as any;

  // ✅ UI state
  isSubmitting = false;
  uploadProgress = 0;
  uploadIndeterminate = false;

  toast = { show: false, type: 'success' as 'success' | 'error' | 'info', text: '' };
  private toastTimer: any = null;
  private submitSub?: Subscription;
  private autoCloseTimer: any = null;
  private autoCloseDelayMs = 20000;

  private clearAutoCloseTimer() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  private showToast(type: 'success' | 'error' | 'info', text: string, autoHideMs = 2500) {
    this.toast = { show: true, type, text };

    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (type === 'info') return; // info ไม่หายเอง (แต่เราจะปิดใน finalize)

    this.toastTimer = setTimeout(() => {
      this.toast.show = false;
      this.toastTimer = null;
    }, autoHideMs);
  }

  registerFileInput(key: PhotoKey, el: HTMLInputElement) {
    this.fileInputs[key] = el;
    return true;
  }

  photoLabel(key: PhotoKey) {
    switch (key) {
      case 'front': return 'ด้านหน้า';
      case 'back': return 'ด้านหลัง';
      case 'left': return 'ด้านซ้าย';
      case 'right': return 'ด้านขวา';
      case 'top': return 'ด้านบน';
      case 'front2': return 'ด้านหน้า';
      case 'back2': return 'ด้านหลัง';
      case 'left2': return 'ด้านซ้าย';
      case 'right2': return 'ด้านขวา';
      case 'top2': return 'ด้านบน';
    }
  }

  // ✅ Preview เร็ว (ObjectURL)
  onPickPhoto(key: PhotoKey, evt: Event) {
    if (this.isSubmitting) return;

    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.files[key] = file;

    const old = this.previews[key];
    if (old) URL.revokeObjectURL(old);

    this.previews[key] = URL.createObjectURL(file);
  }

  removePhoto(key: PhotoKey) {
    if (this.isSubmitting) return;

    this.files[key] = undefined;

    const old = this.previews[key];
    if (old) URL.revokeObjectURL(old);

    this.previews[key] = undefined;

    const el = this.fileInputs[key];
    if (el) el.value = '';
  }

  private resetForm() {
    this.model = {
      assetCode: '',
      assetType: '',
      assetName: '',
      assetModel: '',
      assetColor: '',
      assetAccessory: '',
      assetStatus: '',
      assetDefect: '',
      borrowDate: '',
      endDate: '',
      approver: '',
      inspector: '',
      recordDate: this.today(),
      note: '',
    };

    for (const k of [...this.photoKeys, ...this.photoKeys2]) {
      const old = this.previews[k];
      if (old) URL.revokeObjectURL(old);
      this.files[k] = undefined;
      this.previews[k] = undefined;

      const el = this.fileInputs[k];
      if (el) el.value = '';
    }

    this.uploadProgress = 0;
    this.uploadIndeterminate = false;
    this.toast.show = false;
  }

  onCancel() {
    if (this.isSubmitting) return;
    this.resetForm();
  }

  onSubmit() {
    if (this.isSubmitting) return;

    // ✅ validate
    if (!this.model.assetType.trim()) {
      this.showToast('error', 'กรุณากรอกประเภททรัพย์สิน');
      return;
    }
    if (!this.model.inspector.trim()) {
      this.showToast('error', 'กรุณากรอกชื่อผู้ขอยืม');
      return;
    }

    const missing = [...this.photoKeys, ...this.photoKeys2].filter(k => !this.files[k]);
    if (missing.length) {
      this.showToast('error', 'กรุณาเพิ่มรูปให้ครบ 10 ภาพ');
      return;
    }

    // กันกดซ้ำ / งานเก่าค้าง
    this.submitSub?.unsubscribe();

    const fd = new FormData();
    fd.append('asset_code', this.model.assetCode);
    fd.append('asset_type', this.model.assetType);
    fd.append('asset_name', this.model.assetName);
    fd.append('asset_model', this.model.assetModel);
    fd.append('asset_color', this.model.assetColor);
    fd.append('asset_accessory', this.model.assetAccessory);
    fd.append('asset_status', this.model.assetStatus);
    fd.append('asset_defect', this.model.assetDefect);
    fd.append('borrow_date', this.model.borrowDate);
    fd.append('end_date', this.model.endDate);
    fd.append('approver', this.model.approver);
    fd.append('responsible_person', this.model.inspector);
    fd.append('inspection_date', this.model.recordDate);

    fd.append('top_view', this.files.top as File);
    fd.append('bottom_view', this.files.back as File);
    fd.append('left_view', this.files.left as File);
    fd.append('right_view', this.files.right as File);
    fd.append('overall_view', this.files.front as File);

    fd.append('top_view_2', this.files.top2 as File);
    fd.append('bottom_view_2', this.files.back2 as File);
    fd.append('left_view_2', this.files.left2 as File);
    fd.append('right_view_2', this.files.right2 as File);
    fd.append('overall_view_2', this.files.front2 as File);

    this.isSubmitting = true;
    this.uploadProgress = 0;
    this.uploadIndeterminate = true; // เริ่มเป็น indeterminate กัน 0% ค้าง
    this.showToast('info', 'กำลังอัปโหลด/ส่งข้อมูล...');

    // ปิดสถานะกำลังบันทึกอัตโนมัติหลัง X วินาที (ไม่ต้องรอ backend)
    this.clearAutoCloseTimer();
    this.autoCloseTimer = setTimeout(() => {
      if (this.isSubmitting) {
        this.isSubmitting = false;
        this.resetForm();
        this.cdr.detectChanges();
      }
    }, this.autoCloseDelayMs);

    this.submitSub = this.http
      .post(this.apiUrl, fd, { observe: 'events', reportProgress: true })
      .pipe(
        timeout(20000),
        finalize(() => {
          // ✅ จบทุกกรณี ต้องปลดล็อก + ปิด toast info
          this.isSubmitting = false;
          this.uploadIndeterminate = false;
          if (this.toast.type === 'info') this.toast.show = false;
          this.clearAutoCloseTimer();
        })
      )
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            const total = event.total;
            if (!total || total <= 0) {
              this.uploadIndeterminate = true;
              return;
            }
            this.uploadIndeterminate = false;
            this.uploadProgress = Math.round((event.loaded / total) * 100);
          }

          if (event.type === HttpEventType.Response) {
            this.uploadProgress = 100;
            this.showToast('success', 'บันทึกสำเร็จ และส่งเข้า Google Sheets แล้ว', 2500);
            this.isSubmitting = false;
            this.resetForm();
            this.clearAutoCloseTimer();
          }
        },
        error: (err) => {
          console.error('API ERROR', err);
          if (String(err?.name).toLowerCase().includes('timeouterror')) {
            this.showToast('success', 'เซิร์ฟเวอร์ตอบช้า — ถ้าข้อมูลขึ้นใน Google Sheets แล้ว ถือว่าสำเร็จ', 3500);
            this.isSubmitting = false;
            this.resetForm();
            this.clearAutoCloseTimer();
            return;
          }
          const msg =
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : '') ||
            err?.message ||
            'ส่งข้อมูลไม่สำเร็จ';

          this.showToast('error', `ส่งข้อมูลไม่สำเร็จ (${err?.status || '-'}) : ${msg}`, 3500);
          this.clearAutoCloseTimer();
        },
      });
  }

  private today() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  ngOnDestroy(): void {
    this.submitSub?.unsubscribe();
    this.clearAutoCloseTimer();
    for (const k of this.photoKeys) {
      const url = this.previews[k];
      if (url) URL.revokeObjectURL(url);
    }
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
}
