
@if($is_admin)
    <a href="{{route('creator_admin_chat',$admin_message->from_user)}}" class="list-group-item list-group-item-action unread">
        @else
            <a href="{{route('chatIndex',$message->from_user)}}" class="list-group-item list-group-item-action unread">
                @endif

                <span class="d-flex align-items-center mb-1">
                                              @if($is_admin)
                        <small class="text-black-50">{{\Illuminate\Support\Carbon::parse($admin_message->created_at)->diffForHumans()}}</small>
                    @else
                        <small class="text-black-50">{{\Illuminate\Support\Carbon::parse($message->created_at)->diffForHumans()}}</small>
                    @endif
                                            <span class="ml-auto unread-indicator bg-accent"></span>

                                        </span>
                <span class="d-flex">
                                            <span class="avatar avatar-xs mr-2">
                                                @if($is_admin)
                                                    <img src="{{get_admin_image($admin_message->from_user)}}" alt="people" class="avatar-img rounded-circle">
                                                @else
                                                    <img src="{{get_user_image($message->from_user)}}" alt="people" class="avatar-img rounded-circle">
                                                @endif
                                            </span>
                                            <span class="flex d-flex flex-column">
                                              @if($is_admin)
                                                    <strong class="text-black-100">{{ucwords($admin_message->admin_from->name)}}</strong>
                                                @else
                                                    <strong class="text-black-100">{{ucwords($message->from->first_name)}} {{ucwords($message->from->last_name)}}</strong>
                                                @endif

                                                @if($is_admin)
                                                    <span class="text-black-70">{{\Illuminate\Support\Str::limit($admin_message->message,30)}}</span>
                                                @else
                                                    <span class="text-black-70">{{\Illuminate\Support\Str::limit($message->message,30)}}</span>
                                                @endif
                                            </span>
                                        </span>
            </a>
