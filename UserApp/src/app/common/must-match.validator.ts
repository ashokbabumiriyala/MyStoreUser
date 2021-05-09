import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ConfirmPasswordValidation {   
    static ConfirmPassword(group: AbstractControl): { [key: string]: any } | null {       
        const password = group.get('Password');
        const confirmPassword = group.get('confirmPassword');
        if ((password.value !== '') && (confirmPassword.value !== '')) {
            if (confirmPassword.value == password.value) {
                return null;
            } else {
                return { confirmPassword: true };
            }
        }
    }
}
