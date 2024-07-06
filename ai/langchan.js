require("dotenv").config();
const { Bedrock } = require("@langchain/community/llms/bedrock");
const { S3Loader } = require("@langchain/community/document_loaders/web/s3");
const {
  BedrockEmbeddings,
} = require("@langchain/community/embeddings/bedrock");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { TextLoader } = require("langchain/document_loaders/fs/text");

/*
[
  Document {
    pageContent: 'Foo\nBar\nBaz\n\n',
    metadata: { source: 'src/document_loaders/example_data/example.txt' }
  }
]
*/

// const res = await embeddings.embedQuery(
//   "What would be a good company name a company that makes colorful socks?"
// );
// console.log({ res });

let test = async () => {
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
  //   const res = await model.invoke("Tell me a hololive");
  //   console.log(res);

  // 1. s3로 부터 파일 읽어오기
  const loader = new S3Loader({
    bucket: "jungle-bucket",
    key: "image2.pdf",
    s3Config: {
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    },
    unstructuredAPIURL: "http://localhost:8000/general/v0/general",
    unstructuredAPIKey: "", // this will be soon required
  });

  const docs = await loader.load();

  // console.log(docs);

  // 모델 임베딩?
  const embeddings = new BedrockEmbeddings({
    region: process.env.BEDROCK_AWS_REGION,
    credentials: {
      accessKeyId: process.env.BEDROCK_ACCESS_KEY,
      secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
    },
    model: "meta.llama3-8b-instruct-v1:0", // Default value
  });

  // Create vector store and index the docs
  const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName: "pdf-test",
    url: "http://localhost:7000", // Optional, will default to this value
    //   collectionMetadata: {
    //     "hnsw:space": "cosine",
    //   }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
  });

  // Search for the most similar document
  const response = await vectorStore.similaritySearch("process", 3);

  console.log(response);
};

test();
// /*

//   Why was the math book unhappy?

//   Because it had too many problems!
// */
