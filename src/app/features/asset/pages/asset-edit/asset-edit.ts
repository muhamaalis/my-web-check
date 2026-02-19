import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-asset-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
<div class="mx-auto max-w-5xl px-4 py-6">
  <div class="mb-4 flex items-center justify-between">
    <h1 class="text-2xl font-semibold">แก้ไขรายการ</h1>
    <a
      routerLink="/asset/list"
      class="inline-flex items-center rounded-xl border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
    >
      กลับหน้ารายการทรัพย์สิน
    </a>
  </div>

  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label class="text-sm text-slate-600">รหัสทรัพย์สิน</label>
        <input class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" />
      </div>
      <div>
        <label class="text-sm text-slate-600">ประเภท</label>
        <select class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm">
          <option value="">เลือกประเภท</option>
          <option>laptop</option>
          <option>mobile phone</option>
          <option>mac mini</option>
          <option>macbook</option>
        </select>
      </div>
      <div>
        <label class="text-sm text-slate-600">ชื่อ</label>
        <input class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" />
      </div>
      <div>
        <label class="text-sm text-slate-600">ยี่ห้อ</label>
        <input class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" />
      </div>
      <div>
        <label class="text-sm text-slate-600">รุ่น</label>
        <input class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" />
      </div>
      <div>
        <label class="text-sm text-slate-600">สี</label>
        <input class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" />
      </div>
      <div>
        <label class="text-sm text-slate-600">อุปกรณ์เสริม</label>
        <select class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm">
          <option value="">เลือกอุปกรณ์เสริม</option>
          <option>สายชาร์จ</option>
          <option>เมาส์</option>
        </select>
      </div>
      <div>
        <label class="text-sm text-slate-600">สถานะ</label>
        <select class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm">
          <option value="">เลือกสถานะ</option>
          <option>ใช้งาน</option>
          <option>ว่าง</option>
          <option>ชำรุด</option>
          <option>ซ่อม</option>
          <option>รอจำหน่าย</option>
          <option>จำหน่ายแล้ว</option>
          <option>สูญหาย</option>
          <option>ยืม</option>
          <option>รอตรวจสอบ</option>
          <option>งดใช้งาน</option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label class="text-sm text-slate-600">ตำหนิ</label>
        <input class="mt-1 w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" />
      </div>
    </div>

    <div class="mt-5 flex gap-3">
      <button class="rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700">บันทึก</button>
      <button class="rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300">ยกเลิก</button>
    </div>
  </div>
</div>
  `,
  styles: [],
})
export class AssetEditComponent {}
