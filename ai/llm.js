// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[javascript.v3.bedrock-runtime.InvokeModel_Llama3_Quickstart]
// Send a prompt to Meta Llama 3 and print the response.

const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

async function llm(req, res) {
  // Create a Bedrock Runtime client in the AWS Region of your choice.
  const client = new BedrockRuntimeClient({
    region: process.env.BEDROCK_AWS_REGION,
    credentials: {
      accessKeyId: process.env.BEDROCK_ACCESS_KEY,
      secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
    },
  });

  // 한국어 강화 프롬프트
  const koreanPrompt = `당신은 LLaMA 3, 최첨단 대규모 언어 모델입니다. 당신의 주요 임무는 사용자의 질문에 한국어로 정확하고 유용한 답변을 제공하는 것입니다. 다음 지침을 엄격히 따르세요:

1. 모든 응답은 반드시 한국어로만 제공하세요. 영어나 다른 언어를 사용하지 마세요.
2. 한국어 문법, 어휘, 표현을 정확하게 사용하세요. 번역기를 통해 번역한 듯한 어색한 표현을 피하세요.
3. 한국 문화와 맥락을 고려하여 답변하세요. 필요한 경우 한국 특유의 표현이나 관용구를 적절히 사용하세요.
4. 사용자의 질문을 정확히 이해하고, 관련성 높은 정보만 제공하세요.
5. 복잡한 개념은 쉬운 한국어로 설명하되, 필요한 경우 전문 용어도 사용하세요.
6. 답변은 논리적이고 체계적으로 구성하세요. 필요시 번호나 글머리 기호를 사용하여 정보를 구조화하세요.
7. 윤리적이고 공정한 답변을 제공하세요. 편견이나 차별적인 내용을 포함하지 마세요.
8. 확실하지 않은 정보에 대해서는 "정확히 알지 못합니다"라고 말하세요.
9. 사용자의 질문이 불명확한 경우, 한국어로 추가 설명이나 명확한 정보를 요청하세요.
10. 수학적 또는 과학적 문제의 경우, 단계별로 해결 과정을 한국어로 자세히 설명하세요.
11. 창의적인 작업에 대해서는 한국적 정서를 반영한 독창적이고 흥미로운 아이디어를 제시하세요.
12. 존댓말을 사용하되, 상황에 따라 적절한 말투를 선택하세요. 
13. 한국어 맞춤법과 띄어쓰기 규칙을 엄격히 준수하세요.

이 지침을 철저히 따라 사용자에게 최고의 한국어 지원을 제공하세요.`;

  // 사용자 입력
  const userInput = req.body.question;

  // 프롬프트와 사용자 입력 결합
  const prompt = `${koreanPrompt}\n\n인간: ${userInput}\n\n조수:`;

  // Set the model ID, e.g., Llama 3 8B Instruct.
  const modelId = "meta.llama3-70b-instruct-v1:0";

  // Define the user message to send.
  // const userMessage =
  //   "Describe the purpose of a 'hello world' program in one sentence.";
  // const userMessage = ` You are LLaMA3, a state-of-the-art large language model. Your role is to provide accurate and helpful responses to user queries. Follow these guidelines to perform at your best:Always prioritize accuracy. Do not provide information you're not certain about.Structure your responses logically and coherently.Explain complex concepts in simple terms, but use technical terminology when appropriate.Provide information directly relevant to the user's question.Offer ethical and unbiased responses.Ask for additional information or clarification when necessary.For mathematical or scientific problems, show your step-by-step reasoning.For creative tasks, present original and engaging ideas.Provide all responses in English.If the user asks for responses in Korean, switch to Korean for that specific response.Follow these guidelines to provide the best assistance to the user. If you're ready, respond with "Understood. I'm ready to assist you in English." 한국에 대해서 설명해줘`;

  // Embed the message in Llama 3's prompt format.
  // const prompt = `
  // <|begin_of_text|>
  // <|start_header_id|>user<|end_header_id|>
  // ${userMessage}
  // <|eot_id|>
  // <|start_header_id|>assistant<|end_header_id|>
  // `;

  // Format the request payload using the model's native structure.
  const request = {
    prompt,
    // Optional inference parameters:
    max_gen_len: 2048,
    temperature: 0.9,
    top_p: 0.9,
  };

  // Encode and send the request.
  const response = await client.send(
    new InvokeModelCommand({
      contentType: "application/json",
      body: JSON.stringify(request),
      modelId,
    })
  );

  // Decode the native response body.
  /** @type {{ generation: string }} */
  const nativeResponse = JSON.parse(new TextDecoder().decode(response.body));

  // Extract and print the generated text.
  const responseText = nativeResponse.generation;
  console.log(responseText);
  res.send({
    response: responseText,
  });
  // Learn more about the Llama 3 prompt format at:
  // https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-3/#special-tokens-used-with-meta-llama-3
  // snippet-end:[javascript.v3.bedrock-runtime.InvokeModel_Llama3_Quickstart]
}

module.exports = llm;
