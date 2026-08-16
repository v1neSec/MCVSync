<?php

namespace App\Http\Requests\Staff\Inventory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUnitRequest extends FormRequest
{
    public function rules(): array
    {
        $unit = $this->route('unit');

        return [
            'code' => ['required', 'string', 'max:20', Rule::unique('units', 'code')->ignore($unit->id)],
            'name' => ['required', 'string', 'max:255', Rule::unique('units', 'name')->ignore($unit->id)],
        ];
    }
}
