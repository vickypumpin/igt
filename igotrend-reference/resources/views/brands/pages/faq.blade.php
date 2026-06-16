@extends('brands.layout.app')
@section('title','FAQ')
@section('page_title','FAQ')
@section('page_route','FAQ')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="container-fluid page__container">
                <div class="row card-group-row mb-lg-8pt">
                    <div class="col-lg card-group-row__col">
                        <div class="card card-group-row__card">
                            <div class="card-header d-flex align-items-center">
                                <strong class="flex">Badges</strong>
                                <strong class="flex">Influencers</strong>
                                <strong class="flex">&nbsp;&nbsp;Creators</strong>
                                <div> <strong>Levels</strong></div>
                            </div>
                            <div class="card-body d-flex flex-column align-items-left justify-content-left">
                                <ul class="list-unstyled list-skills w-55">
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Nano</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>5k - 10k</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>1k - 10k</strong></div>
                                        </div>
                                        <div class="text-70"><strong>1</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Micro</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>10k - 50k</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>10k - 25k</strong></div>
                                        </div>
                                        <div class="text-70"><strong>2</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Mid-tier</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>50k - 500k</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>25k - 100k</strong></div>
                                        </div>
                                        <div class="text-70"><strong>3</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Macro</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>500k - 1M</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>100k - 1M</strong></div>
                                        </div>
                                        <div class="text-70"><strong>4</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Mega</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>1M - 5M</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>1M+ </strong></div>
                                        </div>
                                        <div class="text-70"><strong>5</strong></div>
                                    </li>
                                    <li class="mb-8pt">
                                        <div class="text-50 border-right"><strong>Elite</strong></div>
                                        <div class="flex">
                                            <div class="text-50"><strong>Celebrity</strong></div>
                                        </div>
                                        <div class="flex">
                                            <div class="text-50"><strong>Celebrity</strong></div>
                                        </div>
                                        <div class="text-70"><strong>6</strong></div>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="page-separator"></div>

                <div class="row card-group-row">
                    @foreach($faqs as $faq)
                        <div class="col-md-6 card-group-row__col">

                            <div class="card card--elevated card-group-row__card">
                                <div class="card-body d-flex">
                                    <span class="icon-holder icon-holder--outline-muted rounded-circle d-inline-flex mr-16pt">
                                        <i class="material-icons">question_answer</i>
                                    </span>
                                    <div class="flex">
                                        <a class="card-title mb-4pt" href="">{{$faq->question}}</a>
                                        <p class="text-70 mb-0 text-justify">{{$faq->answer}}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    @endforeach
                </div>

            </div>
        </div>
    </div>
@endsection
