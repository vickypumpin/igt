<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaff extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $staff = $this->route('staff');
        return [
            'name' => 'required|string|max:255',
            'email' => ['required', 'string','max:255', Rule::unique('admins', 'email')->ignore($staff->id)],
            'profile_image' => 'sometimes|image|mimes:jpeg,jpg,png',
            'role' => 'required',
        ];
    }
}
