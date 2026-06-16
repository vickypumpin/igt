<?php

use App\Http\Controllers\Brand\AccountController;
use App\Http\Controllers\Brand\AiController;
use App\Http\Controllers\Brand\CampaignController;
use App\Http\Controllers\Brand\DashboardController;
use App\Http\Controllers\Brand\FaqController;
use App\Http\Controllers\Brand\FlutterWaveController;
use App\Http\Controllers\Brand\MessageController;
use App\Http\Controllers\Brand\PaymentController;
use App\Http\Controllers\Brand\ReportController;
use App\Http\Controllers\Brand\RewardController;
use App\Http\Controllers\Brand\TrenderController;

Route::get('/dashboard', [DashboardController::class, 'index'])->name('brandDashboard');

//  account
Route::get('edit_account', [AccountController::class, 'edit_account'])->name('brand_edit_account');
Route::post('account_update_info/{user}', [AccountController::class, 'account_update_info'])->name('brand_account_update_info');
Route::get('edit_password', [AccountController::class, 'edit_password'])->name('brand_edit_password');
Route::post('account_update_password', [AccountController::class, 'account_update_password'])->name('brand_update_password');

Route::get('/get-countries-states', [AccountController::class, 'getCountriesStates'])->name('getCountriesStates');
Route::get('/my-campaigns', [CampaignController::class, 'my_campaigns'])->name('my_campaigns');
Route::get( 'active_campaigns', [CampaignController::class, 'active_campaigns'] )->name( 'brand_active_campaigns' );
Route::get( 'pending_campaigns', [CampaignController::class, 'pending_campaigns'] )->name( 'brand_pending_campaigns' );
Route::get( 'declined_campaigns', [CampaignController::class, 'declined_campaigns'] )->name( 'brand_declined_campaigns' );
Route::get( 'complete_campaigns', [CampaignController::class, 'completed_campaigns'] )->name( 'brand_completed_campaigns' );
Route::get('/create-campaign', [CampaignController::class, 'create_campaign'])->name('create_campaign');
Route::post('create-campaign-save', [CampaignController::class, 'create_campaign_save'])->name('create_campaign_save');
Route::get('/campaign-brief/{campaign}', [CampaignController::class, 'campaign_brief'])->name('campaign_brief');
Route::post('/campaign-brief-save/{campaign}', [CampaignController::class, 'campaign_brief_save'])->name('campaign_brief_save');
Route::get('/add-trenders/{campaign}', [CampaignController::class, 'add_trenders'])->name('add_trenders');
Route::post('/add-trenders-save/{campaign}', [CampaignController::class, 'add_trenders_save'])->name('add_trenders_save');
Route::get('/review-payment/{campaign}', [CampaignController::class, 'review_payment'])->name('review_payment');
Route::get('/delete-campaign/{campaign}', [CampaignController::class, 'deleteCampaign'])->name('deleteCampaign');
Route::get('/disable-campaign/{campaign}', [CampaignController::class, 'disableCampaign'])->name('disableCampaign');
Route::get('/enable-campaign/{campaign}', [CampaignController::class, 'enableCampaign'])->name('enableCampaign');
Route::get( 'campaign-detail/{campaign}', [CampaignController::class, 'campaign_detail'] )->name( 'campaign_detail' );
Route::get('edit-campaign/{campaign}', [CampaignController::class, 'edit_campaign'])->name('edit_campaign');
Route::post('update-campaign/{campaign}', [CampaignController::class, 'update_campaign'])->name('update_campaign');
Route::get( 'campaign-complete/{campaign}', [CampaignController::class, 'campaign_complete'] )->name( 'brand_campaign_complete' );
Route::get( 'trenders-invites-request', [CampaignController::class, 'trenderInvitesRequest'] )->name( 'trenderInvitesRequest' );
Route::get( 'accept_trender_invitation/{invite}', [CampaignController::class, 'accept_trender_invitation'] )->name( 'accept_trender_invitation' );


Route::get( 'decline_trender_invitation/{invite}', [CampaignController::class, 'decline_trender_invitation'] )->name( 'decline_trender_invitation' );

