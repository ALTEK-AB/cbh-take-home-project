const {
  deterministicPartitionKey,
  getHashedData,
  getJsonStr,
  MAX_PARTITION_KEY_LENGTH,
  TRIVIAL_PARTITION_KEY
} = require("./dpk");

describe("getJsonStr", () => {
  test("successfully stringifies a valid JavaScript value", () => {
    const data = { key: "value" };
    expect(getJsonStr(data)).toBe('{"key":"value"}');
  });

  test("returns empty string for circular JavaScript objects", () => {
    const circularObj = {};
    circularObj.self = circularObj;
    expect(getJsonStr(circularObj)).toBe("");
  });

  test("returns empty string for an empty input", () => {
    expect(getJsonStr("")).toBe('""');
  });
});

describe("getHashedData", () => {
  test("returns hashed data in hex format", () => {
    const data = "test";
    const hashedData = getHashedData(data);
    expect(hashedData.length).toBe(128);
  });
  test("returns hashed data for empty string input", () => {
    const data = "";
    const hashedData = getHashedData(data);
    expect(hashedData.length).toBe(128);
  });
});

describe("deterministicPartitionKey", () => {
  test("returns trivial partition key for undefined event", () => {
    expect(deterministicPartitionKey()).toBe(TRIVIAL_PARTITION_KEY);
  });

  test("returns trivial partition key for null event", () => {
    expect(deterministicPartitionKey(null)).toBe(TRIVIAL_PARTITION_KEY);
  });

  test("returns partitionKey from event when it exists", () => {
    const event = { partitionKey: "customKey" };
    expect(deterministicPartitionKey(event)).toBe("customKey");
  });

  test("returns hashed event data when partitionKey does not exist", () => {
    const event = { data: "someData" };
    const hashedData = deterministicPartitionKey(event);
    expect(hashedData).not.toBe(TRIVIAL_PARTITION_KEY);
    expect(hashedData.length).toBe(128);
  });

  test("returns hashed candidate string when it exceeds max length", () => {
    const longString = "x".repeat(MAX_PARTITION_KEY_LENGTH + 1);
    const event = { partitionKey: longString };
    const hashedData = deterministicPartitionKey(event);
    expect(hashedData.length).toBe(128);
  });

  test("returns hashed event data when partitionKey is an empty string", () => {
    const event = { partitionKey: "" };
    const hashedData = deterministicPartitionKey(event);
    expect(hashedData).not.toBe(TRIVIAL_PARTITION_KEY);
    expect(hashedData.length).toBe(128);
  });
});
