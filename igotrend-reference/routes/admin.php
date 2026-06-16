<?php

//auth routes
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AiController;
use App\Http\Controllers\Admin\Auth\ForgotPasswordController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\Auth\ResetPasswordController;
use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\CompanyTypeController;
use App\Http\Controllers\Admin\ContentCategoryController;
use App\Http\Controllers\Admin\CreatorCategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmailController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\FlutterWaveController;
use App\Http\Controllers\Admin\LegalPageController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\RewardController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VerifyRequestController;
use Illuminate\Support\Facades\Route;

Route::get( '/login', [LoginController::class, 'index'] )->name( 'adminLogin' );
Route::post( '/login', [LoginController::class, 'login'] )->name( 'adminLogin' );
Route::get( '/logout', [LoginController::class, 'logout'] )->name( 'adminLogout' );
Route::get( '/password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'] )->name( 'adminPasswordRequest' );
Route::post( '/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'] )->name( 'adminPasswordEmail' );
Route::get( '/password/reset/{token}', [ResetPasswordController::class, 'showResetForm'] )->name( 'adminPasswordReset' );
Route::post( '/password/update', [ResetPasswordController::class, 'reset'] )->name( 'adminPasswordUpdate' );

Route::middleware(['adminAuth'])->group(function () {

    Route::get( 'dashboard', [DashboardController::class, 'index'] )->name( 'adminDashboard' );
    // role Routes
    Route::get( 'roles', [RoleController::class, 'index'] )->name( 'roles' )->middleware('permission:view role,admin');
    Route::get( 'role/create', [RoleController::class, 'create'] )->name( 'roleCreate' )->middleware('permission:create role,admin');
    Route::post( 'role/add', [RoleController::class, 'store'] )->name( 'roleAdd' );
    Route::get( 'role/delete/{role}', [RoleController::class, 'destroy'] )->name( 'roleDelete' )->middleware('permission:delete role,admin');
    Route::get( 'role/edit/{role}', [RoleController::class, 'edit'] )->name( 'roleEdit' )->middleware('permission:update role,admin');
    Route::post( 'role/update/{role}', [RoleController::class, 'update'] )->name( 'roleUpdate' );

    // Permission Routes
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions');
    Route::get('permission/{role}', [PermissionController::class, 'permissions'])->name('userPermission');
    Route::post('assign-permissions/{role}', [PermissionController::class, 'assignPermissions'])->name('assignPermissions');
    Route::post('update-role-permissions/{role}', [PermissionController::class, 'updateRolePermissions'])->name('updateRolePermissions');

    // staff Routes
    Route::get('staffs', [StaffController::class, 'index'])->name('staffs')->middleware('permission:view staff,admin');
    Route::get('staff/create', [StaffController::class, 'create'])->name('staff.create')->middleware('permission:create staff,admin');
    Route::post('staff/store', [StaffController::class, 'store'])->name('staff.store');
    Route::get('staff/delete/{staff}', [StaffController::class, 'destroy'])->name('staff.destroy')->middleware('permission:delete staff,admin');
    Route::get('staff/edit/{staff}', [StaffController::class, 'edit'])->name('staff.edit')->middleware('permission:update staff,admin');
    Route::post('staff/update-profile-info/{staff}', [StaffController::class, 'updateProfileInfo'])->name('staff.update-profile-info');
    Route::post('staff/update-password/{staff}', [StaffController::class, 'updatePassword'])->name('staff.update-password');

    //  account
    Route::get('edit_account', [AccountController::class, 'edit_account'])->name('admin_edit_account');
    Route::post('account_update_info/{admin}', [AccountController::class, 'account_update_info'])->name('admin_account_update_info');
    Route::get('edit_password', [AccountController::class, 'edit_password'])->name('admin_edit_password');
    Route::post('account_update_password', [AccountController::class, 'account_update_password'])->name('admin_account_update_password');


    Route::get( 'site-settings', [SettingController::class, 'site_setting'] )->name( 'site_settings' )->middleware('permission:site setting,admin');
    Route::post( 'site-settings-update', [SettingController::class, 'site_setting_update'] )->name( 'site_settings.update' );
    Route::get( 'email-settings', [SettingController::class, 'email'] )->name( 'email_settings' )->middleware('permission:mail setting,admin');
    Route::post( 'email-settings-update', [SettingController::class, 'emailUpdate'] )->name( 'email.settings.update' );

    // staff Routes
    Route::get('content-categories', [ContentCategoryController::class, 'index'])->name('content-categories');
    Route::get('content-category/create', [ContentCategoryController::class, 'create'])->name('content-category.create');
    Route::post('content-category/store', [ContentCategoryController::class, 'store'])->name('content-category.store');
    Route::get('content-category/delete/{content_category}', [ContentCategoryController::class, 'destroy'])->name('content-category.destroy');
    Route::get('content-category/edit/{content_category}', [ContentCategoryController::class, 'edit'])->name('content-category.edit');
    Route::post('content-category/update/{content_category}', [ContentCategoryController::class, 'update'])->name('content-category.update');

    // staff Routes
    Route::get('creator-categories', [CreatorCategoryController::class, 'index'])->name('creator-categories');
    Route::get('creator-category/create', [CreatorCategoryController::class, 'create'])->name('creator-category.create');
    Route::post('creator-category/store', [CreatorCategoryController::class, 'store'])->name('creator-category.store');
    Route::get('creator-category/delete/{creator_category}', [CreatorCategoryController::class, 'destroy'])->name('creator-category.destroy');
    Route::get('creator-category/edit/{creator_category}', [CreatorCategoryController::class, 'edit'])->name('creator-category.edit');
    Route::post('creator-category/update/{creator_category}', [CreatorCategoryController::class, 'update'])->name('creator-category.update');

    // staff Routes
    Route::get('company-types', [CompanyTypeController::class, 'index'])->name('company-types');
    Route::get('company-type/create', [CompanyTypeController::class, 'create'])->name('company-type.create');
    Route::post('company-type/store', [CompanyTypeController::class, 'store'])->name('company-type.store');
    Route::get('company-type/delete/{type}', [CompanyTypeController::class, 'destroy'])->name('company-type.destroy');
    Route::get('company-type/edit/{type}', [CompanyTypeController::class, 'edit'])->name('company-type.edit');
    Route::post('company-type/update/{type}', [CompanyTypeController::class, 'update'])->name('company-type.update');

//    users
    Route::get('manage/users', [UserController::class, 'index'])->name('manage-users');
    Route::get('get-brand-users', [UserController::class, 'brandUsers'])->name('brandUsers');
    Route::get('get-creator-users', [UserController::class, 'creatorUsers'])->name('creatorUsers');
    Route::get('get-trashed-users', [UserController::class, 'trashedUsers'])->name('trashedUsers');
    Route::get('user/active/{user}', [UserController::class, 'changeActiveStatus'])->name('user-active');
    Route::get('user/lock/{user}', [UserController::class, 'changeLockedStatus'])->name('user-lock');
    Route::get('user/delete/{user}', [UserController::class, 'userDelete'])->name('user-delete');
    Route::get('user/restore/{user}', [UserController::class, 'userRestore'])->name('user-restore');
    Route::get('user/restore/{user}', [UserController::class, 'userRestore'])->name('user-restore');
    Route::get('user-account-info/{user}', [UserController::class, 'userAccountInfo'])->name('userAccountInfo');
    Route::get('user-social-profile/{user}', [UserController::class, 'userSocialProfile'])->name('userSocialProfile');
    Route::post('user-social-profile-update/{user}', [UserController::class, 'userSocialProfileUpdate'])->name('userSocialProfileUpdate');
    Route::post('user_update_info/{user}', [UserController::class, 'userUpdateInfo'])->name('userUpdateInfo');
    Route::get('user-account-password/{user}', [UserController::class, 'userAccountPassword'])->name('user-password');
    Route::post('user-update-password/{user}', [UserController::class, 'userUpdatePassword'])->name('user-password-update');

    // legal pages
    Route::get( 'legal-pages', [LegalPageController::class, 'index'] )->name( 'legal-pages');
    Route::get( 'legal-page/create', [LegalPageController::class, 'create'] )->name( 'legal-page.create');
    Route::post( 'legal-page/save', [LegalPageController::class, 'save'] )->name( 'legal-page.store');
    Route::get( 'legal-page/edit/{page}', [LegalPageController::class, 'edit'] )->name( 'legal-page.edit');
    Route::post( 'legal-page/update/{page}', [LegalPageController::class, 'update'] )->name( 'legal-page.update');
    Route::get( 'legal-page/delete/{page}', [LegalPageController::class, 'delete'] )->name( 'legal-page.destroy');

    //manage campaign
    Route::get( 'manage/my-campaigns', [CampaignController::class, 'my_campaign'] )->name( 'manage_admin_campaigns' );
    Route::get( 'manage/campaign-detail/{campaign}', [CampaignController::class, 'campaign_detail'] )->name( 'manage_campaign_detail' );
    Route::get( 'campaign-complete/{campaign}', [CampaignController::class, 'campaign_complete'] )->name( 'campaign_complete' );
    Route::get( 'campaign-approve/{campaign}', [CampaignController::class, 'campaign_approve'] )->name( 'campaign_approve' );
    Route::get( 'campaign-decline/{campaign}', [CampaignController::class, 'campaign_declined'] )->name( 'campaign_declined' );
    Route::get( 'active_campaigns', [CampaignController::class, 'active_campaigns'] )->name( 'active_campaigns' );
    Route::get( 'pending_campaigns', [CampaignController::class, 'pending_campaigns'] )->name( 'pending_campaigns' );
    Route::get( 'declined_campaigns', [CampaignController::class, 'declined_campaigns'] )->name( 'declined_campaigns' );
    Route::get( 'complete_campaigns', [CampaignController::class, 'completed_campaigns'] )->name( 'completed_campaigns' );

    Route::get('manage/create-campaign', [CampaignController::class, 'create_campaign'])->name('manage_create_campaign');
    Route::post('manage/campaign-save', [CampaignController::class, 'campaign_save'])->name('manage_create_campaign_save');
    Route::get('manage/campaign-brief/{campaign}', [CampaignController::class, 'campaign_brief'])->name('manage_campaign_brief');
    Route::post('manage/campaign-brief-save/{campaign}', [CampaignController::class, 'campaign_brief_save'])->name('manage_campaign_brief_save');
    Route::get('manage/add-trenders/{campaign}', [CampaignController::class, 'add_trenders'])->name('manage_add_trenders');
    Route::post('manage/add-trenders-save/{campaign}', [CampaignController::class, 'add_trenders_save'])->name('manage_add_trenders_save');
    Route::get('manage/review-payment/{campaign}', [CampaignController::class, 'review_payment'])->name('manage_review_payment');
    Route::get('manage/delete-campaign/{campaign}', [CampaignController::class, 'delete_campaign'])->name('manage_delete_campaign');
    Route::get('manage/edit-campaign/{campaign}', [CampaignController::class, 'edit_campaign'])->name('manage_edit_campaign');
    Route::post('manage/update-campaign/{campaign}', [CampaignController::class, 'update_campaign'])->name('manage_update_campaign');

    Route::get( 'trenders_requests', [CampaignController::class, 'trenders_requests'] )->name( 'trenders_requests' );
    Route::get( 'accept_invitation/{invite}', [CampaignController::class, 'accept_invitation'] )->name( 'admin_accept_invitation' );
    Route::get( 'decline_invitation/{invite}', [CampaignController::class, 'decline_invitation'] )->name( 'admin_decline_invitation' );

    Route::get('get-campaign-user-info/{user}/{campaign}', [CampaignController::class, 'getCampaignUserInfo'])->name('getCampaignUserInfo');
    Route::get('get-trender-info/{user}', [CampaignController::class, 'getTrenderInfo'])->name('getAdminTrenderInfo');
    Route::get('add-campaign-user/{user}/{campaign}', [CampaignController::class, 'addCampaignUser'])->name('adminAddCampaignUser');
    Route::get('remove-campaign-user/{user}/{campaign}', [CampaignController::class, 'removeCampaignUser'])->name('adminRemoveCampaignUser');

    // legal pages
    Route::get( 'faqs', [FaqController::class, 'index'] )->name( 'faqs' );
    Route::get( 'faq/create', [FaqController::class, 'create'] )->name( 'faq.create' );
    Route::post( 'faq/save', [FaqController::class, 'save'] )->name( 'faq.store' );
    Route::get( 'faq/edit/{faq}', [FaqController::class, 'edit'] )->name( 'faq.edit' );
    Route::post( 'faq/update/{faq}', [FaqController::class, 'update'] )->name( 'faq.update' );
    Route::get( 'faq/delete/{faq}', [FaqController::class, 'delete'] )->name( 'faq.destroy' );

    Route::get('user-info-form/{user}', [UserController::class, 'userInfoForm'])->name('userInfoForm');
    Route::post('user-update-info/{user}', [UserController::class, 'userInfo'])->name('userInfo');
    Route::post('update-facebook-info/{user}', [UserController::class, 'facebookInfo'])->name('facebookInfo');
    Route::post('update-instagram-info/{user}', [UserController::class, 'instagramInfo'])->name('instagramInfo');
    Route::post('update-snapchat-info/{user}', [UserController::class, 'snapchatInfo'])->name('snapchatInfo');
    Route::post('update-twitter-info/{user}', [UserController::class, 'twitterInfo'])->name('twitterInfo');
    Route::post('update-youtube-info/{user}', [UserController::class, 'youtubeInfo'])->name('youtubeInfo');
    Route::post('update-tiktok-info/{user}', [UserController::class, 'tiktokInfo'])->name('tiktokInfo');
    Route::get('user-social-info/{user}', [UserController::class, 'userSocialInfo'])->name('userSocialInfo');

    Route::get('manage/api_config', [SettingController::class, 'api_config'])->name('api_config');
    Route::post('update-flutter-wave-credentials', [SettingController::class, 'update_flutter_wave'])->name('update_flutter_wave');
    Route::post('update-twilio-credentials', [SettingController::class, 'update_twilio'])->name('update_twilio');
    Route::post('update-chat-gpt', [SettingController::class, 'update_chat_gpt'])->name('update_chat_gpt');
    Route::post('update-sms-247', [SettingController::class, 'update_sms_247'])->name('update_sms_247');

    Route::get('payments', [PaymentController::class, 'index'])->name('payments');
    Route::get('brand_payments', [PaymentController::class, 'brand_payments'])->name('brand_payments');
    Route::get('creator_payments', [PaymentController::class, 'creator_payments'])->name('admin_creator_payments');
    Route::get('gem_payments', [PaymentController::class, 'gem_payments'])->name('admin_gem_payments');
    Route::get('approve_invoice/{payment}', [PaymentController::class, 'approve_invoice'])->name('admin_approve_invoice');

    Route::get('invoice/{payment}', [PaymentController::class, 'invoice_detail'])->name('admin_invoice_detail');



    Route::post('pay-campaign/{campaign}', [FlutterWaveController::class, 'initialize'])->name('admin-pay-campaign');
    Route::get('/success-campaign-payment', [FlutterWaveController::class, 'callback'])->name('admin-success-campaign-payment');
    Route::get('payment-confirmation', [FlutterWaveController::class, 'success'])->name('admin-payment-confirmation');


    Route::get('pay-request-user/{invite}', [FlutterWaveController::class, 'payRequestUser'])->name('payRequestUser');
    Route::get('success-request-payment', [FlutterWaveController::class, 'successRequestPayment'])->name('successRequestPayment');
    Route::get('/success-trender-gem-payment', [FlutterWaveController::class, 'GemPaymentSuccess'])->name('adminTrenderGemPaymentSuccess');
    Route::get('/success-trender-air-time-payment', [FlutterWaveController::class, 'AirTimePaymentSuccess'])->name('adminAirTimePaymentSuccess');


    Route::get('messages', [MessageController::class, 'index'])->name('admin_messages');
    Route::get('chat-logs', [MessageController::class, 'chat_logs'])->name('chat_logs');
    Route::get('get_user_messages', [MessageController::class, 'get_user_messages'])->name('get_user_messages');
    Route::get('get_admin_users_messages', [MessageController::class, 'get_admin_users_messages'])->name('get_admin_users_messages');
    Route::get('explore_chat', [MessageController::class, 'explore_chat'])->name('explore_chat');
    Route::get('msg/{receiver}', [MessageController::class, 'chatIndex'])->name('adminChatIndex');
    Route::post('send_msg', [MessageController::class, 'send_msg'])->name('admin_send_msg');
    Route::post('get_unread_messages', [MessageController::class, 'get_unread_messages'])->name('admin_get_unread_messages');
    Route::get('get_all_unread_messages', [MessageController::class, 'get_all_unread_messages'])->name('admin_get_all_unread_messages');
    Route::get('get_user_unread_messages', [MessageController::class, 'get_user_unread_messages'])->name('get_admin_user_unread_messages');

    Route::get('reports', [ReportController::class, 'index'])->name('admin_reports');
    Route::post('approve_submission/{submission}', [ReportController::class, 'approve_submission'])->name('admin_approve_submission');
    Route::post('reject_submission/{submission}', [ReportController::class, 'reject_submission'])->name('admin_reject_submission');

    Route::get('notifications', [NotificationController::class, 'notifications'])->name('notifications');
    Route::post('notification-update', [NotificationController::class, 'notification_update'])->name('notification_update');

    Route::get('reward-contacts', [RewardController::class, 'reward'])->name('admin_reward_contacts');
    Route::post('pay-reward', [RewardController::class, 'pay_reward'])->name('admin_pay_reward');
    Route::get('get-reward-data', [RewardController::class, 'get_reward_data'])->name('admin_get_reward_data');
    Route::get('get-campaign-users/{campaign}', [RewardController::class, 'get_campaign_users'])->name('get_campaign_users');

    Route::get('email', [EmailController::class, 'index'])->name('admin_email');
    Route::post('send-email', [EmailController::class, 'send'])->name('admin_email_send');

    Route::get('localization', [SettingController::class, 'localization'])->name('localization');
    Route::post('localization_save', [SettingController::class, 'localization_save'])->name('localization_save');

    Route::get('verify/requests', [VerifyRequestController::class, 'verify_requests'])->name('verify_requests');
    Route::get('approve/verify/requests/{user_request}', [VerifyRequestController::class, 'approve_verify_requests'])->name('approve_verify_requests');
    Route::get('remove_request/{user_request}', [VerifyRequestController::class, 'remove_request'])->name('remove_request');

    Route::get('account_verify/requests', [VerifyRequestController::class, 'account_verify_requests'])->name('account_verify_requests');
    Route::get('approve/account_verify/requests/{user_request}', [VerifyRequestController::class, 'approve_account_verify_requests'])->name('approve_account_verify_requests');


    Route::get('air-time-requests', [VerifyRequestController::class, 'air_time_requests'])->name('air_time_requests');
    Route::get('approve/air-time-request/{reward}', [VerifyRequestController::class, 'approve_air_time_request'])->name('approve_air_time_request');

    Route::get('campaign_report/{campaign_id}', [ReportController::class, 'campaign_report'])->name('admin_campaign_report');

    Route::get('trend_ai', [AiController::class, 'index'])->name('admin_trend_ai');
    Route::post('ai_response', [AiController::class, 'ai_response'])->name('admin_ai_response');

    Route::get('payout-requests', [VerifyRequestController::class, 'payout_requests'])->name('payout_requests');
    Route::get('gem_payout_requests', [VerifyRequestController::class, 'gem_payout_requests'])->name('admin_gem_payout_requests');
    Route::get('approve/payout_request/{payout}', [VerifyRequestController::class, 'approve_payout_request'])->name('approve_payout_request');
    Route::get('approve/gem_payout_request/{payout}', [VerifyRequestController::class, 'approve_gem_payout_request'])->name('approve_gem_payout_request');

});


