<!-- Header -->
<div class="navbar navbar-expand navbar-shadow px-0  pl-lg-16pt navbar-light bg-body" id="default-navbar" data-primary>

    <!-- Navbar toggler -->
    <button class="navbar-toggler d-block d-lg-none rounded-0" type="button" data-toggle="sidebar">
        <span class="material-icons">menu</span>
    </button>

    <!-- Navbar Brand -->
    <a href="{{url('/')}}" class="navbar-brand mr-16pt d-lg-none">
        <img class="navbar-brand-icon mr-0 mr-lg-8pt" src="{{asset('images/igthomelogo.png')}}" width="104px" alt="IGT">
        <span class="d-none d-lg-block">IGoTrend</span>
    </a>

    <!-- <button class="btn navbar-btn mr-16pt" data-toggle="modal" data-target="#apps">Apps <i class="material-icons">arrow_drop_down</i></button> -->
    <div class="nav navbar-nav flex-nowrap d-none d-lg-flex mr-16pt" style="white-space: nowrap;">
        <h3 class="mb-0">         Influencers & Content Creators</h3>
    </div>
    <div class="flex"></div>

    <div class="nav navbar-nav flex-nowrap d-none d-lg-flex mr-16pt" style="white-space: nowrap;">
{{--        <div class="nav-item dropdown d-none d-sm-flex">--}}
{{--            <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">EN</a>--}}
{{--            <div class="dropdown-menu dropdown-menu-right">--}}
{{--                <div class="dropdown-header"><strong>Select language</strong></div>--}}
{{--                <a class="dropdown-item active" href="">English</a>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--        <div class="nav-item dropdown d-none d-sm-flex">--}}
{{--            <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Naira</a>--}}
{{--            <div class="dropdown-menu dropdown-menu-right">--}}
{{--                <div class="dropdown-header"><strong>Select Currency</strong></div>--}}
{{--                <a class="dropdown-item active" href="">Naira</a>--}}
{{--            </div>--}}
{{--        </div>--}}
    </div>

    <div class="nav navbar-nav flex-nowrap d-flex ml-0 mr-16pt">

        <!-- Notifications dropdown -->
        <div class="nav-item ml-16pt dropdown dropdown-notifications">
            <button class="nav-link btn-flush dropdown-toggle" type="button"
                    data-toggle="dropdown"
                    data-dropdown-disable-document-scroll
                    data-caret="false"
                    id="unread_notification_button"
            >
                <i class="material-icons">notifications</i>
                <span class="badge badge-notifications badge-accent d-none all_unread_notification"></span>
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                <div data-perfect-scrollbar class="position-relative">
                    <div class="dropdown-header d-flex justify-content-between">
                        <strong>System notifications</strong>
                        <span class="read_all_notifications" style="cursor: pointer">Read all</span>
                    </div>
                    <div class="d-flex justify-content-center ">
                        <div class="spinner-border spinner-border-md d-none total_notification_spinner"  role="status">
                            <span class="visually-hidden"></span>
                        </div>
                    </div>
                    <div class="list-group list-group-flush mb-0 total_notifications overflow-auto" style="max-height: 300px">
                        @include('creators.includes.system_notification')
                    </div>
                </div>
            </div>
        </div>
        <!-- // END Notifications dropdown -->


        <!-- Notifications dropdown -->
        <div class="nav-item ml-16pt dropdown dropdown-notifications">
            <button class="nav-link btn-flush dropdown-toggle" type="button" data-toggle="dropdown"
                    data-dropdown-disable-document-scroll
                    data-caret="false"
                    id="unread_messages_button"
            >
                <i class="material-icons ">mail_outline</i>
                <span class="badge badge-notifications badge-accent all_unread_messages"></span>
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                <div data-perfect-scrollbar class="position-relative">
                    <div class="dropdown-header"><strong>Messages</strong></div>
                    <div class="d-flex justify-content-center ">
                        <div class="spinner-border spinner-border-md d-none total_messages_spinner"  role="status">
                            <span class="visually-hidden"></span>
                        </div>
                    </div>
                    <div class="list-group list-group-flush mb-0 total_messages overflow-auto " style="max-height: 300px">
                        @include('creators.includes.message_notification')
                    </div>
                </div>
            </div>
        </div>
        <!-- // END Notifications dropdown -->
    </div>

{{--    <div class="dropdown border-left-2 navbar-border">--}}
{{--        <button class="navbar-toggler navbar-toggler-custom d-block" type="button" data-toggle="dropdown" data-caret="false">--}}
{{--            <span class="material-icons">business_center</span>--}}
{{--        </button>--}}
{{--        <div class="dropdown-menu dropdown-menu-right">--}}
{{--            <div class="dropdown-header"><strong>Account Type</strong></div>--}}
{{--            <a href="" class="dropdown-item active d-flex align-items-center">--}}

{{--                <div class="avatar avatar-sm mr-8pt">--}}

{{--                    <span class="avatar-title rounded bg-primary">B</span>--}}

{{--                </div>--}}

{{--                <small class="ml-4pt flex">--}}
{{--                                <span class="d-flex flex-column">--}}
{{--                                    <strong class="text-black-100">Brands</strong>--}}
{{--                                    <span class="text-black-50">Manufacturing</span>--}}
{{--                                </span>--}}
{{--                </small>--}}
{{--            </a>--}}

{{--        </div>--}}
{{--    </div>--}}

</div>
<!-- // END Header -->
