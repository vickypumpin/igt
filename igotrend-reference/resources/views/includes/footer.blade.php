<div class="footer pt-2">
    <div class="container">
        <div class="row">
            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <!-- footer-widget -->
                <div class="footer-widget">
                    <h3 class="footer-widget-title">
                        Overview
                    </h3>
                    <ul class="list-unstyled">
                        <li><a href="{{route('creators')}}">Influencers | Content Creators</a></li>
                        <li><a href="{{route('brands')}}">Brand | Advertisers</a></li>
                        <li><a href="{{route('services')}}">Managed Service</a></li>
                    </ul>
                </div>
            </div>
            <!-- footer-widget -->
            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div class="footer-widget">
                    <h3 class="footer-widget-title">
                        Company
                    </h3>
                    <ul class="list-unstyled ">
                        <li><a href="/">Home</a></li>
                        <li><a href="/#LearnMore">About Us</a></li>
                        <li><a href="mailto:careers@igotrend.com?subject=Resume!">Careers <span class="badge badge-primary">Hiring</span></a></li>
                        <li><a href="{{url('/contact')}}">Contact</a></li>
                    </ul>
                </div>
            </div>
            <!-- /.footer-widget -->
            <!-- footer-widget -->
            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div class="footer-widget">
                    <h3 class="footer-widget-title">
                        Resources
                    </h3>
                    <ul class="list-unstyled">
                        <li><a href="{{route('frontend_faqs')}}">Help Center</a></li>
                        <li><a href="{{route('case_studies')}}">Case Studies</a></li>
                        <li><a href="https://blog.igotrend.com" target="_blank">Blog</a></li>
                    </ul>
                </div>
            </div>
            <!-- /.footer-widget -->
            <!-- footer-widget -->
            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <div class="footer-widget">
                    <h3 class="footer-widget-title">
                        Connect With Us
                    </h3>
                    <ul class="list-unstyled">
                        <li><a href="https://www.facebook.com/igotrend" target="_blank">Facebook </a></li>
                        <li><a href="https://www.twitter.com/IGoTrendNG" target="_blank">X (Twitter)</a></li>
                        <li><a href="https://www.instagram.com/igotrend" target="_blank">Instagram</a></li>
                        <li><a href="https://www.youtube.com/@igotrend" target="_blank">Youtube</a></li>
                    </ul>
                </div>
            </div>
            <!-- /.footer-widget -->
        </div>
        <div class="row">
            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12">
                <!-- tiny footer section -->
                <div>
                    <p>IGoTrend.com is not affiliated with Instagram, Facebook, Twitter, YouTube, Snapchat, Tiktok or any companies mentioned as users of our product. All other trademarks and copyrights are property of their respective owners.</p>
                </div>
                <div class="tiny-footer">
                    <ul class="list-unstyled">
                        <li>&copy; {{$settings->site_name}}™ {{date('Y')}} - IGoTrend Communications Limited RC : 1988068 </li>
                        @php
                            $pages = \App\Models\LegalPage::all();
                        @endphp
                        @foreach($pages as $page)
                            <li>
                                <a href="{{route('page',$page)}}">{{ucwords($page->name)}}</a>
                            </li>
                        @endforeach
                    </ul>
                </div>
                <!-- tiny footer section -->
            </div>
        </div>
    </div>
</div>
