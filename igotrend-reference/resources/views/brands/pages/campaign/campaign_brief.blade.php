@extends('brands.layout.app')
@section('title','Create Campaign')
@section('page_title','Create Campaigns')
@section('page_route','Campaign Mgt / Campaign Brief')
@section('content')
    <div class="container-fluid page__container">
        <div class="py-32pt navbar-submenu">
            <div class="container-fluid page__container">
                <div class="progression-bar progression-bar--active-accent">
                    <a href="{{route('edit_campaign',$campaign)}}" class="progression-bar__item progression-bar__item--complete">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon">done</i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Campaign Info</span>
                            </span>
                    </a>
                    <a href="{{route('campaign_brief',$campaign)}}" class="progression-bar__item progression-bar__item--complete progression-bar__item--active">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon">edit</i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Campaign Brief</span>
                            </span>
                    </a>
                    <a href="{{route('add_trenders',$campaign)}}" class="progression-bar__item">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon"></i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Add Trenders</span>
                            </span>
                    </a>
                    <a href="{{route('review_payment',$campaign)}}" class="progression-bar__item">
                            <span class="progression-bar__item-content">
                                <i class="material-icons progression-bar__item-icon"></i>
                                <span class="progression-bar__item-text h5 mb-0 text-uppercase">Payment &amp; Review </span>
                            </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid page__container page-section">

        <div class="page-separator">
            <div class="page-separator__text">Create an Campaign Brief</div>
        </div>

        <div class="card card-body mb-32pt">
            <div class="row">

                <div class="card-body align-items-center">
                    <form class="flex" method="post" action="{{route('campaign_brief_save',$campaign)}}">
                        @csrf
                        <div class="form-group">
                            <label class="form-label" for="brand_description">
                                <h6>Brand Description:</h6>
                            </label>
                            <textarea id="brand_description" name="brand_description" placeholder="Enter description here ..." rows="3" class="form-control @error('brand_description')  is-invalid  @enderror">{{old('brand_description') ? old('brand_description') : $campaign->brand_description}}</textarea>
                            @error('brand_description')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="post_caption_text">
                                <h6>POST CAPTION/TEXT:</h6>
                            </label>
                            <textarea id="post_caption_text" name="post_caption_text" placeholder="Enter description here ..." rows="3" class="form-control @error('post_caption_text')  is-invalid  @enderror">{{old('post_caption_text') ? old('post_caption_text') : $campaign->post_caption_text}}</textarea>
                            @error('post_caption_text')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="handles_hash">
                                <h6>HANDLE(S)/MENTIONS /HASH TAGS:</h6>
                            </label>
                            <textarea id="handles_hash" name="handles_hash" placeholder="Enter description here ..." rows="3" class="form-control @error('handles_hash')  is-invalid  @enderror">{{old('handles_hash') ? old('handles_hash') : $campaign->handles_hash}}</textarea>
                            @error('handles_hash')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="dos">
                                <h6>DO'S:</h6>
                            </label>
                            <textarea id="dos" name="dos" placeholder="Enter description here ..." rows="3" class="form-control @error('dos')  is-invalid  @enderror">{{old('dos') ? old('dos') : $campaign->dos}}</textarea>
                            @error('dos')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="donts">
                                <h6>DONT'S:</h6>
                            </label>
                            <textarea id="donts" name="donts" placeholder="Enter description here ..." rows="3" class="form-control @error('donts')  is-invalid  @enderror">{{old('donts') ? old('donts')  : $campaign->donts}}</textarea>
                            @error('donts')
                            <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <br>
                        <button type="submit" class="btn btn-accent">
                            <i class="material-icons icon--left">forward</i> ADD TRENDERS
                        </button>
                    </form>
                </div>
            </div>
        </div>

    </div>
@endsection
