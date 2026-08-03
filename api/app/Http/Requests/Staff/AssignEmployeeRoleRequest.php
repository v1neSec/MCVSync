<?php

namespace App\Http\Requests\Staff;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignEmployeeRoleRequest extends FormRequest
{
    private const BRANCH_SCOPED_ROLES = ['sales', 'purchasing', 'accounting', 'logistics'];

    public function rules(): array
    {
        return [
            'role' => [
                'required',
                'string',
                Rule::exists('roles', 'name')->where('guard_name', 'staff'),
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $role = $this->input('role');
            $employee = $this->route('employee');

            if (
                in_array($role, self::BRANCH_SCOPED_ROLES, true)
                && ! $employee->branch_id
            ) {
                $validator->errors()->add(
                    'role',
                    'Set a branch for this employee before assigning this role.',
                );
            }
        });
    }
}
