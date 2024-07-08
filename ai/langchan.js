require("dotenv").config();
const { Bedrock } = require("@langchain/community/llms/bedrock");
const { S3Loader } = require("@langchain/community/document_loaders/web/s3");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { BedrockRuntimeClient } = require("@aws-sdk/client-bedrock-runtime");
const {
  BedrockEmbeddings,
} = require("@langchain/community/embeddings/bedrock");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { TextLoader } = require("langchain/document_loaders/fs/text");

let test = async () => {
  // //   1. s3로 부터 파일 읽어오기
  //     const loader = new S3Loader({
  //       bucket: "jungle-bucket",
  //       key: "image2.pdf",
  //       s3Config: {
  //         region: process.env.AWS_REGION,
  //         credentials: {
  //           accessKeyId: process.env.S3_ACCESS_KEY,
  //           secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  //         },
  //       },
  //       // unstructuredAPIURL: "http://localhost:8000/general/v0/general",
  //       // unstructuredAPIKey: "", // this will be soon required
  //     });
  //     const docs = await loader.load();
  //     console.log(docs);
  // 파일 직접 로딩
  const loader = new PDFLoader(
    "./ai/c10.pdf"
    //     , {
    //     splitPages: false,
    //   }
  );
  const docs = await loader.load();
  //   console.log(docs);
  //   // 모델 임베딩?
  const embeddings = new BedrockEmbeddings({
    region: process.env.BEDROCK_AWS_REGION,
    credentials: {
      accessKeyId: process.env.BEDROCK_ACCESS_KEY,
      secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
    },
    model: "amazon.titan-embed-text-v2:0", // Default value
  });
  // Create vector store and index the docs
  const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName: "pdf-test",
    url: "http://localhost:8000", // Optional, will default to this value
    // collectionMetadata: {
    //   "hnsw:space": "cosine",
    // }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
  });
  // Search for the most similar document
  const response = await vectorStore.similaritySearch("rio", 1);
  console.log(response);
};

test();
// /*

//   Why was the math book unhappy?

//   Because it had too many problems!
// */
