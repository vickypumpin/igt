
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="IGoTrend.com is the #1 influencer marketing platform which conducts campaigns in Africa using digital influencers and content creators">
    <meta name="keywords" content="influencer,content creators,youtubers,facebookers,instagram,snap chat,tiktok,twitter,campaign ">
    <title>@yield('title')</title>
    <link href="{{asset('images/igt_ico.ico')}}" rel="icon" />
    <!-- Theme CSS -->
    <link rel="stylesheet" href="{{asset('css/theme.min.css')}}">
    @stack('css')

    <style type="text/css">
        a:not(:last-of-type) {
            margin-right: 5px;
        }
        *{
            box-sizing: border-box;
        }
        .v-div{
            height:100vh;
            display:flex;
            align-items:center;
            color:#fff;
            overflow:hidden;
            position:relative;
        }
        .pumpin{
            max-width:820px;
            padding-left:1rem;
            padding-right:1rem;
            margin:auto;
            text-align:center;
            overflow:hidden;
        }
        .fullscreen-video-wrap{
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100vh;
            overflow:hidden;
        }
        .fullscreen-video-wrap video{
            min-height:100%;
            min-width:100%;
        }
        .div-content{
            z-index:2;
        }
        #photos {
            /* Prevent vertical gaps */
            line-height: 0;
            -webkit-column-count: 5;
            -webkit-column-gap:   0;
            -moz-column-count:    5;
            -moz-column-gap:      0;
            column-count:         5;
            column-gap:           0;
        }
        @media(max-width:920px){
            .pumpinv{
                background: url({{asset('images/servpic2.png')}});
                background-repeat:no-repeat;
                background-size: cover;
                padding-right:3rem;
                padding-left:3rem;
                background-position:center;
            }
            #homevid {
                display: none;
            }
        }
        @media(max-width:767px){
            .pumpinv{
                background: url({{asset('images/pexe.jpg')}});
                background-repeat:no-repeat;
                background-size: cover;
                padding-right:3rem;
                padding-left:3rem;
                background-position:center;
            }
            #homevid {
                display: none;
            }
        }
        @media(max-width:480px){
            .pumpinv{
                background: url({{asset('images/pa_poster.jpg')}});
                background-repeat:no-repeat;
                background-size: cover;
                padding-right:3rem;
                padding-left:3rem;
                background-position:center;
            }
            #homevid {
                display: none;
            }
        }
    </style>
</head>

<body>
<div class="preloader">
    <div class="lds-ripple">
        <div class="lds-pos"></div>
        <div class="lds-pos"></div>
    </div>
</div>

<!-- header start -->
<div class="header-classic">
    @include('includes.header')
</div>

@yield('content')


@include('includes.footer')

</body>

<script src="{{asset('js/theme.js')}}"></script>

@stack('js')

<!--Start of Tawk.to Script  -->
<script type="text/javascript">
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/5faccb670a68960861be44e4/1emtjb42a';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
    })();
</script>

