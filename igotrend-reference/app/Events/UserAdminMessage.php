<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserAdminMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $receiver_id;
    public $sender_img_path;
    public $message;
    public $date;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($receiver_id,$sender_img_path,$message,$date)
    {
        $this->receiver_id = $receiver_id;
        $this->sender_img_path = $sender_img_path;
        $this->message = $message;
        $this->date = $date;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel
     */
    public function broadcastOn()
    {
        return new PrivateChannel('admin-message.'.$this->receiver_id);
    }
}
