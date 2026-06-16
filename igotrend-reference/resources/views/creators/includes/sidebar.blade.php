
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



            <div class="sidebar-account mx-16pt mb-16pt dropdown {{show_class('creator_edit_account,creator_billing,creator_payment_history,creator_rate_info')}}">
                <a href="#" class="nav-link d-flex align-items-center dropdown-toggle" data-toggle="dropdown" data-caret="false">
                    <img width="32" height="32" class="rounded-circle mr-8pt" src="{{get_user_image(auth()->user()->id)}}" alt="account" />
                    <span class="flex d-flex flex-column mr-8pt">
                                <span class="text-black-100">{{auth()->user()->first_name}} {{auth()->user()->last_name}}</span>
                        @if(auth()->user()->role == \App\Models\User::BRAND)
                            <small class="text-black-50">Brand</small>
                        @else
                            @if(is_null(auth()->user()->creator_category))
                                <small class="text-black-50">Influencer</small>
                            @else
                                <small class="text-black-50">Creator</small>
                            @endif
                        @endif
                            </span>
                    <i class="material-icons text-black-20 icon-16pt">keyboard_arrow_down</i>
                </a>
                <div class="dropdown-menu dropdown-menu-full dropdown-menu-caret-center">
                    <div class="dropdown-header"><strong><span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">account_circle</span>ACCOUNT</strong></div>
                    <a class="dropdown-item {{active_class('creator_edit_account')}}" href="{{route('creator_edit_account')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">edit</span>
                        Edit Account
                    </a>
                    <a class="dropdown-item {{active_class('creator_billing')}}" href="{{route('creator_billing')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">money</span>
                        Billing
                    </a>
                    <a class="dropdown-item {{active_class('creator_payment_history,creator_rate_info')}}" href="{{route('creator_payment_history')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">payment</span>
                        Payments
                    </a>
                    <a class="dropdown-item" href="#" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">
                            exit_to_app
                        </span>
                        Logout
                    </a>


                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                        @csrf
                    </form>
                    <div class="dropdown-divider"></div>
                </div>
            </div>


            <div class="sidebar-heading">Overview</div>
            <ul class="sidebar-menu">
                <li class="sidebar-menu-item {{active_class('creatorDashboard')}}">
                    <a class="sidebar-menu-button" href="{{route('creatorDashboard')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">insert_chart_outlined</span>
                        <span class="sidebar-menu-text">Dashboard</span>
                    </a>
                </li>
                <li class="sidebar-menu-item {{ open_class('discover,creator_my_campaigns') }}">
                    <a class="sidebar-menu-button" data-toggle="collapse" href="#campaign_mgt">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">donut_large</span>
                        Campaign Mgt
                        <span class="ml-auto sidebar-menu-toggle-icon"></span>
                    </a>
                    <ul class="sidebar-submenu collapse sm-indent" id="campaign_mgt">
                        <li class="sidebar-menu-item  {{active_class('creator_my_campaigns')}}">
                            <a class="sidebar-menu-button" href="{{route('creator_my_campaigns')}}">
                                <span class="fa fa-bullhorn sidebar-menu-icon sidebar-menu-icon--left"></span>
                                <span class="sidebar-menu-text">My Campaigns</span>
                            </a>
                        </li>
                        <li class="sidebar-menu-item  {{active_class('discover')}}">
                            <a class="sidebar-menu-button" href="{{route('discover')}}">
                                <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">search</span>
                                <span class="sidebar-menu-text">Discover Campaigns</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="sidebar-menu-item {{active_class('creator_messages')}}">
                    <a class="sidebar-menu-button" href="{{route('creator_messages')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">message</span>
                        <span class="sidebar-menu-text">Messages</span>
                        <span class="sidebar-menu-badge badge badge-accent badge-notifications ml-auto d-none all_unread_messages" ></span>
                    </a>
                </li>
                <li class="sidebar-menu-item {{active_class('creator_trend_ai')}}">
                    <a class="sidebar-menu-button" href="{{route('creator_trend_ai')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">computer</span>
                        <span class="sidebar-menu-text">Trend Ai</span>
                    </a>
                </li>
                <li class="sidebar-menu-item {{active_class('creator_faq')}}">
                    <a class="sidebar-menu-button" href="{{route('creator_faq')}}">
                        <span class="material-icons sidebar-menu-icon sidebar-menu-icon--left">people_outline</span>
                        <span class="sidebar-menu-text">FAQ</span>
                    </a>
                </li>
                <br>
                <div class="sidebar-heading"><small class="text-black-50">Support Pin:  {{auth()->user()->pin}}</small></div>
            </ul>
            <div class="page-separator"></div>
            @php
                $pages = \App\Models\LegalPage::all();
            @endphp
            <div class="page-separator"></div>
            @foreach($pages as $page)
                <div class="sidebar-heading">
                    <a href="{{route('page',$page)}}" target="_blank">
                        <small class="text-black-50">{{$page->name}}</small>
                    </a>
                </div>
            @endforeach


        </div>
    </div>
</div>
