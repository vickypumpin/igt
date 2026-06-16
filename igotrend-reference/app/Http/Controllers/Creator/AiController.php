<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    public function index()
    {
        return view('creators.pages.ai');
    }

    public function ai_response(Request $request)
    {
        $setting = Setting::first();
        $API_KEY = $setting->chat_gpt_api_key;

        // Run Moderation Check First
        if ($this->checkModeration($request->message, $API_KEY)) {
            return response()->json([
                'status' => false,
                'message_response' => "Your message violates our content policy.",
            ]);
        }

        // Proceed to ChatGPT if moderation passes
        $curl = curl_init();

        $url = "https://api.openai.com/v1/chat/completions";
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);

        $headers = [
            "Content-Type: application/json",
            "Authorization: Bearer $API_KEY"
        ];

        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $msg_json = json_encode([["role" => "user", "content" => $request->message]]);

        $data = [
            "model" => "gpt-3.5-turbo",
            "messages" => json_decode($msg_json),
            "temperature" => 0.5,
            "max_tokens" => 500
        ];
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));

        $response = curl_exec($curl);
        curl_close($curl);

        $response = json_decode($response, true);

        if (isset($response['error'])) {
            Log::info($response['error']['message']);
            return response()->json([
                'status' => false,
                'message_response' => "Something Went Wrong, Try Again",
            ]);
        } else {
            $generated_text = $response['choices'][0]['message']['content'];

            $ask_question = '<i class="fas fa-quote-left fa-xs text-primary"></i> ' . $request->message . ' <i class="fas fa-quote-right fa-xs text-primary"></i>';
            $chatGptContent = '<i class="fas fa-quote-left fa-xs text-primary"></i> ' . $generated_text . ' <i class="fas fa-quote-right fa-xs text-primary"></i>';

            return response()->json([
                'status' => true,
                'message_response' => $chatGptContent,
                'ask_question' => $ask_question,
            ]);
        }
    }

    /**
     * Check input against OpenAI Moderation API.
     */
    private function checkModeration($text, $API_KEY)
    {
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://api.openai.com/v1/moderations",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json",
                "Authorization: Bearer $API_KEY"
            ],
            CURLOPT_POSTFIELDS => json_encode(["model" => "omni-moderation-latest", "input" => $text])
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $moderation = json_decode($response, true);

        return isset($moderation['results'][0]['flagged']) && $moderation['results'][0]['flagged'];
    }
}
