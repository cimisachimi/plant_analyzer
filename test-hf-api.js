// test-hf-api.js

// This line loads the variables from your .env.local file
require("dotenv").config({ path: "./.env.local" });

const fs = require("fs");
const fetch = require("node-fetch");

// --- CONFIGURATION ---
// This MUST match the URL in your app
const API_URL =
  "https://api-inference.huggingface.co/models/wellCh4n/tomato-leaf-disease-classification-resnet50";
// This MUST match the variable name in your .env.local file
const API_KEY = process.env.HUGGINGFACE_API_KEY;
const IMAGE_PATH = "./imagdfsfsdfsdes.jpg"; // The test image in your project root

async function runTest() {
  console.log("--- Starting Hugging Face API Test ---");

  // 1. Check if API Key is loaded
  if (!API_KEY) {
    console.error(
      "❌ ERROR: Hugging Face API Key not found. Check your .env.local file and variable name."
    );
    return;
  }
  console.log("✅ API Key loaded successfully.");

  // 2. Read the image file from disk
  let imageBuffer;
  try {
    imageBuffer = fs.readFileSync(IMAGE_PATH);
    console.log(`✅ Successfully read image file: ${IMAGE_PATH}`);
  } catch (error) {
    console.error(
      `❌ ERROR: Could not read the image file at ${IMAGE_PATH}. Make sure the file exists.`
    );
    console.error(error.message);
    return;
  }

  // 3. Make the API call
  console.log(`Sending request to: ${API_URL}`);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "image/jpeg",
      },
      body: imageBuffer,
    });

    console.log(
      `Received response with status: ${response.status} ${response.statusText}`
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ TEST FAILED. API returned an error:");
    } else {
      console.log("✅ TEST SUCCEEDED! API returned a successful response:");
    }

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ TEST FAILED. An error occurred during the fetch call:");
    console.error(error);
  } finally {
    console.log("--- Test Finished ---");
  }
}

runTest();
