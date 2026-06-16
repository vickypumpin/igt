@extends('admin.layout.dashboard')
@section('title','Site Setting')
@section('page_title','Site Setting')
@section('page_route','Setting / Site Setting')
@section('content')
    <style>
        .tagify{
            background-color: #edf0f2 !important;
            border-radius: 0.25rem;
        }
    </style>
    <div class="container-fluid page__container">
        <div class="page-section">
            <div class="card">
                <div class="card-body">
                    <form method="post" action="{{route('site_settings.update')}}" enctype="multipart/form-data">
                        @csrf
                        <div class="">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="site_name">Site Name</label>
                                        <input id="site_name" name="site_name" type="text"
                                               class="form-control @error('site_name') is-invalid @enderror"
                                               placeholder="Site Name" value="{{old('site_name') ? old('site_name') : $setting->site_name}}"/>
                                        @error('site_name')
                                        <div class="invalid-feedback">{{ $message}}</div>
                                        @enderror
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="d-flex">
                                        <div class="form-group">
                                            <label for="content">Logo</label>
                                            <input type="file" class="form-control-file  @error('logo') is-invalid @enderror"
                                                   id="logo" name="logo" placeholder="Logo" accept="image/*">
                                            @error('logo')
                                            <div class="invalid-feedback">{{ $message}}</div>
                                            @enderror
                                        </div>
                                        @if($setting->site_logo)
                                            <div class="mt-4 media-left">
                                                <img src="{{asset('storage/logo/'.$setting->site_logo)}}"  width="110" >
                                            </div>
                                        @endif
                                    </div>
                                </div>
                                <div class="col-md-6 ">
                                    <div class="d-flex">
                                        <div class="form-group">
                                            <label for="content">Favicon</label>
                                            <input type="file" class="form-control-file @error('favicon') is-invalid @enderror" id="favicon" name="favicon" placeholder="favicon" accept="image/*">
                                            @error('favicon')
                                            <div class="invalid-feedback">{{ $message}}</div>
                                            @enderror
                                        </div>
                                        @if($setting->site_favicon)
                                            <div class="mt-3 media-left">
                                                <img src="{{asset('storage/favicon/'.$setting->site_favicon)}}"  width="60" >
                                            </div>
                                        @endif
                                    </div>

                                </div>
                                <div class="col-md-6 ">
                                    <div class="form-group">
                                        <label for="facebook_url">Facebook Url</label>
                                        <input type="text" class="form-control @error('facebook_url') is-invalid @enderror" id="facebook_url" name="facebook_url" placeholder="facebook url"
                                               value="{{old('facebook_url') ? old('facebook_url') : $setting->facebook_url}}"
                                        >
                                        @error('facebook_url')
                                        <div class="invalid-feedback">{{ $message}}</div>
                                        @enderror
                                    </div>
                                </div>
                                <div class="col-md-6 ">
                                    <div class="form-group">
                                        <label for="twitter_url">Instagram Url</label>
                                        <input type="text" class="form-control @error('instagram_url') is-invalid @enderror" id="instagram_url" name="instagram_url" placeholder="instagram url"
                                               value="{{old('instagram_url') ? old('instagram_url') : $setting->instagram_url}}"
                                        >
                                        @error('instagram_url')
                                        <div class="invalid-feedback">{{ $message}}</div>
                                        @enderror
                                    </div>
                                </div>
                                <div class="col-md-6 ">
                                    <div class="form-group">
                                        <label for="linkedin_url">Youtube Url</label>
                                        <input type="text" class="form-control @error('youtube_url') is-invalid @enderror" id="youtube_url" name="youtube_url" placeholder="youtube url"
                                               value="{{old('youtube_url') ? old('youtube_url') : $setting->youtube_url}}"
                                        >
                                        @error('youtube_url')
                                        <div class="invalid-feedback">{{ $message}}</div>
                                        @enderror
                                    </div>
                                </div>
                                <div class="col-md-6 ">
                                    <div class="form-group">
                                        <label for="gem_price">Gem Price</label>
                                        <input type="number" class="form-control @error('gem_price') is-invalid @enderror" id="gem_price" name="gem_price" placeholder="gem price"
                                               value="{{old('gem_price') ? old('gem_price') : $setting->gem_price}}"
                                        >
                                        @error('youtube_url')
                                        <div class="invalid-feedback">{{ $message}}</div>
                                        @enderror
                                        <span> 1 Gem = {{isset($setting->gem_price) ? $setting->gem_price : 0}} N</span>
                                    </div>
                                </div>

                                <div class="col-md-12 ">
                                    <div class="form-group">
                                        <label for="site_description">Site Description</label>
                                        <input type="text" class="form-control @error('site_description') is-invalid @enderror" id="site_description" name="site_description" placeholder="site description"
                                               value="{{old('site_description') ? old('site_description') : $setting->site_description}}">
                                        @error('site_description')
                                        <div class="invalid-feedback">{{ $message}}</div>
                                        @enderror
                                    </div>
                                </div>
                                <div class="col-md-12 ">
                                    <div class="form-group">
                                        <label for="seo_tags">Seo Tags</label>
                                        <input type="text" class="w-100 @error('seo_tags') is-invalid @enderror" id="seo_tags" name="seo_tags" placeholder="seo tags"
                                               value="{{old('seo_tags') ? old('seo_tags') : $setting->seo_tags}}" >
                                        @error('seo_tags')
                                        <div class="invalid-feedback">{{ $message}}</div>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-accent float-right">Update</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('page-scripts')
    <link href="https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/@yaireo/tagify"></script>
    <script src="https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.polyfills.min.js"></script>
    <script>
        var inputElm = document.querySelector('input[name=seo_tags]');
        var tagify = new Tagify(inputElm,{
            originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
        })
    </script>
@endpush
