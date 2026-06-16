<div class="container">
    <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <nav class="navbar navbar-expand-lg navbar-classic">
                <a class="navbar-primary" href="{{url('/')}}"> <img src="{{asset('images/igthomelogo.png')}}" alt="IGoTrend.Com" width="180px" height="45px"></a>
                <button class="navbar-toggler collapsed" type="button" data-toggle="collapse"
                        data-target="#navbar-classic" aria-controls="navbar-classic" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span class="icon-bar top-bar mt-0"></span>
                    <span class="icon-bar middle-bar"></span>
                    <span class="icon-bar bottom-bar"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbar-classic">
                    <ul class="navbar-nav ml-auto mr-3">
                        <li class="nav-item">
                            <a class="nav-link" href="{{url('/')}}">
                                Home
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{route('brands')}}">
                                Brands | Advertiser
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{route('creators')}}">
                                Influencers | Creators
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{route('services')}}">
                                Services
                            </a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="" id="menu-3" data-toggle="dropdown"
                               aria-haspopup="true" aria-expanded="false">
                                Resources
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="menu-3">
                                <li>
                                    <a class="dropdown-item" href="https://blog.igotrend.com" target="_blank">
                                        Blog
                                    </a>
                                </li>
                                <li><a class="dropdown-item" href="{{route('case_studies')}}">
                                        Case Studies
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="{{route('frontend_faqs')}}">
                                        Help Center
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    @auth
                        <div class="header-btn">
                            @if(auth()->user()->role == \App\Models\User::BRAND)
                                <a href="{{route('brandDashboard')}}" class="btn btn-secondary btn-sm">Dashboard</a>
                            @else
                                <a href="{{route('creatorDashboard')}}" class="btn btn-secondary btn-sm">Dashboard</a>
                            @endif
                            <a href="#" class="btn btn-primary btn-sm" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">Logout</a>

                            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                @csrf
                            </form>
                        </div>
                    @endauth
                    @guest
                        <div class="header-btn">
                            <a href="{{route('login')}}" class="btn btn-secondary btn-sm">Log In</a>
                            <a href="{{route('register')}}" class="btn btn-info btn-sm">Register</a>
                        </div>
                    @endguest
                </div>
            </nav>
        </div>
    </div>
</div>
