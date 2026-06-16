@extends('admin.layout.dashboard')
@section('title','Assign Permissions')
@section('page_title','Assign Permissions')
@section('page_route','Permissions / Assign Permissions')
{{-- Content --}}
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    {{-- FORM --}}
                    <form method="post" action="{{route('assignPermissions',$role)}}">
                        @csrf
                        <div class="form-group row">
                            {{--Role--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" data-id="1"/>
                                    <span class="mr-2"></span>
                                    <b>Role</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="1" value="create role"/>
                                            Create Role
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="1" value="view role"/>
                                            View Role
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="1" value="delete role"/>
                                            Delete Role
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="1" value="update role"/>
                                            Update Role
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--staff--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" data-id="2"/>
                                    <span class="mr-2"></span>
                                    <b>Staff</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="2" value="create staff"/>
                                            Create Staff
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="2" value="view staff"/>
                                            View Staff
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="2" value="delete staff"/>
                                            Delete Staff
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="2" value="update staff"/>
                                            Update Staff
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--setting--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" data-id="3"/>
                                    <span class="mr-2"></span>
                                    <b>Settings</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="3" value="settings"/>
                                            Settings
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="3" value="site setting"/>
                                            Site Setting
                                        </label>

                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="3" value="mail setting"/>
                                            Mail Setting
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Content Categories--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll"
                                           data-id="4"/>
                                    <span class="mr-2"></span>
                                    <b>Content Categories</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="4" value="create content category"/>
                                            Create Content Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="4" value="view content category"/>
                                            View Content Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="4" value="delete content category"/>
                                            Delete Content Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="4" value="update content category"/>
                                            Update Content Category
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Content Categories--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll"
                                           data-id="5"/>
                                    <span class="mr-2"></span>
                                    <b>Creator Categories</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="5" value="create creator category"/>
                                            Create Creator Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="5" value="view creator category"/>
                                            View Creator Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="5" value="delete creator category"/>
                                            Delete Creator Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="5" value="update creator category"/>
                                            Update Creator Category
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Company Types--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll"
                                           data-id="6"/>
                                    <span class="mr-2"></span>
                                    <b>Company Types</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="6" value="create company type"/>
                                            Create Company Type
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="6" value="view company type"/>
                                            View Company Type
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="6" value="delete company type"/>
                                            Delete Company Type
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="6" value="update company type"/>
                                            Update Company Type
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Legal Pages--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll"
                                           data-id="7"/>
                                    <span class="mr-2"></span>
                                    <b>Legal Pages</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="7" value="create legal page"/>
                                            Create Legal Page
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="7" value="view legal page"/>
                                            View Legal Page
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="7" value="delete legal page"/>
                                            Delete Legal Page
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="7" value="update legal page"/>
                                            Update Legal Page
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Users--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll"
                                           data-id="8"/>
                                    <span class="mr-2"></span>
                                    <b>Users</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="8" value="view users"/>
                                            View Users
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="8" value="change status"/>
                                            Change User Status
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="8" value="change locked status"/>
                                            Change User Locked Status
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="8" value="edit user info"/>
                                            Edit User
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="8" value="delete user"/>
                                            Delete User
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="8" value="restore user"/>
                                            Restore User
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--faqs--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll"
                                           data-id="9"/>
                                    <span class="mr-2"></span>
                                    <b>Faqs</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="9" value="create faq"/>
                                            Create Faq
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="9" value="view faq"/>
                                            View Faq
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="9" value="delete faq"/>
                                            Delete Faq
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="9" value="update faq"/>
                                            Update Faq
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>

                        </div>
                        <div class="card-footer">
                            <button class="btn btn-accent float-right" type="submit">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script>
        $(".checkAll").click(function () {
            let id = $(this).attr('data-id');
            if($(this).prop('checked') === true){
                $('input[type=checkbox]').each(function () {
                    const $data_val = $(this).attr('data-id');
                    if($data_val !== undefined && $data_val === id){
                        $(this).prop('checked', true);
                    }
                });
            }else {
                $('input[type=checkbox]').each(function () {
                    const $data_val = $(this).attr('data-id');
                    if($data_val !== undefined && $data_val === id){
                        $(this).prop('checked', false);
                    }
                });
            }
        });
    </script>
@endpush
