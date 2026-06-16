@extends('creators.layout.app')
@section('title','Trend Ai')
@section('page_title','Trend Ai - Content and idea generation')
@section('page_route','Home / Trend Ai')
@push('css')
    <style>
        .scroll {
            max-height:300px;
            overflow-y: scroll;
        }
    </style>
@endpush
@section('content')
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="row">
                <div class="col-md-12">
                    <div class="card card-body p-lg-24pt">
                        <div class="mr-3">
                            <span class="h4"><b>Free Chat Gpt Ai</b></span> - Generate campaign ideas, contents , captions and many more !  
                        </div>
                        <br>
                        <div class="mr-3">
                            Inputs are fully moderated; to report or flag offensive content, Go to the message center and contact our administrator.
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 text-center" id="ask_question">

                        </div>
                    </div>
                    <div class="card card-body text-center">
                        <div class="row">
                            <div class="col-md-12 text-center">
                                <div class="spinner-border d-none" id="spinner" role="status">
                                    <span class="visually-hidden"></span>
                                </div>
                            </div>
                            <div class="col-md-12 text-center px-3 scroll">
                                <div class="chat_gpt_res">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex mb-4">
                        <div class="flex">
                            <form method="post" action="{{route('creator_ai_response')}}" class="ajax-form">
                                @csrf
                                <div class="form-group">
                                    <textarea class="form-control"
                                              name="message"
                                              id="message"
                                              rows="3"
                                              required
                                              placeholder="Message"></textarea>
                                </div>
                                <button type="submit" class="btn btn-accent post_message">Send</button>
                                <button type="reset" class="btn btn-secondary">Clear</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script>
        $(".ajax-form").on("submit", function (e) {
            e.preventDefault();
            let current_url = $(this).attr("action");
            let submit_btn = $(this).find("button[type=submit]");
            let request_type = $(this).attr("method");
            let payload = $(this).serializeArray();
            $(this).find("textarea,button").attr("disabled", true);
            $.ajax({
                url: current_url,
                type: request_type,
                data: payload,
                beforeSend: () => {
                    BtnLoading(submit_btn)
                    $('#spinner').removeClass('d-none');
                    $('.chat_gpt_res').empty();
                    $('#ask_question').empty();
                },
                success: (data) => {
                    BtnReset(submit_btn)
                    $(this).find("textarea,button").attr("disabled", false);
                    $('#spinner').addClass('d-none');
                    if(data.status === true){
                        $('.chat_gpt_res').html(data.message_response);
                        $('#ask_question').html(data.ask_question);
                        $('#message').val('');
                    }else {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top',
                            showConfirmButton: false,
                            timer: 2500,
                            timerProgressBar: true,
                        });

                        Toast.fire({
                            icon: 'error',
                            title: data.message_response
                        })
                    }
                }
            });
            function BtnLoading(elem) {
                $(elem).attr("data-original-text", $(elem).html());
                $(elem).prop("disabled", true);
                $(elem).html('<i class="spinner-border spinner-border-sm mr-2"></i> Sending...');
            }
            function BtnReset(elem) {
                $(elem).prop("disabled", false);
                $(elem).html($(elem).attr("data-original-text"));
            }
        });
    </script>
@endpush
