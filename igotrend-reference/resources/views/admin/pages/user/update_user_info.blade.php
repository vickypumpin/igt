
<form method="post" action="{{route('userInfo',$user)}}">
    @csrf
    <div class="row">
        <div class="col-12">
            <div class="form-group">
                <label for="badge">Badge</label>
                <select class="form-control" name="badge" id="badge" >
                    <option value="" selected>Select Badge</option>
                    <option value="nano">Nano</option>
                    <option value="micro">Micro</option>
                    <option value="mid_tier">Mid-Tier</option>
                    <option value="macro">Macro</option>
                    <option value="mega">Mega</option>
                    <option value="elite">Elite</option>
                </select>
            </div>
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-primary">Save</button>
        </div>
    </div>
</form>
