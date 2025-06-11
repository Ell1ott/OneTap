// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { streamObject } from 'npm:ai@4.3.16';
import { google } from 'npm:@ai-sdk/google@1.2.19';
import { prompt } from './prompt.ts';

// Google provider with search grounding - using Gemini 2.0 Flash
const model = google('gemini-2.0-flash-exp', {
  useSearchGrounding: true,
});

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }
  console.log('getting input');
  console.log(req);
  const { input, currentDate } = await req.json();
  console.log(input);

  // Use the pre-formatted date/time provided by the user
  const contextualizedPrompt = prompt.replace('{CURRENT_DATETIME}', currentDate || 'Not specified');
  const ObjectStream = streamObject({
    model,
    temperature: 1.5,
    output: 'no-schema',
    messages: [
      {
        role: 'system',
        content: contextualizedPrompt,
      },
      {
        role: 'user',
        content: input,
      },
    ],
    onError: (e: any) => console.log(e),
  });
  console.log('object stream created with Gemini 2.0 Flash');
  console.log('returning object stream');
  return ObjectStream.toTextStreamResponse({
    headers: {
      ...corsHeaders,
      Connection: 'keep-alive',
      'Keep-Alive': 'timeout=5',
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
});
