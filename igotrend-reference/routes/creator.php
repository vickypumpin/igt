<?php


use App\Http\Controllers\Creator\AccountController;
use App\Http\Controllers\Creator\AiController;
use App\Http\Controllers\Creator\CampaignController;
use App\Http\Controllers\Creator\DashboardController;
use App\Http\Controllers\Creator\DiscoverController;
use App\Http\Controllers\Creator\FaqController;
use App\Http\Controllers\Creator\MessageController;
use App\Http\Controllers\Creator\PaymentController;

Route::get('/dashboard', [DashboardController::class, 'index'])->name('creatorDashboard');
Route::get( 'get_user_invitations', [DashboardController::class, 'user_invitations'] )->name( 'get_user_invitations' );
Route::get( 'accept_invitation/{invite}', [DashboardController::class, 'accept_invitation'] )->name( 'accept_invitation' );
Route::get( 'decline_invitation/{invite}', [DashboardController::class, 'decline_invitation'] )->name( 'decline_invitation' );

//  account
Route::get('edit_account', [AccountController::class, 'edit_account'])->name('creator_edit_account');
Route::get('edit_social_profile', [AccountController::class, 'edit_social_profile'])->name('edit_social_profile');
Route::post('update_social_profile', [AccountController::class, 'update_social_profile'])->name('update_social_profile');
Route::post('account_update_info/{user}', [AccountController::class, 'account_update_info'])->name('creator_account_update_info');
Route::get('edit_password', [AccountController::class, 'edit_password'])->name('creator_edit_password');
Route::post('account_update_password', [AccountController::class, 'account_update_password'])->name('creator_update_password');
Route::get('billing', [AccountController::class, 'billing'])->name('creator_billing');
Route::post('update_payment_information', [AccountController::class, 'update_payment_information'])->name('update_payment_information');
Route::get('rate_info', [AccountController::class, 'rate_info'])->name('creator_rate_info');

Route::get('/get-countries-states', [AccountController::class, 'getCountriesStates'])->name('creatorGetCountriesStates');
Route::get('discover', [DiscoverController::class, 'discover'])->name('discover');
Route::get('discover_details/{campaign}', [DiscoverController::class, 'discover_details'])->name('discover_details');
Route::get('send-campaign-request/{user}/{campaign}', [DiscoverController::class, 'sendCampaignRequest'])->name('sendCampaignRequest');
Route::get('my-campaigns', [CampaignController::class, 'my_campaigns'])->name('creator_my_campaigns');
Route::get('active-campaigns', [CampaignController::class, 'active_campaigns'])->name('creator_active_campaigns');
Route::get('pending-campaigns', [CampaignController::class, 'pending_campaigns'])->name('creator_pending_campaigns');
Route::get('declined-campaigns', [CampaignController::class, 'declined_campaigns'])->name('creator_declined_campaigns');
Route::get('completed-campaigns', [CampaignController::class, 'completed_campaigns'])->name('creator_completed_campaigns');
Route::get('campaign_details/{campaign}', [CampaignController::class, 'campaign_detail'])->name('creator_campaign_detail');
Route::post('upload_campaign_screenshot/{campaign}', [CampaignController::class, 'upload_campaign_screenshot'])->name('upload_campaign_screenshot');
Route::get('remove_campaign_submission/{submission}', [CampaignController::class, 'remove_campaign_submission'])->name('remove_campaign_submission');
Route::post('update_screenshot_views/{submission}', [CampaignController::class, 'update_screenshot_views'])->name('update_screenshot_views');
Route::post('update_screenshot_likes/{submission}', [CampaignController::class, 'update_screenshot_likes'])->name('update_screenshot_likes');
Route::get('messages', [MessageController::class, 'index'])->name('creator_messages');
Route::get('msg/{receiver}', [MessageController::class, 'chatIndex'])->name('chatIndex');
Route::post('send_msg', [MessageController::class, 'send_msg'])->name('send_msg');
Route::get('admin-msg/{receiver}', [MessageController::class, 'admin_chat'])->name('creator_admin_chat');
Route::post('admin_send_msg', [MessageController::class, 'admin_send_msg'])->name('creator_admin_send_msg');
Route::post('get_unread_messages', [MessageController::class, 'get_unread_messages'])->name('creator_get_unread_messages');
Route::post('get_admin_unread_messages', [MessageController::class, 'get_admin_unread_messages'])->name('creator_get_admin_unread_messages');
Route::get('get_all_unread_messages', [MessageController::class, 'get_all_unread_messages'])->name('creator_get_all_unread_messages');
Route::get('get_user_unread_messages', [MessageController::class, 'get_user_unread_messages'])->name('get_creator_user_unread_messages');
Route::get('get_user_unread_notifications', [MessageController::class, 'user_unread_notifications'])->name('creator_user_unread_notifications');
Route::get('read_all_notifications', [MessageController::class, 'read_all_notifications'])->name('creator_read_all_notifications');


Route::get('payment-history', [PaymentController::class, 'payment_history'])->name('creator_payment_history');
Route::get('reward_detail', [PaymentController::class, 'reward_detail'])->name('creator_reward_detail');
Route::get('invoice-details/{payment}', [PaymentController::class, 'invoice_detail'])->name('creator_invoice_detail');
Route::get('redeem_gems', [PaymentController::class, 'redeem_gems'])->name('redeem_gems');


Route::get('faq', [FaqController::class, 'index'])->name('creator_faq');
Route::post('save/rates', [FaqController::class, 'saveRates'])->name('creator_save_rates');


Route::get('trend_ai', [AiController::class, 'index'])->name('creator_trend_ai');
Route::post('ai_response', [AiController::class, 'ai_response'])->name('creator_ai_response');
