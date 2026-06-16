<script>
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
    });

    @if($message = Session::get("success"))
    Toast.fire({
        icon: 'success',
        title: '{{ $message }}'
    })
    @endif

    @if($message = Session::get("danger"))
    Toast.fire({
        icon: 'error',
        title: '{{ $message }}'
    })
    @endif

    @if($message = Session::get("warning"))
    Toast.fire({
        icon: 'warning',
        title: '{{ $message }}'
    })
    @endif
</script>
