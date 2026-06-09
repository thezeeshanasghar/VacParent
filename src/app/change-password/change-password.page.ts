import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  changePasswordForm: FormGroup;
  showOld = false;
  showNew = false;
  showConfirm = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword').value;
    const confirmPassword = form.get('confirmPassword').value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  ionViewDidEnter() {
    if (!this.loginService.isAuthenticated()) {
      this.router.navigate(['login']);
      return;
    }
    this.storage.get(environment.USER_Id).then((Id) => {
      if (!Id) {
        this.toastService.create('User not found. Please log in again.', 'danger');
        this.router.navigate(['login']);
      }
    });
  }

  async changePassword() {
    if (this.changePasswordForm.invalid || this.isLoading) {
      return;
    }
    this.isLoading = true;

    try {
      const userId = await this.storage.get(environment.USER_Id);
      console.log('User ID:', userId);

      if (!userId) {
        throw new Error('User ID not found');
      }

      const data = {
        userId: userId,
        oldPassword: this.changePasswordForm.get('oldPassword').value,
        newPassword: this.changePasswordForm.get('newPassword').value
      };

      this.loginService.ChangePassword(data).subscribe(
        async (res: any) => {
          this.isLoading = false;
          if (res.IsSuccess) {
            await this.storage.remove('USER_EMAIL');
            this.toastService.create('Password changed successfully');
            this.router.navigate(['/login']);
          } else {
            this.toastService.create(res.error?.message || 'An error occurred while changing the password', 'danger');
          }
        },
        (err: any) => {
          this.isLoading = false;
          this.toastService.create(err.error?.message || 'An error occurred while changing the password', 'danger');
        }
      );
    } catch (error) {
      this.isLoading = false;
      this.toastService.create('An error occurred while changing the password', 'danger');
      this.router.navigate(['/login']);
    }
  }
}