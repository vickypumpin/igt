<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Faq::create([
           'question' => 'Do you offer a free trial?',
           'answer' => 'We offer everyone a 7 day free trial! You can take advantage of it by visiting our sign-up page! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro, ab!'
        ]);


        Faq::create([
           'question' => 'Can I gift a subscription to someone?',
           'answer' => 'Yes! We do offer certificates. Please email us for more information. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos, ad!'
        ]);


        Faq::create([
           'question' => 'I found a bug. Where can I report that?',
           'answer' => 'In the unlikely situation you stumble across a bug, go ahead and shoot us an email. Lorem ipsum dolor sit amet.'
        ]);


    }
}
