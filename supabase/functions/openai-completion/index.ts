// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { streamObject } from 'npm:ai@4.3.16';
import { createOpenAI } from 'npm:@ai-sdk/openai@1.3.22';

const openai = createOpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

// Load the AI prompt from the markdown file
async function loadAIPrompt(): Promise<string> {
  try {
    const promptPath = new URL('./prompt.md', import.meta.url);
    return await Deno.readTextFile(promptPath);
  } catch (error) {
    console.error('Failed to load prompt file:', error);
    throw new Error('Could not load AI prompt');
  }
}
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
  const { input } = await req.json();
  console.log(input);

  // Inject current date/time context
  const now = new Date();
  const currentDateTime = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const contextualizedPrompt = AIPrompt.replace('{CURRENT_DATETIME}', currentDateTime);
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