Route::get('get-user-info/{user}/{campaign}', [TrenderController::class, 'getUserInfo'])->name('getUserInfo');
Route::get('get-trender-info/{user}', [TrenderController::class, 'getTrenderInfo'])->name('getTrenderInfo');
Route::get('add-campaign-user/{user}/{campaign}', [TrenderController::class, 'addCampaignUser'])->name('addCampaignUser');
Route::post('hire_trender/{user}', [TrenderController::class, 'hire_trender'])->name('hire_trender');
Route::get('remove-campaign-user/{user}/{campaign}', [TrenderController::class, 'removeCampaignUser'])->name('removeCampaignUser');


Route::post('pay-campaign/{campaign}', [FlutterWaveController::class, 'initialize'])->name('pay-campaign');
Route::get('/success-campaign-payment', [FlutterWaveController::class, 'callback'])->name('success-campaign-payment');
Route::get('payment-confirmation', [FlutterWaveController::class, 'success'])->name('payment_confirmation');

Route::get('pay-trender/{invite}', [FlutterWaveController::class, 'payTrender'])->name('payTrender');
Route::get('/success-trender-payment', [FlutterWaveController::class, 'trenderPaymentSuccess'])->name('trenderPaymentSuccess');
Route::get('/success-trender-gem-payment', [FlutterWaveController::class, 'GemPaymentSuccess'])->name('trenderGemPaymentSuccess');
Route::get('/success-trender-air-time-payment', [FlutterWaveController::class, 'AirTimePaymentSuccess'])->name('trenderAirTimePaymentSuccess');


Route::get('payment-history', [PaymentController::class, 'payment_history'])->name('payment_history');
Route::get('invoice-details/{payment}', [PaymentController::class, 'invoice_detail'])->name('invoice_detail');
Route::get('billing', [PaymentController::class, 'billing'])->name('brand_billing');
Route::get('reward_detail', [PaymentController::class, 'reward_detail'])->name('brand_reward_detail');


Route::get('messages', [MessageController::class, 'index'])->name('brand_messages');
Route::get('msg/{receiver}', [MessageController::class, 'chatIndex'])->name('brandChatIndex');
Route::post('send_msg', [MessageController::class, 'send_msg'])->name('brand_send_msg');
Route::get('admin-msg/{receiver}', [MessageController::class, 'admin_chat'])->name('brand_admin_chat');
Route::post('admin_send_msg', [MessageController::class, 'admin_send_msg'])->name('brand_admin_send_msg');
Route::post('get_unread_messages', [MessageController::class, 'get_unread_messages'])->name('get_unread_messages');
Route::post('get_admin_unread_messages', [MessageController::class, 'get_admin_unread_messages'])->name('get_admin_unread_messages');
Route::get('get_all_unread_messages', [MessageController::class, 'get_all_unread_messages'])->name('get_all_unread_messages');
Route::get('get_user_unread_messages', [MessageController::class, 'get_user_unread_messages'])->name('get_user_unread_messages');
Route::get('get_user_unread_notifications', [MessageController::class, 'user_unread_notifications'])->name('get_user_unread_notifications');
Route::get('read_all_notifications', [MessageController::class, 'read_all_notifications'])->name('read_all_notifications');


Route::get('reports', [ReportController::class, 'reports'])->name('reports');
Route::post('approve_submission/{submission}', [ReportController::class, 'approve_submission'])->name('approve_submission');
Route::post('reject_submission/{submission}', [ReportController::class, 'reject_submission'])->name('reject_submission');
Route::post('submit_review', [ReportController::class, 'submit_review'])->name('submit_review');
Route::get('campaign_report/{campaign_id}', [ReportController::class, 'campaign_report'])->name('campaign_report');


Route::get('faq', [FaqController::class, 'index'])->name('brand_faq');
Route::get('reward-contacts', [RewardController::class, 'reward'])->name('brand_reward_contacts');
Route::post('pay-reward', [RewardController::class, 'pay_reward'])->name('pay_reward');
Route::get('get-reward-data', [RewardController::class, 'get_reward_data'])->name('brand_get_reward_data');
Route::get('get-brand-campaign-users/{campaign}', [RewardController::class, 'get_brand_campaign_users'])->name('get_brand_campaign_users');

Route::get('trend_ai', [AiController::class, 'index'])->name('brand_trend_ai');
Route::post('ai_response', [AiController::class, 'ai_response'])->name('brand_ai_response');
