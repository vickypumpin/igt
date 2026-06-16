<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    @yield('meta')
    <title>@yield('title')</title>
    @if($settings->site_description)
        <meta name="description" content="{{$settings->site_description}}">
    @endif
    @if($settings->seo_tags)
        <meta name="keywords" content="{{$settings->seo_tags}}">
    @endif
    @if($settings->site_favicon)
        <link rel="icon"  href="{{asset('/storage/favicon/'.$settings->site_favicon)}}">
    @else
        <link href="{{asset('images/igt_ico.ico')}}" rel="icon" />
    @endif
    <!-- Prevent the demo from appearing in search engines -->
    <meta name="robots" content="noindex">
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700%7COswald:300,400,500,700%7CRoboto:400,500%7CExo+2:600&display=swap" rel="stylesheet">
    <link type="text/css" href="{{asset('css/dashboard.css')}}" rel="stylesheet">
    @stack('css')
</head>

<body class="layout-boxed layout-sticky-subnav ">
<div class="preloader">
    <div class="sk-double-bounce">
        <div class="sk-child sk-double-bounce1"></div>
        <div class="sk-child sk-double-bounce2"></div>
    </div>
</div>
<div class="mdk-drawer-layout js-mdk-drawer-layout" data-push data-responsive-width="992px">
    <div class="mdk-drawer-layout__content page-content">
        @include('brands.includes.header')
        @include('brands.includes.breadcrumb')
        @yield('content')
        @include('brands.includes.footer')
    </div>
    @include('brands.includes.sidebar')
</div>
<div id="app-settings">
    <app-settings layout-active="app" :layout-location="{'app': 'index.php' }" sidebar-type="light" sidebar-variant="bg-body">
    </app-settings>
</div>
<script src="{{asset('js/dashboard.js')}}"></script>
<script src="{{asset('js/sweetalert.js')}}"></script>

@include('brands.includes.messages')
@stack('page-scripts')
<script>
    $("#unread_messages_button").on("click", function() {
        $('.total_messages').html('');
        $('.total_messages_spinner').removeClass('d-none');
        $.ajax({
            url: '{{route('get_user_unread_messages')}}',
            type: "GET",
            success: function (data) {
                if(data.status){
                    if(data.messages == null){
                        $('.total_messages_spinner').addClass('d-none');
                        $('.total_messages').html('<div class="text-center text-info mt-2">No Unread Messages Found</div>');
                    }else {
                        $('.total_messages_spinner').addClass('d-none');
                        $('.total_messages').html(data.messages);
                    }
                }
            }
        });
    });
    $("#unread_notification_button").on("click", function() {
        $('.total_notifications').html('');
        $('.total_notification_spinner').removeClass('d-none');
        $.ajax({
            url: '{{route('get_user_unread_notifications')}}',
            type: "GET",
            success: function (data) {
                if(data.status){
                    if(data.notifications === 0){
                        $('.total_notification_spinner').addClass('d-none');
                        $('.total_notifications').html('<div class="text-center text-info mt-2">No Unread Notification Found</div>');
                    }else {
                        $('.total_notification_spinner').addClass('d-none');
                        $('.total_notifications').html(data.notifications_html);
                    }
                }
            }
        });
    });
    $(".read_all_notifications").on("click", function(e) {
        e.stopPropagation();
        $('.total_notifications').html('');
        $('.total_notification_spinner').removeClass('d-none');
        $.ajax({
            url: '{{route('read_all_notifications')}}',
            type: "GET",
            success: function (data) {
                if(data.status){
                    $('.total_notification_spinner').addClass('d-none');
                }
            }
        });
    });
</script>
<script>
    setInterval(function() {
        $.ajax({
            url: '{{route('get_all_unread_messages')}}',
            type: "GET",
            success: function (data) {
                if(data.status){
                    //    messages
                    if($('.all_unread_messages').hasClass('d-none')){
                        if(data.count_message > 0){
                            $('.all_unread_messages').text(data.count_message)
                            $('.all_unread_messages').removeClass('d-none')
                        }else {
                            if(data.count_message === 0){
                                if(!$('.all_unread_messages').hasClass('d-none')){
                                    $('#all_unread_messages').addClass('d-none')
                                }
                            }
                        }
                    }else {
                        if(data.count_message === 0){
                            if(!$('.all_unread_messages').hasClass('d-none')){
                                $('.all_unread_messages').addClass('d-none')
                            }
                        }else {
                            $('.all_unread_messages').text(data.count_message)
                        }
                    }
                }

            //    notifications
                if($('.all_unread_notification').hasClass('d-none')){
                    if(data.count_notifications > 0){
                        $('.all_unread_notification').text(data.count_notifications)
                        $('.all_unread_notification').removeClass('d-none')
                    }else {
                        if(data.count_message === 0){
                            if(!$('.all_unread_notification').hasClass('d-none')){
                                $('#all_unread_notification').addClass('d-none')
                            }
                        }
                    }
                } else {
                    if(data.count_notifications === 0){
                        if(!$('.all_unread_notification').hasClass('d-none')){
                            $('.all_unread_notification').addClass('d-none')
                        }
                    }else {
                        $('.all_unread_notification').text(data.count_notifications)
                    }
                }
            }
        });
    }, 3000);
</script>
</body>
</html>
