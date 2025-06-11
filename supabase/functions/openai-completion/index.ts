// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { streamObject } from 'npm:ai@4.3.16';
import { createOpenAI } from 'npm:@ai-sdk/openai@1.3.22';
import { prompt } from './prompt.ts';
const openai = createOpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

// Load the AI prompt from the markdown file

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

  // Inject current date/time context
  const now = new Date(currentDate);
  const formattedDate = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const contextualizedPrompt = prompt.replace('{CURRENT_DATETIME}', currentDateTime);
  const ObjectStream = streamObject({
    model: openai('gpt-4.1-mini'),
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
    onError: (e) => console.log(e),
  });
  console.log('object stream created');
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
