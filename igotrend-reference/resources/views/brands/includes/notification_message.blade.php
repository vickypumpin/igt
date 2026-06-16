
<a href="javascript:void(0);" class="list-group-item list-group-item-action">
                                        <span class="d-flex align-items-center mb-1">
                                            <small class="text-black-50">%CREATE_TIME%</small>

                                        </span>
    <span class="d-flex">
                                            <span class="avatar avatar-xs mr-2">
                                                <span class="avatar-title rounded-circle bg-light">
                                                    <i class="material-icons font-size-16pt text-primary">account_circle</i>
                                                </span>
                                            </span>
                                            <span class="flex d-flex flex-column">
                                                <strong class="text-black-100">{{ucwords(auth()->user()->first_name).' '.ucwords(auth()->user()->last_name)}}</strong>
                                                @if($type == 'campaign_request_accepted')
                                                    <span class="text-black-70">Accepted your campaign request.</span>
                                                @endif
                                                @if($type == 'campaign_request_rejected')
                                                    <span class="text-black-70">Rejected your campaign request.</span>
                                                @endif
                                                @if($type == 'campaign_request_send')
                                                    <span class="text-black-70">Send you campaign request.</span>
                                                @endif
                                                @if($type == 'submission_approval')
                                                    <span class="text-black-70">Approves your campaign submission.</span>
                                                @endif
                                                @if($type == 'reject_approval')
                                                    <span class="text-black-70">Reject your campaign submission.</span>
                                                @endif
                                            </span>
                                        </span>
</a>
