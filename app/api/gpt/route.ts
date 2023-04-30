import {ChatGPTAPI} from "chatgpt";

export async function POST(request: Request) {
  console.log('GPT_API_KEY',process.env.GPT_API_KEY)
  const { searchParams } = new URL(request.url);
  try {
    const {description, language, number} = await request.json()
    const api = new ChatGPTAPI({
      apiKey: process.env.GPT_API_KEY as string,
      completionParams: {
        temperature: 0.5,
        top_p: 0.8,
        model: "gpt-3.5-turbo"
      }

    })
    const prompt = `
      Write instagram ads for a epoxy and thuya wood necklace. 
      Use emojis and hashtags.
      Necklace description: ${description}.
      Write in: ${language}.
      
      Shipping and payment: 
      Pay on delivery: Rabat, Sale, Temara and Nearby area pay on delivery.
      Rest of Morocco: Amana.
      
      
      Number of ads to write: ${number || 5}
      
      ${language === 'arabic' ? `
        Translations to use:
        Arabic:   
            Thuya: العرعار
      ` : ''}
      
      ${language === 'french' ? `
        Translations to use:
        French:
          Necklace: collier (masculin).
      ` : ''}
      ${searchParams.get('prompt') ? 'Say with model version you are at the end' : ''}
    `;

    const apiResponse = await api.sendMessage(prompt)

    console.info('apiResponse', apiResponse)

    const {text} = apiResponse;
    return new Response(`
      ${text}
      ${searchParams.get('prompt') ? `Prompt: ${prompt}` : ''}
    `);
  } catch (e) {
    let response = new Response(JSON.stringify(e));

    return response;

  }

}
