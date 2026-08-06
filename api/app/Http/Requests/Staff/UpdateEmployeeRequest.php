<?php

namespace App\Http\Requests\Staff;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function rules(): array
    {
        $employee = $this->route('employee');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($employee->user_id)],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'position' => ['required', 'string', 'max:255'],
            'role' => ['prohibited'],
        ];
    }
}
