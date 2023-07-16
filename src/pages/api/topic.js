import { OpenAIStream } from "../../../lib/stream";

export const runtime = 'edge';

export default async function handle(req, res) {
  if (req.method === "POST") {
    try {
      const { topic, noquestion } = (await req.json())

      const payload = {
        model: "text-davinci-003",
        prompt: `You are a super intelligent quiz bot. I will give you a topic and you will have to create  ${noquestion < 3 ? 3 : noquestion} mcq questions in json form eg={"questions":[{"question":"In which country was Elon Musk born?","options":["United States","Canada","South Africa","Australia"],"answer":"South Africa"}]}. I want you to only reply with the json output and nothing else. Do not write explanations.The json should be in single straight line with no space between brackets or words.There should be atleast 4 different options with different meaning and among them a correct answer for the question in json and the answer must be the correct option from the option list.The question and answer provided must be authentic and correct, If you don't have accurate or up-to-data data about the topic to create questions and provide with accurate answers don't respond anything and don't generate hypothetical data.Topic is = ${topic}`,
        temperature: 0.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        max_tokens: 500,
      };

      const stream = await OpenAIStream(payload);
      return new Response(stream);

    } catch (error) {
      res.status(500).send("Server Error");

    }
  }
}


