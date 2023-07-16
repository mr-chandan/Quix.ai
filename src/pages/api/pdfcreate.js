import { OpenAIStream } from "../../../lib/stream";

export const runtime = 'edge';

export default async function handle(req, res) {
    if (req.method === 'PUT') {

        try {
            const { noquest, text } = (await req.json())

            const payload = {
                model: "text-davinci-003",
                prompt: `I will give you a text based on the text create MCQ questions and make sure you give with answers in json form. The json should be in single straight line with no space between brackets or words. I want you to reply with the json output  and nothing else.And the number of questions should be is ${noquest < 3 ? 3 : noquest}. Json format eg={"questions":[{"question":"In which country was Elon Musk born?","options":["United States","Canada","South Africa","Australia"],"answer":"South Africa"}]} . The text is ="${text}"`,
                temperature: 0.2,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stream: true,
                max_tokens: 800,
            };

            const stream = await OpenAIStream(payload);
            return new Response(stream);

        } catch (error) {
            res.status(500).send("Server Error");

        }

    }
}
