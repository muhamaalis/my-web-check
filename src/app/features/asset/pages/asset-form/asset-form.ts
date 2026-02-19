import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './asset-form.html',
  styleUrl: './asset-form.css',
})
export class AssetFormComponent {
  model = {
    assetCode: '',
    assetType: '',
    assetName: '',
    brand: '',
    modelName: '',
    color: '',
    accessory: '',
    accessoryExtra: '',
    status: '',
    defect: '',
    defectExtra: '',
  };

  accessoryExtras: string[] = [];
  defectExtras: string[] = [];

  addAccessoryExtra() {
    const value = (this.model.accessoryExtra || this.model.accessory).trim();
    if (!value) return;
    this.accessoryExtras.push(value);
    this.model.accessoryExtra = '';
    this.model.accessory = '';
  }

  removeAccessoryExtra(index: number) {
    this.accessoryExtras.splice(index, 1);
  }

  addDefectExtra() {
    const value = (this.model.defectExtra || this.model.defect).trim();
    if (!value) return;
    this.defectExtras.push(value);
    this.model.defectExtra = '';
    this.model.defect = '';
  }

  removeDefectExtra(index: number) {
    this.defectExtras.splice(index, 1);
  }

  onSave() {}

  onCancel() {
    this.model = {
      assetCode: '',
      assetType: '',
      assetName: '',
      brand: '',
      modelName: '',
      color: '',
      accessory: '',
      accessoryExtra: '',
      status: '',
      defect: '',
      defectExtra: '',
    };
    this.accessoryExtras = [];
    this.defectExtras = [];
  }
}
