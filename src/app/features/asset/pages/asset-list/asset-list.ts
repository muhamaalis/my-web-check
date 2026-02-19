import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './asset-list.html',
  styleUrl: './asset-list.css',
})
export class AssetListComponent {
  constructor(private router: Router) {}

  goEdit(id: number) {
    this.router.navigate(['/asset/edit', id]);
  }
}
