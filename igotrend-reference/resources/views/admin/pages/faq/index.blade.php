@extends('admin.layout.dashboard')
@section('title','FAQS')
@section('page_title','FAQS')
@section('page_route','FAQS')
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                @if(auth()->guard('admin')->user()->can('create faq'))
                    <div class="card-header">
                        <div class="float-right">
                            <a type="button" class="btn btn-accent small" href="{{route('faq.create')}}">
                                <i class="material-icons icon--left">add</i> <small>Add Faq</small>
                            </a>
                        </div>
                    </div>
                @endif
                <div class="card-body">
                    <div class="float-right"></div>
                    <table id="faqsData" class="table-striped table table-borderless">
                        <thead>
                        <tr>
                            <th scope="col">Question</th>
                            <th scope="col">Answer</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
@push("page-scripts")
    <script src="{{asset('js/datatable.js')}}"></script>
    <script>
        $("#faqsData").DataTable({
            serverSide: true,
            processing: true,
            ajax: '{{ route('faqs') }}',
            columns: [
                {data: 'question', name: 'question'},
                {data: 'answer', name: 'answer'},
                {data: 'actions', name: 'actions'}
            ]
        });
    </script>
@endpush
