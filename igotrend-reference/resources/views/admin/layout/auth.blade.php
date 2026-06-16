<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>@yield('title')</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <link href="{{asset('images/igt_ico.ico')}}" rel="icon" />
    <!-- Prevent the demo from appearing in search engines -->
    <meta name="robots" content="noindex">
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700%7COswald:300,400,500,700%7CRoboto:400,500%7CExo+2:600&display=swap" rel="stylesheet">
    <link type="text/css" href="{{asset('css/dashboard.css')}}" rel="stylesheet">

</head>

<body class="layout-app layout-sticky-subnav ">
<div class="preloader">
    <div class="sk-double-bounce">
        <div class="sk-child sk-double-bounce1"></div>
        <div class="sk-child sk-double-bounce2"></div>
    </div>
</div>
<div class="mdk-drawer-layout js-mdk-drawer-layout" data-push data-responsive-width="992px">
    <div class="mdk-drawer-layout__content page-content">
        <!-- Header -->
        <div class="navbar navbar-expand navbar-shadow px-0  pl-lg-16pt navbar-light bg-body" id="default-navbar" data-primary>

            <!-- Navbar toggler -->
            <button class="navbar-toggler d-block d-lg-none rounded-0" type="button" data-toggle="sidebar">
                <span class="material-icons">menu</span>
            </button>

            <!-- Navbar Brand -->
            <a href="{{url('/')}}" class="navbar-brand mr-16pt">
                <img class="navbar-brand-icon mr-0 mr-lg-8pt" src="{{asset('images/igthomelogo.png')}}" width="104px" alt="IGT">
            </a>


            <div class="flex"></div>

            <div class="nav navbar-nav flex-nowrap d-none d-lg-flex mr-16pt" style="white-space: nowrap;">
                <div class="nav-item dropdown d-none d-sm-flex">
                    <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">EN</a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <div class="dropdown-header"><strong>Select language</strong></div>
                        <a class="dropdown-item active" href="">English</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-separator justify-content-center m-0">
            <div class="page-separator__text">@yield('page_header_title')</div>
            <div class="page-separator__bg-top "></div>
        </div>
        <!-- // END Header -->
        @yield('content')
        @include('admin.includes.footer')
    </div>
</div>
<div id="app-settings">
    <app-settings layout-active="app" :layout-location="{'app': 'index.php' }" sidebar-type="light" sidebar-variant="bg-body">
    </app-settings>
</div>
<script src="{{asset('js/dashboard.js')}}"></script>
</body>
</html>
