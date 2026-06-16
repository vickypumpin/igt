<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\FrontendController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\CreatorCategory;
use App\Models\ContentCategory;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [FrontendController::class, 'index_page']);

Auth::routes(['verify' => true]);

Route::get('/countries-states', [RegisterController::class, 'getStates'])->name('getStates');
Route::post('/validate-step-1', [RegisterController::class, 'validateStepOne'])->name('validateStepOne');
Route::post('/validate-step-2', [RegisterController::class, 'validateStepTwo'])->name('validateStepTwo');
Route::get('explore', [FrontendController::class, 'explore'])->name('explore');
Route::get('summary/{user:user_name}', [FrontendController::class, 'summary'])->name('summary');
Route::post('send_user_gem', [FrontendController::class, 'send_user_gem'])->name('send_user_gem');
Route::get('success_gem_payment', [FrontendController::class, 'gems_callback'])->name('success_gem_payment');

Route::get('brands', [FrontendController::class, 'brands'])->name('brands');
Route::get('creators', [FrontendController::class, 'creators'])->name('creators');
Route::get('services', [FrontendController::class, 'services'])->name('services');
Route::get('contact', [FrontendController::class, 'contact'])->name('contact');
Route::post('send-contact', [FrontendController::class, 'send_contact'])->name('send_contact');
Route::get('blog', [FrontendController::class, 'blog'])->name('blog');
Route::get('case-studies', [FrontendController::class, 'case_studies'])->name('case_studies');
Route::get('faqs', [FrontendController::class, 'faqs'])->name('frontend_faqs');
Route::get('what_does_influencer_mean', [FrontendController::class, 'influencer_mean'])->name('what_does_influencer_mean');
Route::get('/{legal_page:slug}', [FrontendController::class, 'page'])->name('page');
