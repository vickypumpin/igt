const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.js('resources/js/app.js', 'public/js')
//     .sass('resources/sass/app.scss', 'public/css')
//     .sourceMaps();

mix.js('resources/js/userchat.js', 'public/js')
mix.js('resources/js/adminchat.js', 'public/js')

mix.combine([
    'resources/sass/admin/vendor/jquery.min.js',
    'resources/sass/admin/vendor/popper.min.js',
    'resources/sass/admin/vendor/bootstrap.min.js',
    'resources/sass/admin/vendor/perfect-scrollbar.min.js',
    'resources/sass/admin/vendor/dom-factory.js',
    'resources/sass/admin/vendor/material-design-kit.js',
    'resources/sass/admin/vendor/fix-footer.js',
    'resources/sass/admin/vendor/Chart.min.js',
    'resources/js/admin/js/app.js',
    'resources/js/admin/js/hljs.js',
    'resources/js/admin/js/settings.js',
    'resources/sass/admin/vendor/dropzone.min.js',
    'resources/js/admin/js/dropzone.js',
    'resources/sass/admin/vendor/moment.min.js',
    'resources/sass/admin/vendor/moment-range.min.js',
    'resources/js/admin/js/chartjs.js',
    'resources/js/admin/js/page.analytics-dashboard.js',
    'resources/sass/admin/vendor/jqvmap/jquery.vmap.min.js',
    'resources/sass/admin/vendor/jqvmap/maps/jquery.vmap.world.js',
    'resources/js/admin/js/vector-maps.js',
    'resources/sass/admin/vendor/list.min.js',
    'resources/js/admin/js/list.js',
    'resources/js/admin/js/toggle-check-all.js',
    'resources/js/admin/js/check-selected-row.js',
    'resources/sass/admin/vendor/select2/select2.min.js',
    'resources/js/admin/js/select2.js',
    'resources/sass/admin/vendor/quill.min.js',
    'resources/js/admin/js/quill.js',
], 'public/js/dashboard.js',true);

mix.combine([
    'resources/js/admin/js/jquery.dataTables.js',
    'resources/js/admin/js/dataTables.bootstrap4.js'
], 'public/js/datatable.js',true);

mix.combine([
    'resources/sass/admin/vendor/sweetalert2/sweetalert2.min.js',
], 'public/js/sweetalert.js',true);

mix.combine([
    'resources/sass/admin/vendor/ion.rangeSlider.min.js',
    'resources/js/admin/js/ion-rangeslider.js',
], 'public/js/rangeslider.js',true);

mix.combine([
    'resources/sass/admin/vendor/flatpickr/flatpickr.min.js',
    'resources/js/admin/js/flatpickr.js',
], 'public/js/flatpickr.js',true);

mix.combine([
    'resources/sass/admin/vendor/jquery.bootstrap-touchspin.js',
    'resources/js/admin/js/touchspin.js',
], 'public/js/touchspin.js',true);

mix.copy([
    'resources/sass/admin/css/image-uploader.css',
], 'public/css',true);

mix.copy([
    'resources/js/admin/js/image-uploader.js',
], 'public/js',true);


mix.copy([
    'resources/sass/admin/images/icon/facebook.png',
    'resources/sass/admin/images/icon/instagram.png',
    'resources/sass/admin/images/icon/youtube.png',
    'resources/sass/admin/images/icon/twitter.png',
    'resources/sass/admin/images/icon/snapchat.png',
    'resources/sass/admin/images/icon/tiktok.png',
    'resources/sass/admin/images/icon/twitter.png',
    'resources/sass/admin/images/logo/igthomelogo.png',
    'resources/sass/admin/images/logo/igt_ico.ico',
    'resources/sass/admin/images/logo/igt_logo.png',
    'resources/sass/admin/images/icon/nairalogo.png',
    'resources/sass/admin/images/stories/girlsub.png',
    'resources/sass/admin/images/stories/blk.png',
    'resources/sass/admin/images/stories/blk.png',
    'resources/sass/admin/images/people/110/guy-1.jpg',
    'resources/sass/admin/images/people/256/256_rsz_nicolas-horn-689011-unsplash.jpg',
    'resources/sass/admin/images/people/50/guy-3.jpg',
    'resources/sass/admin/images/people/110/woman-5.jpg',
    'resources/sass/admin/images/stories/celebration.jpg',
    'resources/sass/admin/images/256_daniel-gaffey-1060698-unsplash.jpg',
    'resources/sass/admin/images/card-user-1.jpg',
    'resources/sass/admin/images/stories/celebration.jpg',
], 'public/images');


// mix.js("resources/js/admin/app.js", "public/js/dashboard.js");

mix.sass("resources/sass/admin/app.scss", "public/css/dashboard.css")


//frontend


