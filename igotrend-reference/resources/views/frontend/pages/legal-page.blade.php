@extends('layouts.app')
@section('title',ucwords($legal_page->name))
@push('cs')
@endpush
@section('content')
    <div class="pageheader bg-shape" style="background: linear-gradient(270deg, purple 0%, red 101.08%), #66bbf3; background-size: cover;">
        <div class="container">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <!-- pagecaption start -->
                    <div class="page-caption">
                        <div class="page-caption-para-text">
                            <h1 class="page-caption-title">{{ucwords($legal_page->name)}}</h1>
                            <p class="page-caption-para-text">{{$legal_page->description}}.</p>
                        </div>
                    </div>
                    <!-- pagecaption close -->
                </div>
            </div>
        </div>

    </div>

    <!-- pageheader close -->
    <div class="mt-n8 bg-shape">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-12">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <div class="py-xl-12 py-8  text-center" data-aos="fade-up ">
                                <h2>IGoTrend {{ucwords($legal_page->name)}}</h2>
                                <div class="mb-8">
                                    <p>{!! $legal_page->content !!}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
