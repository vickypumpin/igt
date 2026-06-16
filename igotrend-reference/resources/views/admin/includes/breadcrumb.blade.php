<div class="border-bottom-2 py-32pt position-relative z-1">
    <div class="container-fluid page__container d-flex flex-column flex-md-row align-items-center text-center text-sm-left">
        <div class="flex d-flex flex-column flex-sm-row align-items-center mb-24pt mb-md-0">

            <div class="mb-24pt mb-sm-0 mr-sm-24pt">
                <h2 class="mb-0">@yield('page_title')</h2>
                <ol class="breadcrumb p-0 m-0">
                    <li class="breadcrumb-item"><a href="{{route('adminDashboard')}}">Home</a></li>
                    <li class="breadcrumb-item active">
                        @yield('page_route')
                    </li>
                </ol>
            </div>
        </div>
{{--        <div class="row" role="tablist">--}}
{{--            <div class="col-auto d-flex flex-column">--}}
{{--                <h6 class="m-0"><img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex"> 120,987.03</h6>--}}
{{--                <p class="text-50 mb-0 d-flex align-items-center">--}}
{{--                    Expenditure--}}
{{--                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>--}}
{{--                </p>--}}
{{--            </div>--}}
{{--            <div class="col-auto border-left">--}}
{{--                <h6 class="m-0">5 <i class="material-icons text-accent ml-4pt icon-16pt">star</i></h6>--}}
{{--                <p class="text-50 mb-0 d-flex align-items-center">--}}
{{--                    Star--}}
{{--                    <i class="material-icons text-accent ml-4pt icon-16pt">keyboard_arrow_up</i>--}}
{{--                </p>--}}
{{--            </div>--}}

{{--        </div>--}}
    </div>
</div>
