export async function GET() {
  const adsTxt = process.env.ADS_TXT_CONTENT || '';

  return new Response(adsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
