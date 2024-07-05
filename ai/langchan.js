// require("dotenv").config();
// const { Bedrock } = require("@langchain/community/llms/bedrock");
// // Or, from web environments:
// // import { Bedrock } from "@langchain/community/llms/bedrock/web";

// // If no credentials are provided, the default credentials from
// // @aws-sdk/credential-provider-node will be used.

// let test = async () => {
//   const model = new Bedrock({
//     model: "meta.llama3-8b-instruct-v1:0", // You can also do e.g. "anthropic.claude-v2"
//     region: "us-east-1",
//     // endpointUrl: "custom.amazonaws.com",
//     credentials: {
//       accessKeyId: process.env.BEDROCK_ACCESS_KEY,
//       secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
//     },
//     // modelKwargs: {},
//   });
//   const res = await model.invoke("Tell me a joke");
//   console.log(res);
// };

// test();
// /*

//   Why was the math book unhappy?

//   Because it had too many problems!
// */
