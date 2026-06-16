
@extends('admin.layout.dashboard')
@section('title','Creator Social info')
@section('page_title','Creator Social info')
@section('page_route','Users / Creator Social info')
@push('cs')
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <style>
        .select2.select2-container {
            width: 100%!important;
        }
        .select2-selection {
            background-color: #e9ecef !important;
        }
        .select2-selection--multiple .select2-selection__choice {
            background-color: #f5f7fa !important;
            margin-top: 10px !important;
        }
        .select2-selection--multiple{
            height: 50px !important;
            border: unset !important;
        }
    </style>
@endpush
@section('content')
    <div class="container-fluid page__container">
        <form action="{{route('userSocialProfileUpdate',$user)}}" method="post" enctype="multipart/form-data">
            @csrf
            <div class="row">
                <div class="col-lg-9 pr-lg-0">
                    <div class="page-section">
                        <div class="list-group list-group-form">
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3">IGT profile name</label>
                                    <div class="col-sm-9">
                                        <input type="text" name="user_name" class="form-control @error('user_name') is-invalid @enderror " value="{{$user->user_name}}" placeholder="profile name">
                                        <small class="form-text text-muted">Your profile name will be used as part of your public profile URL address.</small>
                                        @error('user_name')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3" for="content_category">Content Category</label>
                                    <div class="col-sm-9">
                                        <select id="content_category" name="content_category[]"  multiple class="form-control content-category-select @error('content_category') is-invalid @enderror" >
                                            @foreach($content_categories as $category)
                                                <option value="{{$category->id}}" @if(in_array($category->id,explode(',',$user->content_category))) selected @endif>{{$category->name}}</option>
                                            @endforeach
                                        </select>
                                        @error('content_category')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            @if($user->creator_category)
                                <div class="list-group-item">
                                    <div class="form-group row align-items-center mb-0">
                                        <label class="col-form-label form-label col-sm-3" for="creator_category">Creator Category</label>
                                        <div class="col-sm-9">
                                            <select id="creator_category" name="creator_category[]"  multiple="" class="form-control creator-category-select" >
                                                @foreach($creator_categories as $category)
                                                    <option value="{{$category->id}}" @if(in_array($category->id,explode(',',$user->creator_category))) selected @endif>{{$category->name}}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            @endif
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3" for="facebook_profile">Facebook Profile</label>
                                    <div class="input-group input-group-merge col-sm-9">
                                        <input type="text" id="facebook_profile" name="facebook_profile" class="form-control form-control-prepended @error('facebook_profile') is-invalid @enderror" placeholder="" value="{{$user->facebook_profile}}" >
                                        @error('facebook_profile')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <img src="{{asset('images/facebook.png')}}" width="24" height="24" alt="Facebook">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3" for="instagram_profile">Instagram Profile</label>
                                    <div class="input-group input-group-merge col-sm-9">
                                        <input type="text" id="instagram_profile" name="instagram_profile" class="form-control form-control-prepended @error('instagram_profile') is-invalid @enderror" placeholder="" value="{{$user->instagram_profile}}" >
                                        @error('instagram_profile')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <img src="{{asset('images/instagram.png')}}" width="24" height="24" alt="Instagram">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3" for="twitter_profile">Twitter Profile</label>
                                    <div class="input-group input-group-merge col-sm-9">
                                        <input type="text" id="twitter_profile" name="twitter_profile" class="form-control form-control-prepended @error('twitter_profile') is-invalid @enderror" placeholder="" value="{{$user->twitter_profile}}" >
                                        @error('twitter_profile')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <img src="{{asset('images/twitter.png')}}" width="24" height="24" alt="Twitter">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3" for="youtube_profile">Youtube Profile</label>
                                    <div class="input-group input-group-merge col-sm-9">
                                        <input type="text" id="youtube_profile" name="youtube_profile" class="form-control form-control-prepended @error('youtube_profile') is-invalid @enderror" placeholder="" value="{{$user->youtube_profile}}" >
                                        @error('youtube_profile')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <img src="{{asset('images/youtube.png')}}" width="24" height="24" alt="Youtube">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3" for="tiktok_profile" >Tiktok Profile</label>
                                    <div class="input-group input-group-merge col-sm-9">
                                        <input type="text" id="tiktok_profile" name="tiktok_profile" class="form-control form-control-prepended @error('tiktok_profile') is-invalid @enderror" placeholder="" value="{{$user->tiktok_profile}}" >
                                        @error('tiktok_profile')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <img src="{{asset('images/tiktok.png')}}" width="24" height="24" alt="Tiktok">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="list-group-item">
                                <div class="form-group row align-items-center mb-0">
                                    <label class="col-form-label form-label col-sm-3" for="snapchat_profile">Snapchat Profile</label>
                                    <div class="input-group input-group-merge col-sm-9">
                                        <input type="text" id="snapchat_profile" name="snapchat_profile" class="form-control form-control-prepended @error('snapchat_profile') is-invalid @enderror" placeholder="" value="{{$user->snapchat_profile}}" >
                                        @error('snapchat_profile')
                                        <span class="invalid-feedback" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                        @enderror
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <img src="{{asset('images/snapchat.png')}}" width="24" height="24" alt="Snapchat">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {{--                            <div class="list-group-item">--}}
                            {{--                                <div class="custom-control custom-checkbox">--}}
                            {{--                                    <input type="checkbox" class="custom-control-input" checked id="customCheck1">--}}
                            {{--                                    <label class="custom-control-label" for="customCheck1">IGT Newsletter</label>--}}
                            {{--                                    <small class="form-text text-muted">Get the latest on company news,features and updates.</small>--}}
                            {{--                                </div>--}}
                            {{--                            </div>--}}
                            {{--                            <div class="list-group-item">--}}
                            {{--                                <div class="custom-control custom-checkbox">--}}
                            {{--                                    <input type="checkbox" class="custom-control-input" checked id="customCheck2">--}}
                            {{--                                    <label class="custom-control-label" for="customCheck2">Phone,SMS, Email</label>--}}
                            {{--                                    <small class="form-text text-muted">Checked or Not we will use this medium to reach you on campaigns,rewards and support.</small>--}}
                            {{--                                </div>--}}
                            {{--                            </div>--}}
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 page-nav">
                    <div class="page-section pt-lg-112pt">
                        <nav class="nav page-nav__menu">
                            <a class="nav-link {{ active_class('userAccountInfo') }}" href="{{route('userAccountInfo',$user)}}">Basic Information</a>
                            <a class="nav-link {{ active_class('userSocialProfile') }}" href="{{route('userSocialProfile',$user)}}">Social Profile</a>
                            <a class="nav-link {{ active_class('user-password') }}" href="{{route('user-password',$user)}}">Change Password</a>
                        </nav>
                        <div class="page-nav__content">
                            <button type="submit" class="btn btn-accent">Update Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection
@push('page-scripts')
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script>
        $('.content-category-select').select2({
            placeholder: "Select a content category",
            maximumSelectionLength: 5
        });
        $('.creator-category-select').select2({
            placeholder: "Select a creator category",
            maximumSelectionLength: 3
        });
    </script>
@endpush
