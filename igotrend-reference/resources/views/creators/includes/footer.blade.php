<div class="js-fix-footer footer border-top-2">
    <div class="container-fluid page__container page-section d-flex flex-column">
        <p class="text-70 brand mb-24pt">
            <img class="brand-icon" src="{{asset('images/igthomelogo.png')}}" width="" height="32px" alt="IGT">
        </p>
        <p class="measure-lead-max text-muted mb-0 small">IGoTrend connects brands and advertisers to content creators and influencer </p>
    </div>

    <div class="pb-16pt pb-lg-24pt">
        <div class="container-fluid page__container">
            <div class=" rounded page-section py-lg-32pt px-16pt px-lg-24pt">
                <div class="row">
                    <div class="col-md-2 col-sm-4 mb-24pt mb-md-0">
                        <p class="text-70 mb-8pt"><strong>Follow us</strong></p>
                        <nav class="nav nav-black-links nav--flush">
                            <a href="{{$settings->facebook_url}}" class="nav-link mr-8pt"><img src="{{asset('images/facebook.png')}}" width="24" height="24" alt="Facebook"></a>
                            <a href="{{$settings->instagram_url}}" class="nav-link mr-8pt"><img src="{{asset('images/instagram.png')}}" width="24" height="24" alt="Twitter"></a>
                            <a href="{{$settings->youtube_url}}" class="nav-link mr-8pt"><img src="{{asset('images/youtube.png')}}" width="24" height="24" alt="YouTube"></a>
                        </nav>
                    </div>
                    <div class="col-lg text-md-right">
                        @php
                            $pages = App\Models\LegalPage::all();
                        @endphp
                        <p class="mb-8pt d-flex align-items-md-center justify-content-md-end">
                            @foreach($pages as $page)
                                <a href="{{route('page',$page)}}" class="text-70 text-underline mr-16pt">{{$page->name}}</a>
                            @endforeach
                        </p>
                        <p class="text-50 small mb-0">Copyright {{ date('Y') }} &copy; <a href="{{url('/')}}" target="_blank">{{$settings->site_name}}</a>! All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
