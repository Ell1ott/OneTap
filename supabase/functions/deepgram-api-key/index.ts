import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@deepgram/sdk@^4.2.0';
const client = createClient(Deno.env.get('DEEPGRAM_API_KEY'));
Deno.serve(async (req) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: headers,
    });
  }
  console.log('getting deepgram api key');
  const projectId = await getProjectId();
  const key = await getTempApiKey(projectId);
  return Response.json(key, {
    headers,
  });
});
const getProjectId = async () => {
  const { result, error } = await client.manage.getProjects();
  if (error) {
    throw error;
  }
  return result.projects[0].project_id;
};
const getTempApiKey = async (projectId) => {
  const { result, error } = await client.manage.createProjectKey(projectId, {
    comment: 'short lived',
    scopes: ['usage:write'],
    time_to_live_in_seconds: 5 * 60,
  });
  if (error) {
    throw error;
  }
  return result;
};
