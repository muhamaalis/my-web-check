import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type PhotoKey = 'front' | 'back' | 'left' | 'right' | 'top';

@Component({
  selector: 'app-check-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-form.html',
  styleUrl: './check-form.css',
})
export class CheckFormComponent {
  model = {
    assetType: '',
    inspector: '',
    recordDate: this.today(), 
    note: '',
  };

  photoKeys: PhotoKey[] = ['front', 'back', 'left', 'right', 'top'];

  files: Partial<Record<PhotoKey, File>> = {};
  previews: Partial<Record<PhotoKey, string>> = {};
  fileInputs: Record<PhotoKey, HTMLInputElement> = {} as any;

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
    }
  }

  onPickPhoto(key: PhotoKey, evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.files[key] = file;

    const reader = new FileReader();
    reader.onload = () => (this.previews[key] = String(reader.result));
    reader.readAsDataURL(file);
  }

  removePhoto(key: PhotoKey) {
    this.files[key] = undefined;
    this.previews[key] = undefined;
    const el = this.fileInputs[key];
    if (el) el.value = '';
  }

  connectGoogleSheets() {
    alert('เดี๋ยวค่อยต่อ Google Sheets ขั้นต่อไป (ทำได้แน่นอน)');
  }

  onCancel() {
    this.model = { assetType: '', inspector: '', recordDate: this.today(), note: '' };
    for (const k of this.photoKeys) this.removePhoto(k);
  }

  onSubmit() {
    const missing = this.photoKeys.filter((k) => !this.files[k]);
    if (missing.length) {
      alert('กรุณาเพิ่มรูปให้ครบ 5 ภาพ');
      return;
    }

    console.log('FORM', this.model);
    console.log('FILES', this.files);
    alert('บันทึกสำเร็จ (เดี๋ยวขั้นต่อไปจะส่งเข้า Google Sheets)');
  }

  private today() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
