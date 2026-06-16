@extends('admin.layout.dashboard')
@section('title','Invoice')
@section('page_title','Invoice')
@section('page_route','Invoice')
@section('content')

    <div id="invoice">
        <div class="page-section bg-alt border-bottom-2">
            <div class="container-fluid page__container">
                <div class="row">
                    <div class="col-lg-9">
                        <div class="row">
                            <div class="col-md-6 mb-24pt mb-lg-0">
                                <p class="text-70 mb-0"><strong>Prepared for</strong></p>
                                <h2>{{ucfirst($payment->user->first_name)}} {{ucfirst($payment->user->last_name)}}</h2>
                                <h3>{{ucfirst($payment->user->company_name)}}</h3>
                                @if($payment->user->country && $payment->user->state)
                                    <p class="text-50">{{ucfirst($payment->user->country->name)}}, {{ucfirst($payment->user->state->name)}}</p>
                                @endif
                            </div>
                            <div class="col-md-6">
                                <p class="text-70 mb-0"><strong>Prepared by</strong></p>
                                <h2>IGoTrend.com</h2>
                                <p class="text-50">IGoTrend Communications Limited <br> RC : 1988068</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 text-lg-right d-flex flex-lg-column mb-24pt mb-lg-0 border-bottom border-lg-0 pb-16pt pb-lg-0">
                        <div class="flex">
                            <p class="text-70 mb-8pt"><strong>Invoice</strong></p>
                            <p class="text-50">
                                {{\Illuminate\Support\Carbon::parse($payment->created_at)->format('d M Y')}}<br>
                                {{ $payment->flw_ref }}
                            </p>
                        </div>
                        <div>
                            <button class="btn btn-accent" id="download_invoice"  data-html2canvas-ignore="true">
                                Download <i class="material-icons icon--right">file_download</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid page__container">
            <div class="row">
                <div class="col-lg-9  pr-lg-0" >

                    <div class="page-section" >
                        <h4 class="text-center">Invoice Summary</h4>

                        <div class="card table-responsive mb-24pt">
                            <table class="table table-flush table--elevated">
                                <thead>
                                <tr>
                                    <th>Description</th>
                                    <th style="width: 100px;" class="text-right">Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        @if($payment->campaign)
                                            <p class="mb-0"><strong>Campaign - {{$payment->campaign->name}}</strong></p>
                                            <p> {{$payment->campaign->campaign_users->count()}} Trenders booked
                                            <p class="text-50">For the period of {{\Illuminate\Support\Carbon::parse($payment->campaign->start_date)->format('d M Y')}} to {{\Illuminate\Support\Carbon::parse($payment->campaign->end_date)->format('d M Y')}}</p>
                                        @else
                                            @if($payment->payment_type == "trender_air_time_payment")
                                                <p class="mb-0"><strong>Air Time Payment</strong></p>
                                            @endif
                                            @if($payment->payment_type == "trender_gem_payment")
                                                <p class="mb-0"><strong>Gems Payment</strong></p>
                                            @endif
                                            @if($payment->payment_type == "trender_payout_gem_payment")
                                                <p class="mb-0"><strong>Gems Payment</strong></p>
                                            @endif
                                        @endif
                                    </td>
                                    <td class="text-right"><pre><strong><img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex" width="14" height="14">{{ number_format($payment->amount - $payment->tax_amount,2) }}</strong></pre></td>
                                </tr>
                                </tbody>
                            </table>

                            <table class="table table-flush">
                                <tfoot>
                                <tr>
                                    <td class="text-right text-70"><strong>Tax</strong></td>
                                    <td style="width: 60px;" class="text-right"><pre><strong><img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex" width="14" height="14"> {{ number_format($payment->tax_amount,2) }}</strong></pre></td>
                                </tr>
                                <tr>
                                    <td class="text-right text-70"><strong>Total</strong></td>
                                    <td style="width: 60px;" class="text-right"><pre><strong><img src="{{asset('images/nairalogo.png')}}" alt="N" class="flex" width="14" height="14">{{ number_format($payment->amount,2) }}</strong></pre></td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                </div>
                <div class="col-lg-3 page-nav">
                    <div class="page-section pt-lg-112pt" data-html2canvas-ignore="true">
                        <nav class="nav page-nav__menu">
                            <a class="nav-link active" href="{{route('admin_invoice_detail',$payment)}}">Invoice</a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.js"></script>

    <script>
        window.onload = function() {
            document.getElementById("download_invoice").addEventListener("click", () => {
                const invoice = this.document.getElementById("invoice");

                var opt = {
                    margin: 0,
                    filename: 'invoice.pdf',
                    image: {
                        type: 'jpeg',
                        quality: 0.98
                    },
                    html2canvas: {
                        dpi: 192,
                        letterRendering: true
                    },
                    jsPDF: {
                        unit: 'in',
                        format: 'letter', // Change 'letter' to 'a4' for A4 size
                        orientation: 'portrait'
                    }
                };
                html2pdf().from(invoice).set(opt).save();
            })
        }
    </script>
@endpush
