<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    public function index()
    {
        return view('admin.ai');
    }

    public function ai_response(Request $request)
    {
        $curl = curl_init();
        $setting = Setting::first();
        $API_KEY = $setting->chat_gpt_api_key;

        $url = "https://api.openai.com/v1/chat/completions";
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);

        $headers = array(
            "Content-Type: application/json",
            "Authorization: Bearer $API_KEY"
        );

        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $msg_json = '[{"role": "user", "content": "'.$request->message.'"}]'; //PROMPT OR MESSAGE


        $data = array( // ata
            "model" => "gpt-3.5-turbo", // model
            "messages" => json_decode($msg_json),
            "temperature" => 0.5,
            "max_tokens" => 500
        );
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));

        $response = curl_exec($curl);

        $response = json_decode($response, true);

        if (isset($response['error'])){
            Log::info($response['error']['message']);
            return response()->json([
                'status' => false,
                'message_response' => "Something Went Wrong, Try Again",
            ]);
        }else{

            $generated_text = $response['choices'][0]['message'];  //Getting Message Array which includes Role, Content.

            $chatGptContent = $generated_text['content'];

            curl_close($curl);      // close cURL session


            $ask_question= '<i class="fas fa-quote-left fa-xs text-primary"></i> ' .  $request->message . ' <i class="fas fa-quote-right fa-xs text-primary"></i>';
            $chatGptContent = '<i class="fas fa-quote-left fa-xs text-primary"></i> ' .  $chatGptContent . ' <i class="fas fa-quote-right fa-xs text-primary"></i>';

            return response()->json([
                'status' => true,
                'message_response' => $chatGptContent,
                'ask_question' => $ask_question,
            ]);

        }
    }
}
