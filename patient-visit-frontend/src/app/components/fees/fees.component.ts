import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FeeService } from '../../services/fee.service';
import { Fee, CreateFeeDto, UpdateFeeDto } from '../../models/fee.model';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Fees Management</h2>
        <button class="btn btn-primary" (click)="showAddForm()">Add New Fee</button>
      </div>

      @if (successMessage) {
        <div class="alert alert-success">
          {{ successMessage }}
        </div>
      }

      @if (errorMessage) {
        <div class="alert alert-danger">
          {{ errorMessage }}
        </div>
      }

      @if (isLoading) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading fees...</p>
        </div>
      }

      @if (!isLoading && fees.length === 0) {
        <div class="text-center">
          <p>No fees found.</p>
        </div>
      }

      @if (!isLoading && fees.length > 0) {
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (fee of fees; track fee.feeId) {
              <tr>
                <td>{{ fee.feeId }}</td>
                <td>{{ fee.serviceName }}</td>
                <td>$ {{ fee.amount }}</td>
                <td>
                  <button class="btn btn-warning btn-sm" (click)="editFee(fee)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteFee(fee.feeId)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }

      <!-- Add/Edit Modal -->
      @if (showModal) {
        <div class="modal show">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">
                @if (isEditing) {
                  Edit Fee
                } @else {
                  Add New Fee
                }
              </h3>
              <span class="close" (click)="closeModal()">&times;</span>
            </div>
            
            <form [formGroup]="feeForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="serviceName">Service Name</label>
                <input type="text" id="serviceName" formControlName="serviceName" class="form-control">
                @if (feeForm.get('serviceName')?.invalid && feeForm.get('serviceName')?.touched) {
                  <div class="error-message">Service name is required</div>
                }
              </div>
              
              <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" id="amount" formControlName="amount" class="form-control" step="0.01" min="0">
                @if (feeForm.get('amount')?.invalid && feeForm.get('amount')?.touched) {
                  <div class="error-message">Amount is required and must be positive</div>
                }
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSubmitting || feeForm.invalid">
                  @if (isSubmitting) {
                    Saving...
                  } @else {
                    Save
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class FeesComponent implements OnInit {
  fees: Fee[] = [];
  isLoading = false;
  showModal = false;
  isEditing = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  feeForm: FormGroup;
  editingFeeId: number | null = null;

  constructor(
    private feeService: FeeService,
    private fb: FormBuilder
  ) {
    this.feeForm = this.fb.group({
      serviceName: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadFees();
  }

  loadFees(): void {
    this.isLoading = true;
    this.feeService.getAllFees().subscribe({
      next: (data) => {
        this.fees = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load fees';
        this.isLoading = false;
      }
    });
  }

  showAddForm(): void {
    this.isEditing = false;
    this.editingFeeId = null;
    this.resetForm();
    this.showModal = true;
  }

  editFee(fee: Fee): void {
    this.isEditing = true;
    this.editingFeeId = fee.feeId;
    this.feeForm.patchValue({
      serviceName: fee.serviceName,
      amount: fee.amount
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.feeForm.reset();
  }

  onSubmit(): void {
    if (this.feeForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.feeForm.value;

    if (this.isEditing && this.editingFeeId) {
      const updateData: UpdateFeeDto = {
        ...formValue,
        feeId: this.editingFeeId
      };

      this.feeService.updateFee(this.editingFeeId, updateData).subscribe({
        next: () => {
          this.successMessage = 'Fee updated successfully';
          this.closeModal();
          this.loadFees();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update fee';
          this.isSubmitting = false;
        }
      });
    } else {
      const createData: CreateFeeDto = { ...formValue };

      this.feeService.createFee(createData).subscribe({
        next: () => {
          this.successMessage = 'Fee created successfully';
          this.closeModal();
          this.loadFees();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to create fee';
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteFee(feeId: number): void {
    if (confirm('Are you sure you want to delete this fee?')) {
      this.feeService.deleteFee(feeId).subscribe({
        next: () => {
          this.successMessage = 'Fee deleted successfully';
          this.loadFees();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete fee';
        }
      });
    }
  }
}