mix.combine([
    'resources/js/frontend/libs/jquery/dist/jquery.min.js',
    'resources/js/frontend/libs/bootstrap/dist/js/bootstrap.bundle.min.js',
    'resources/js/frontend/libs/aos/dist/aos.js',
    'resources/js/frontend/libs/jquery-countto/jquery.countTo.js',
    'resources/js/frontend/libs/owl.carousel/dist/owl.carousel.min.js',
    'resources/js/frontend/libs/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
    'resources/js/frontend/libs/ajaxchimp/jquery.ajaxchimp.min.js',
    'resources/js/frontend/libs/isotope-layout/dist/isotope.pkgd.min.js',
    'resources/js/frontend/libs/imagesloaded/imagesloaded.pkgd.min.js',
    'resources/js/frontend/libs/jquery-slimscroll/jquery.slimscroll.min.js',
    'resources/js/frontend/libs/clipboard/dist/clipboard.min.js',
    'resources/js/frontend/libs/prismjs/prism.js',
    'resources/js/frontend/js/theme.min.js',
], 'public/js/theme.js',true);

mix.copy([
    'resources/sass/frontend/css/theme.min.css',
], 'public/css/theme.min.css',true);

mix.copy([
    'resources/sass/frontend/images/swag.png',
    'resources/sass/frontend/images/pexe.jpg',
    'resources/sass/frontend/images/pa_poster.jpg',
    'resources/sass/frontend/images/search.png',
    'resources/sass/frontend/images/rev.png',
    'resources/sass/frontend/images/amp.png',
    'resources/sass/frontend/images/igtpic1.png',
    'resources/sass/frontend/images/bgpolygon3.png',
    'resources/sass/frontend/images/bgpolygon.png',
    'resources/sass/frontend/images/bgpolygon2.png',
    'resources/sass/frontend/images/igtpic1.png',
    'resources/sass/frontend/images/phonetique.png',
    'resources/sass/frontend/images/whogo.png',
    'resources/sass/frontend/images/printivo.png',
    'resources/sass/frontend/images/tecno.png',
    'resources/sass/frontend/images/checkd.png',
    'resources/sass/frontend/images/konga.png',
    'resources/sass/frontend/images/lssimage.png',
    'resources/sass/frontend/images/jol.png',
    'resources/sass/frontend/images/nifty.png',
    'resources/sass/frontend/images/brandbanner.png',
    'resources/sass/frontend/images/brandbanner3.png',
    'resources/sass/frontend/images/brandbanner2.png',
    'resources/sass/frontend/images/bg-shape.svg',
    'resources/sass/frontend/images/curve-shape-img-1.png',
    'resources/sass/frontend/images/b2c.png',
    'resources/sass/frontend/images/agen.png',
    'resources/sass/frontend/images/b2b.png',
    'resources/sass/frontend/images/jolly.png',
    'resources/sass/frontend/images/ded.png',
    'resources/sass/frontend/images/veekee.png',
    'resources/sass/frontend/images/amokelogonew.png',
    'resources/sass/frontend/images/lss.png',
    'resources/sass/frontend/images/phoneinsta.png',
    'resources/sass/frontend/images/banner1.png',
    'resources/sass/frontend/images/socio.png',
    'resources/sass/frontend/images/creatorbanner2.png',
    'resources/sass/frontend/images/creatorbanner.png',
    'resources/sass/frontend/images/payroll-int.svg',
    'resources/sass/frontend/images/empolyee.svg',
    'resources/sass/frontend/images/folder.png',
    'resources/sass/frontend/images/vivibanner2.png',
    'resources/sass/frontend/images/createreward.png',
    'resources/sass/frontend/images/creatoralma.png',
    'resources/sass/frontend/images/app-store.svg',
    'resources/sass/frontend/images/google-play.svg',
    'resources/sass/frontend/images/servpic1.png',
    'resources/sass/frontend/images/servpic2.png',
    'resources/sass/frontend/images/servicethumbnail.png',
    'resources/sass/frontend/images/1st.png',
    'resources/sass/frontend/images/2nd.png',
    'resources/sass/frontend/images/3rd.png',
    'resources/sass/frontend/images/celeb1.png',
    'resources/sass/frontend/images/celeb2.png',
    'resources/sass/frontend/images/celeb3.png',
    'resources/sass/frontend/images/celeb4.png',
    'resources/sass/frontend/images/celeb5.png',
    'resources/sass/frontend/images/celeb6.png',
    'resources/sass/frontend/images/celeb7.png',
    'resources/sass/frontend/images/inflimg.png',
    'resources/sass/frontend/images/cc.png',
    'resources/sass/frontend/images/bimnew.png',
    'resources/sass/frontend/images/photogrid.png',
    'resources/sass/frontend/images/bg-shape-gradient.svg',
    'resources/sass/frontend/images/block-img-3.jpg',
    'resources/sass/frontend/images/diamond.png',
    'resources/sass/frontend/images/alma.jpg',
    'resources/sass/frontend/images/ph1.png',
    'resources/sass/frontend/images/amo1.png',
    'resources/sass/frontend/images/jo1.png',
    'resources/sass/frontend/images/soc.png',
    'resources/sass/frontend/images/creatvsinfl.png',
    'resources/sass/frontend/images/connectbrands.png',
    'resources/sass/frontend/images/event1.jpg',
    'resources/sass/frontend/images/standthumb.png',
    'resources/sass/frontend/images/intro.png',
    'resources/sass/frontend/images/accpic.png',
], 'public/images');
