@extends('admin.layout.dashboard')
@section('title','Roles')
@section('content')
    <div class="d-flex flex-column-fluid">
        <div class="container">
            <div class="card">
                <div class="card-body">
                    <form method="post" action="{{route('roleUpdate',$role)}}">
                        @csrf
                        <div class="form-group">
                            <label for="name">Name </label>
                            <input id="name" name="name" type="text" class="form-control @error('name') is-invalid @enderror"  placeholder="Role name"  value="{{$role->name}}"/>
                            @error('name')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-accent float-right">Update</button>
                        </div>
                    </form>
                </div>
            </div>
            {{-- Edit Permissions --}}
            <div class="card mt-3">
                <div class="card-header">
                    <div class="card-title mt-4 border-0">
                        <h5>Edit Permissions</h5>
                    </div>
                </div>
                <div class="card-body">
                    {{-- FORM --}}
                    <form method="post" action="{{route('updateRolePermissions',$role)}}">
                        @csrf
                        <div class="form-group row">
                            {{--Role--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" @if($role->hasPermissionTo('create role') && $role->hasPermissionTo('view role') && $role->hasPermissionTo('delete role') && $role->hasPermissionTo('update role') ) checked @endif data-id="1"/>
                                    <span class="mr-2"></span>
                                    <b>Role</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('create role')) checked @endif data-id="1" value="create role"/>
                                            Create Role
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('view role')) checked @endif data-id="1" value="view role"/>
                                            View Role
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('delete role')) checked @endif data-id="1" value="delete role"/>
                                            Delete Role
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('update role')) checked @endif data-id="1" value="update role"/>
                                            Update Role
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--staff--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" @if($role->hasPermissionTo('create staff') && $role->hasPermissionTo('view staff') && $role->hasPermissionTo('delete staff') && $role->hasPermissionTo('update staff') ) checked @endif data-id="2"/>
                                    <span class="mr-2"></span>
                                    <b>Staff</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="2" value="create staff" @if($role->hasPermissionTo('create staff')) checked @endif/>
                                            Create Staff
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="2" value="view staff" @if($role->hasPermissionTo('view staff')) checked @endif/>
                                            View Staff
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="2" value="delete staff" @if($role->hasPermissionTo('delete staff')) checked @endif/>
                                            Delete Staff
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="2" value="update staff" @if($role->hasPermissionTo('update staff')) checked @endif/>
                                            Update Staff
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--setting--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" data-id="3" @if($role->hasPermissionTo('settings') && $role->hasPermissionTo('site setting')  && $role->hasPermissionTo('mail setting') ) checked @endif/>
                                    <span class="mr-2"></span>
                                    <b>Settings</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="3" value="settings" @if($role->hasPermissionTo('settings')) checked @endif/>
                                            Settings
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="3" value="site setting" @if($role->hasPermissionTo('site setting')) checked @endif/>
                                            Site Setting
                                        </label>

                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="3" value="mail setting"  @if($role->hasPermissionTo('mail setting')) checked @endif/>
                                            Mail Setting
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Content Categories--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" @if($role->hasPermissionTo('create content category') && $role->hasPermissionTo('view content category') && $role->hasPermissionTo('delete content category') && $role->hasPermissionTo('update content category') ) checked @endif
                                    data-id="4"/>
                                    <span class="mr-2"></span>
                                    <b>Content Categories</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('create content category')) checked @endif data-id="4" value="create content category"/>
                                            Create Content Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('view content category')) checked @endif data-id="4" value="view content category"/>
                                            View Content Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('delete content category')) checked @endif data-id="4" value="delete content category"/>
                                            Delete Content Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('update content category')) checked @endif data-id="4" value="update content category"/>
                                            Update Content Category
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Content Categories--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" @if($role->hasPermissionTo('create creator category') && $role->hasPermissionTo('view creator category') && $role->hasPermissionTo('delete creator category') && $role->hasPermissionTo('update creator category') ) checked @endif
                                    data-id="5"/>
                                    <span class="mr-2"></span>
                                    <b>Creator Categories</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('create creator category')) checked @endif data-id="5" value="create creator category"/>
                                            Create Creator Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('view creator category')) checked @endif data-id="5" value="view creator category"/>
                                            View Creator Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('delete creator category')) checked @endif data-id="5" value="delete creator category"/>
                                            Delete Creator Category
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('update creator category')) checked @endif data-id="5" value="update creator category"/>
                                            Update Creator Category
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Company Types--}}
                            <div class="col-4">
                                <label class="checkbox" >
                                    <input type="checkbox"  class="checkAll"
                                           data-id="6" @if($role->hasPermissionTo('create company type') && $role->hasPermissionTo('view company type') && $role->hasPermissionTo('delete company type') && $role->hasPermissionTo('update company type') ) checked @endif/>
                                    <span class="mr-2"></span>
                                    <b>Company Types</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="6"  @if($role->hasPermissionTo('create company type')) checked @endif value="create company type"/>
                                            Create Company Type
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="6"  @if($role->hasPermissionTo('create company type')) checked @endif value="view company type"/>
                                            View Company Type
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="6"  @if($role->hasPermissionTo('create company type')) checked @endif value="delete company type"/>
                                            Delete Company Type
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="6"  @if($role->hasPermissionTo('create company type')) checked @endif value="update company type"/>
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
                                           data-id="7"  @if($role->hasPermissionTo('create legal page') && $role->hasPermissionTo('view legal page') && $role->hasPermissionTo('delete legal page') && $role->hasPermissionTo('update legal page') ) checked @endif/>
                                    <span class="mr-2"></span>
                                    <b>Legal Pages</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('create legal page')) checked @endif   data-id="7" value="create legal page"/>
                                            Create Legal Page
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('create legal page')) checked @endif   data-id="7" value="view legal page"/>
                                            View Legal Page
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('create legal page')) checked @endif  data-id="7" value="delete legal page"/>
                                            Delete Legal Page
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('create legal page')) checked @endif   data-id="7" value="update legal page"/>
                                            Update Legal Page
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--Users--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll" @if( $role->hasPermissionTo('view users')
                                       && $role->hasPermissionTo('change status') && $role->hasPermissionTo('change locked status')
                                       && $role->hasPermissionTo('edit user info') && $role->hasPermissionTo('delete user') && $role->hasPermissionTo('restore user') ) checked @endif
                                    data-id="8"/>
                                    <span class="mr-2"></span>
                                    <b>Users</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  @if($role->hasPermissionTo('view users')) checked @endif data-id="8" value="view users"/>
                                            View Users
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('change status')) checked @endif data-id="8" value="change status"/>
                                            Change User Status
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('change locked status')) checked @endif  data-id="8" value="change locked status"/>
                                            Change User Locked Status
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('edit user info')) checked @endif  data-id="8" value="edit user info"/>
                                            Edit User
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('delete user')) checked @endif  data-id="8" value="delete user"/>
                                            Delete User
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" @if($role->hasPermissionTo('restore user')) checked @endif  data-id="8" value="restore user"/>
                                            Restore User
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                            {{--faqs--}}
                            <div class="col-4">
                                <label class="checkbox ">
                                    <input type="checkbox"  class="checkAll"  @if( $role->hasPermissionTo('create faq')
                                       && $role->hasPermissionTo('view faq') && $role->hasPermissionTo('delete faq')
                                       && $role->hasPermissionTo('update faq') ) checked @endif
                                           data-id="9"/>
                                    <span class="mr-2"></span>
                                    <b>Faqs</b>
                                </label>
                                <div class="col-form-label">
                                    <div class="checkbox-list ml-4 d-flex flex-column">
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="9" value="create faq" @if($role->hasPermissionTo('create faq')) checked @endif/>
                                            Create Faq
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="9" value="view faq" @if($role->hasPermissionTo('view faq')) checked @endif//>
                                            View Faq
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]" data-id="9" value="delete faq" @if($role->hasPermissionTo('delete faq')) checked @endif//>
                                            Delete Faq
                                        </label>
                                        <label class="checkbox">
                                            <input type="checkbox"  name="permissions[]"  data-id="9" value="update faq" @if($role->hasPermissionTo('update faq')) checked @endif//>
                                            Update Faq
                                        </label>
                                    </div>
                                </div>
                                <!--end::Form-->
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-accent float-right" type="submit">Update Permissions</button>
                        </div>
                    </form>
                    {{-- END FORM --}}
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

