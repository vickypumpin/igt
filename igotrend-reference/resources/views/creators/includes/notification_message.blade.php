
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
                                                @if($type == 'accept_campaign_invite')
                                                    <span class="text-black-70">Accepted your campaign invite.</span>
                                                @endif
                                                @if($type == 'reject_campaign_invite')
                                                    <span class="text-black-70">Rejected your campaign invite.</span>
                                                @endif
                                                @if($type == 'campaign_submission')
                                                    <span class="text-black-70">Submitted your campaign submission.</span>
                                                @endif
                                                @if($type == 'campaign_request')
                                                    <span class="text-black-70">Send you campaign request.</span>
                                                @endif
                                            </span>
                                        </span>
</a>
