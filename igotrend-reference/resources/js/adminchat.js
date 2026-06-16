

import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    forceTLS: true,
    // authEndpoint: 'http://localhost/igotrend/public/broadcasting/auth'
});

const admin_id = document.querySelector('meta[name="admin-id"]').content;

window.Echo.private("admin-message." + admin_id).listen('UserAdminMessage', (e) => {
    const message = '<div class="d-flex flex-row justify-content-end message">\n' +
        '    <img src="'+e.sender_img_path+'"\n' +
        '         style="width: 35px; height: 100%;">\n' +
        '    <div>\n' +
        '        <p class="small p-2 me-3 mb-1 text-justify fs-13">'+e.message+'</p>\n' +
        '        <p class="small me-3 mb-3 rounded-3 text-muted text-left">'+e.date+'</p>\n' +
        '    </div>\n' +
        '</div>';

    if ($('.message').length === 0){
        $('.no_message_text').addClass('d-none');
    }
    $('.messages_div').append(message);
});
