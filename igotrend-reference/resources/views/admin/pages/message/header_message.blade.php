
<a href="{{route('adminChatIndex',$message->from_user)}}" class="list-group-item list-group-item-action unread">
        <span class="d-flex align-items-center mb-1">
                <small class="text-black-50">{{\Illuminate\Support\Carbon::parse($message->created_at)->diffForHumans()}}</small>
                      <span class="ml-auto unread-indicator bg-accent"></span>
        </span>
        <span class="d-flex">
                <span class="avatar avatar-xs mr-2">
                        <img src="{{get_user_image($message->from_user)}}" alt="people" class="avatar-img rounded-circle">
                </span>
                <span class="flex d-flex flex-column">
                        <strong class="text-black-100">{{ucwords($message->user_from->first_name)}} {{ucwords($message->user_from->last_name)}}</strong>
                        <span class="text-black-70">{{\Illuminate\Support\Str::limit($message->message,30)}}</span>
                </span>
        </span>
</a>
