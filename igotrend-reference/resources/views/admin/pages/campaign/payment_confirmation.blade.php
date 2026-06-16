@extends('admin.layout.dashboard')
@section('title',' confirmation')
@section('page_title','Campaign Confirmation')
@section('page_route','Campaign / Campaign Confirmation')
@section('content')
    <div class="container-fluid page__container">
        <div class="row">
            <div class="col-lg-9 pr-lg-0">
                <div class="page-section">
                    <div class="col-lg-12 col-sm-6 card-group-row__col">
                        <div class="card card-group-row__card text-center o-hidden mb-0">
                            <div class="card-body d-flex flex-column">
                                <div class="flex-grow mb-16pt">
                                    <div class="avatar avatar-xxl mr-6">
                                        <img src="{{asset('images/celebration.jpg')}}" alt="Avatar" class="avatar-img rounded-circle">
                                    </div>
                                    <h4 class="mb-8pt text-primary">Confirmation: <strong>Success!</strong></h4>
                                </div>
                            </div>
                            <div class="card-footer">
                                <a href="{{route('manage_create_campaign')}}" class="btn btn-outline-secondary">Start New Campaign</a>
                            </div>
                        </div>

                    </div>

                </div>


            </div>
            <div class="col-lg-3 page-nav">
                <div class="page-section pt-lg-112pt">
                    <nav class="nav page-nav__menu">
                        <a class="nav-link" href="{{route('manage_admin_campaigns')}}">View Campaigns</a>
                    </nav>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')

@endpush
