const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

/**
 * getHashedData: Hashes data and returns the hex string
 * @param {any} data
 * @returns {string}
 */
function getHashedData(data) {
  return crypto.createHash("sha3-512").update(data).digest("hex");
}

/**
 * getJsonStr: Safely stringify data and returns empty string if it fails
 * @param {any} data
 * @returns {string}
 */
function getJsonStr(data) {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return "";
  }
}

function deterministicPartitionKey(event){
  if (!event) return TRIVIAL_PARTITION_KEY;

  const candidate = event.partitionKey || getHashedData(getJsonStr(event));
  const candidateString = typeof candidate !== "string" ? getJsonStr(candidate) : candidate;

  return candidateString.length > MAX_PARTITION_KEY_LENGTH ? getHashedData(candidateString) : candidateString;
}

module.exports = {
  deterministicPartitionKey,
  getHashedData,
  getJsonStr,
  MAX_PARTITION_KEY_LENGTH,
  TRIVIAL_PARTITION_KEY
}
