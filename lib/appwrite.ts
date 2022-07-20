import { Client } from "appwrite";

const appwrite = new Client();

appwrite
  .setEndpoint("https://appwrite.radmacher.dev/v1")
  .setProject("62d5adf028218a3f297e");

export default appwrite;
