<div class="mdk-drawer js-mdk-drawer" id="default-drawer">
    <div class="mdk-drawer__content">
        <div class="sidebar sidebar-light sidebar-left" data-perfect-scrollbar>

            <a href="{{url('/')}}" class="sidebar-brand">
                <img class="sidebar-brand-icon" src="{{asset('images/igt_logo.png')}}" alt="IGT">
                <span>
                    @if($settings->site_logo)
                        <img class="brand-icon" src="{{asset('/storage/logo/'.$settings->site_logo)}}" width="130px" height="32px" alt="IGT">
                    @else
                        <img class="brand-icon" src="{{asset('images/igthomelogo.png')}}" width="130px" height="32px" alt="IGT">
                    @endif
                </span>
            </a>



            <div class="sidebar-account mx-16pt mb-16pt dropdown">
                <a href="#" class="nav-link d-flex align-items-center dropdown-toggle" data-toggle="dropdown" data-caret="false">
                    <img width="32" height="32" class="rounded-circle mr-8pt" src="{{get_admin_image(auth()->guard('admin')->user()->id)}}" alt="account" />
                    <span class="flex d-flex flex-column mr-8pt">
                                <span class="text-black-100">{{auth()->guard('admin')->user()->name}}</span>
                                <small class="text-black-50">IGT Admin</small>
                            </span>
                    <i class="material-icons text-black-20 icon-16pt">keyboard_arrow_down</i>
                </a>
                <div class="dropdown-menu dropdown-menu-full dropdown-menu-caret-center">
                    <div class="dropdown-header"><strong><span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">account_circle</span>ACCOUNT</strong></div>
                    <a class="dropdown-item" href="{{route('admin_edit_account')}}"><span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">edit</span>Edit Account</a>
                    <a class="dropdown-item" href="{{route('adminLogout')}}"><span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">exit_to_app</span>Logout</a>
                    <div class="dropdown-divider"></div>
                </div>
            </div>


            <div class="sidebar-heading">Overview</div>
            <ul class="sidebar-menu">
                <li class="sidebar-menu-item {{ active_class('adminDashboard') }}">
                    <a class="sidebar-menu-button" href="{{route('adminDashboard')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">insert_chart_outlined</span>
                        <span class="sidebar-menu-text">Dashboard</span>
                    </a>
                </li>
                @if(auth()->guard('admin')->user()->can('view users') || auth()->guard('admin')->user()->can('view staff'))
                    <li class="sidebar-menu-item {{ open_class('staffs,staff.create,staff.edit,manage-users,userAccountInfo,userSocialProfile,user-password') }}">
                        <a class="sidebar-menu-button" data-toggle="collapse" href="#acctmgt">
                            <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">contacts</span>
                            Account Mgt
                            <span class="badge badge-primary ml-1">{{$pending_users_count}}</span>
                            <span class="ml-auto sidebar-menu-toggle-icon"></span>
                        </a>
                        <ul class="sidebar-submenu collapse sm-indent" id="acctmgt">
                            @if(auth()->guard('admin')->user()->can('view users'))
                                <li class="sidebar-menu-item {{ active_class('manage-users,userAccountInfo,userSocialProfile,user-password') }}">
                                    <a class="sidebar-menu-button" href="{{route('manage-users')}}">
                                        <span class="fa fa-users sidebar-menu-icon sidebar-menu-icon--left"></span>
                                        <span class="sidebar-menu-text">Users</span>
                                    </a>
                                </li>
                            @endif
                            @if(auth()->guard('admin')->user()->can('view staff'))
                                <li class="sidebar-menu-item {{ active_class('staffs,staff.create,staff.edit') }}">
                                    <a class="sidebar-menu-button" href="{{route('staffs')}}">
                                        <span class="fa fa-users-cog sidebar-menu-icon sidebar-menu-icon--left"></span>
                                        <span class="sidebar-menu-text">Staffs</span>
                                    </a>
                                </li>
                            @endif
                        </ul>
                    </li>
                @endif
                <li class="sidebar-menu-item {{open_class('admin_reports,manage_admin_campaigns,admin_reward_contacts')}}">
                    <a class="sidebar-menu-button" data-toggle="collapse" href="#campaign_mgt">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">donut_large</span>
                        Campaign Mgt
                        <span class="badge badge-primary ml-1">{{$pending_campaign_count}}</span>
                        <span class="ml-auto sidebar-menu-toggle-icon"></span>
                    </a>
                    <ul class="sidebar-submenu collapse sm-indent" id="campaign_mgt">
                        <li class="sidebar-menu-item {{ active_class('manage_admin_campaigns') }}">
                            <a class="sidebar-menu-button" href="{{route('manage_admin_campaigns')}}">
                                <span class="fa fa-bullhorn sidebar-menu-icon sidebar-menu-icon--left"></span>
                                <span class="sidebar-menu-text">Campaigns</span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item {{active_class('admin_reward_contacts')}}">
                            <a class="sidebar-menu-button" href="{{route('admin_reward_contacts')}}">
                                <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">contacts</span>
                                <span class="sidebar-menu-text">Rewards</span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item {{active_class('admin_reports')}}">
                            <a class="sidebar-menu-button" href="{{route('admin_reports')}}">
                                <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">details</span>
                                <span class="sidebar-menu-text">Reports</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="sidebar-menu-item {{ active_class('payments') }}">
                    <a class="sidebar-menu-button" href="{{route('payments')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">payment</span>
                        <span class="sidebar-menu-text">
                            Payments
                           <span class="badge badge-primary ml-1">{{$total_payment_pending_approve_count}}</span>
                        </span>
                    </a>
                </li>


                <li class="sidebar-menu-item {{ open_class('verify_requests,air_time_requests,account_verify_requests,payout_requests') }}">
                    <a class="sidebar-menu-button" data-toggle="collapse" href="#approval_requests">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">done</span>
                        Approval Request
                        <span class="badge badge-primary ml-1">{{$total_request_counts}}</span>
                        <span class="sidebar-menu-toggle-icon"></span>
                    </a>
                    <ul class="sidebar-submenu collapse sm-indent" id="approval_requests">
                        <li class="sidebar-menu-item {{ active_class('verify_requests') }}">
                            <a class="sidebar-menu-button" href="{{route('verify_requests')}}">
                                <span class="fa fa-user-plus sidebar-menu-icon sidebar-menu-icon--left"></span>
                                <span class="sidebar-menu-text">Verify Requests </span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item {{ active_class('air_time_requests') }}">
                            <a class="sidebar-menu-button" href="{{route('air_time_requests')}}">
                                <span class="fa fa-credit-card sidebar-menu-icon sidebar-menu-icon--left"></span>
                                <span class="sidebar-menu-text">Air Time Requests</span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item {{ active_class('account_verify_requests') }}">
                            <a class="sidebar-menu-button" href="{{route('account_verify_requests')}}">
                                <span class="fa fa-address-card sidebar-menu-icon sidebar-menu-icon--left"></span>
                                <span class="sidebar-menu-text">Account Requests</span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item {{ active_class('payout_requests') }}">
                            <a class="sidebar-menu-button" href="{{route('payout_requests')}}">
                                <span class="fa fa-dollar-sign sidebar-menu-icon sidebar-menu-icon--left"></span>
                                <span class="sidebar-menu-text">Payout Requests</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="sidebar-menu-item {{ open_class('admin_messages,chat_logs,explore_chat,admin_email,admin_trend_ai') }}">
                    <a class="sidebar-menu-button" data-toggle="collapse" href="#messaging_menu">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">message</span>
                        Messaging
                        <span class="sidebar-menu-toggle-icon"></span>
                    </a>
                    <ul class="sidebar-submenu collapse sm-indent" id="messaging_menu">
                        <li class="sidebar-menu-item {{ active_class('admin_messages') }}">
                            <a class="sidebar-menu-button " href="{{route('admin_messages')}}">
                                <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">chat</span>
                                <span class="sidebar-menu-text">Chat</span>
                                <span class="sidebar-menu-badge badge badge-accent badge-notifications ml-auto d-none all_unread_messages" ></span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item {{ active_class('admin_email') }}">
                            <a class="sidebar-menu-button" href="{{route('admin_email')}}">
                                <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">email</span>
                                <span class="sidebar-menu-text">Email</span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item {{ active_class('chat_logs,explore_chat') }}">
                            <a class="sidebar-menu-button" href="{{route('chat_logs')}}">
                                <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">feedback</span>
                                <span class="sidebar-menu-text">Chat Logs</span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item {{ active_class('admin_trend_ai') }}">
                            <a class="sidebar-menu-button" href="{{route('admin_trend_ai')}}">
                                <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">computer</span>
                                <span class="sidebar-menu-text">Trend Ai</span>
                            </a>
                        </li>
                    </ul>
                </li>
                @if(auth()->guard('admin')->user()->can('settings') || auth()->guard('admin')->user()->can('view content category') || auth()->guard('admin')->user()->can('view creator category') || auth()->guard('admin')->user()->can('view company type'))
                    <li class="sidebar-menu-item  {{ open_class('email_settings,site_settings,content-categories,content-category.create,content-category.edit,creator-categories,creator-category.create,creator-category.edit,company-types,company-type.create,company-type.edit,notifications,localization') }}">
                        <a class="sidebar-menu-button" data-toggle="collapse" href="#settings">
                            <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">settings</span>
                            Settings
                            <span class="ml-auto sidebar-menu-toggle-icon"></span>
                        </a>
                        <ul class="sidebar-submenu collapse sm-indent" id="settings">
                            @if(auth()->guard('admin')->user()->can('mail setting'))
                                <li class="sidebar-menu-item {{ active_class('email_settings') }}">
                                    <a class="sidebar-menu-button" href="{{route('email_settings')}}">
                                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">email</span>
                                        <span class="sidebar-menu-text">Mail Setting</span>
                                    </a>
                                </li>
                            @endif
                            @if(auth()->guard('admin')->user()->can('site setting'))
                                <li class="sidebar-menu-item {{ active_class('site_settings') }}">
                                    <a class="sidebar-menu-button" href="{{route('site_settings')}}">
                                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">devices</span>
                                        <span class="sidebar-menu-text">Site Setting</span>
                                    </a>
                                </li>
                            @endif
                            @if(auth()->guard('admin')->user()->can('view content category'))
                                <li class="sidebar-menu-item {{ active_class('content-categories,content-category.create,content-category.edit') }}">
                                    <a class="sidebar-menu-button" href="{{route('content-categories')}}">
                                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">dehaze</span>
                                        <span class="sidebar-menu-text">Content Categories</span>
                                    </a>
                                </li>
                            @endif
                            @if(auth()->guard('admin')->user()->can('view creator category'))
                                <li class="sidebar-menu-item {{ active_class('creator-categories,creator-category.create,creator-category.edit') }}">
                                    <a class="sidebar-menu-button" href="{{route('creator-categories')}}">
                                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">computer</span>
                                        <span class="sidebar-menu-text">Creator Categories</span>
                                    </a>
                                </li>
                            @endif
                            @if(auth()->guard('admin')->user()->can('view company type'))
                                <li class="sidebar-menu-item {{ active_class('company-types,company-type.create,company-type.edit') }}">
                                    <a class="sidebar-menu-button" href="{{route('company-types')}}">
                                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">business</span>
                                        <span class="sidebar-menu-text">Company Types</span>
                                    </a>
                                </li>
                            @endif
                            <li class="sidebar-menu-item {{ active_class('api_config') }}">
                                <a class="sidebar-menu-button" href="{{route('api_config')}}">
                                    <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">code</span>
                                    <span class="sidebar-menu-text">API Gateways</span>
                                </a>
                            </li>
                            <li class="sidebar-menu-item {{ active_class('notifications') }}">
                                <a class="sidebar-menu-button" href="{{route('notifications')}}">
                                    <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">notifications</span>
                                    <span class="sidebar-menu-text"> Notifications</span>
                                </a>
                            </li>
                            <li class="sidebar-menu-item {{ active_class('localization') }}">
                                <a class="sidebar-menu-button" href="{{route('localization')}}">
                                    <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">local_activity</span>
                                    <span class="sidebar-menu-text">Localization</span>
                                </a>
                            </li>
{{--                            <li class="sidebar-menu-item">--}}
{{--                                <a class="sidebar-menu-button" href="#">--}}
{{--                                    <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">local_library</span>--}}
{{--                                    <span class="sidebar-menu-text">System Logs</span>--}}
{{--                                </a>--}}
{{--                            </li>--}}
                        </ul>
                    </li>
                @endif
                @if(auth()->guard('admin')->user()->can('view role'))
                    <li class="sidebar-menu-item {{ open_class('roles,roleCreate,roleEdit,permissions,userPermission,assignPermissions,updateRolePermissions') }} {{ active_class('roles,roleCreate,roleEdit,permissions,userPermission,assignPermissions,updateRolePermissions') }}">
                        <a class="sidebar-menu-button" data-toggle="collapse" href="#roles_permission">
                            <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">supervised_user_circle</span>
                            Roles & Permission
                            <span class="ml-auto sidebar-menu-toggle-icon"></span>
                        </a>
                        <ul class="sidebar-submenu collapse sm-indent" id="roles_permission">
                            <li class="sidebar-menu-item {{ active_class('roles,roleCreate,roleEdit,userPermission,assignPermissions,updateRolePermissions') }}">
                                <a class="sidebar-menu-button" href="{{route('roles')}}">
                                    <i class="material-icons  sidebar-menu-icon sidebar-menu-icon--left">group_add</i>
                                    <span class="sidebar-menu-text">Roles</span>
                                </a>
                            </li>
                            <li class="sidebar-menu-item {{ active_class('permissions') }}">
                                <a class="sidebar-menu-button" href="{{ route('permissions') }}">
                                    <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">settings_applications</span>
                                    <span class="sidebar-menu-text"> Permissions</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                @endif
                @if(auth()->guard('admin')->user()->can('view faq'))
                    <li class="sidebar-menu-item {{ active_class('faqs') }}">
                        <a class="sidebar-menu-button" href="{{route('faqs')}}">
                            <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">people_outline</span>
                            <span class="sidebar-menu-text">FAQS</span>
                        </a>
                    </li>
                @endif
                @if(auth()->guard('admin')->user()->can('view legal page'))
                    <li class="sidebar-menu-item ">
                        <a class="sidebar-menu-button" href="{{route('legal-pages')}}">
                            <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">add_link</span>
                            <span class="sidebar-menu-text">Legal Pages</span>
                        </a>
                    </li>
                @endif
            </ul>

        </div>
    </div>
</div>
