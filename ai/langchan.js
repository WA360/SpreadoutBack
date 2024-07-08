require("dotenv").config();
var llm = require("./llm");
var express = require("express");
var router = express.Router();
// const { Bedrock } = require("@langchain/community/llms/bedrock");
// const { S3Loader } = require("@langchain/community/document_loaders/web/s3");
// const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
// const { BedrockRuntimeClient } = require("@aws-sdk/client-bedrock-runtime");
// const {
//   BedrockEmbeddings,
// } = require("@langchain/community/embeddings/bedrock");
// const { Chroma } = require("@langchain/community/vectorstores/chroma");
// const { OpenAIEmbeddings } = require("@langchain/openai");
// const { TextLoader } = require("langchain/document_loaders/fs/text");
const { BedrockChat } = require("@langchain/community/chat_models/bedrock");
const { HumanMessage } = require("@langchain/core/messages");
const llmModel = "meta.llama3-70b-instruct-v1:0";
const emModel = "amazon.titan-embed-text-v2:0";
// let test = async () => {
//   // //   1. s3로 부터 파일 읽어오기
//   //     const loader = new S3Loader({
//   //       bucket: "jungle-bucket",
//   //       key: "image2.pdf",
//   //       s3Config: {
//   //         region: process.env.AWS_REGION,
//   //         credentials: {
//   //           accessKeyId: process.env.S3_ACCESS_KEY,
//   //           secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   //         },
//   //       },
//   //       // unstructuredAPIURL: "http://localhost:8000/general/v0/general",
//   //       // unstructuredAPIKey: "", // this will be soon required
//   //     });
//   //     const docs = await loader.load();
//   //     console.log(docs);
//   // 파일 직접 로딩
//   const loader = new PDFLoader(
//     "./ai/c10.pdf"
//     //     , {
//     //     splitPages: false,
//     //   }
//   );
//   const docs = await loader.load();
//   //   console.log(docs);
//   //   // 모델 임베딩?
//   const embeddings = new BedrockEmbeddings({
//     region: process.env.BEDROCK_AWS_REGION,
//     credentials: {
//       accessKeyId: process.env.BEDROCK_ACCESS_KEY,
//       secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
//     },
//     model: emModel,
//   });
//   // Create vector store and index the docs
//   const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
//     collectionName: "pdf-test",
//     url: "http://localhost:8000", // Optional, will default to this value
//     // collectionMetadata: {
//     //   "hnsw:space": "cosine",
//     // }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
//   });
//   // Search for the most similar document
//   const response = await vectorStore.similaritySearch("rio", 1);
//   console.log(response);
// };

// test();
// /*

//   Why was the math book unhappy?

//   Because it had too many problems!
// */

// async function chatbot(req, res) {
//   const model = new Bedrock({
//     model: llmModel, // You can also do e.g. "anthropic.claude-v2"
//     region: process.env.BEDROCK_AWS_REGION,
//     // endpointUrl: "custom.amazonaws.com",
//     credentials: {
//       accessKeyId: process.env.BEDROCK_ACCESS_KEY,
//       secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
//     },
//     // modelKwargs: {},
//   });
//   const question = req.body.question;
//   const respon = await model.invoke(question);
//   console.log(respon);
//   let result = {
//     question: question,
//     respon: respon,
//   };
//   res.status(200).send({ result: result });
// }

router.post("/", llm);

router.post("/chatbot", async function (req, res) {
  const model = new BedrockChat({
    model: llmModel, // You can also do e.g. "anthropic.claude-v2"
    region: process.env.BEDROCK_AWS_REGION,
    credentials: {
      accessKeyId: process.env.BEDROCK_ACCESS_KEY,
      secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
    },
    maxTokens: 2048,
    temperature: 0.9,
    // stopSequences: ["\n", " Human:", " Assistant:"],
    // streaming: false,
    // trace: "ENABLED",
    // guardrailIdentifier: "your-guardrail-id",
    // guardrailVersion: "1.0",
    // guardrailConfig: {
    //   tagSuffix: "example",
    //   streamProcessingMode: "SYNCHRONOUS",
    // },
  });

  // Prepare the message to be sent to the model
  let ttt = `You are LLaMA3, a state-of-the-art large language model. Your role is to provide accurate and helpful responses to user queries. Follow these guidelines to perform at your best:Always prioritize accuracy. Do not provide information you're not certain about.Structure your responses logically and coherently.Explain complex concepts in simple terms, but use technical terminology when appropriate.Provide information directly relevant to the user's question.Offer ethical and unbiased responses.Ask for additional information or clarification when necessary.For mathematical or scientific problems, show your step-by-step reasoning.For creative tasks, present original and engaging ideas.Provide all responses in English.If the user asks for responses in Korean, switch to Korean for that specific response.Follow these guidelines to provide the best assistance to the user. If you're ready, respond with "Understood. I'm ready to assist you in English."`;
  const message = new HumanMessage(ttt + req.body.question);
  // Invoke the model with the message
  const respon = await model.invoke([message]);
  let result = {
    question: req.body.question,
    respon: respon,
  };
  res.status(200).send({ result: result });
});

module.exports = router;
