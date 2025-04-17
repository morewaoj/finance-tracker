async function testApiEndpoint(url, data) {
  // Test with correct data
  try {
    const response = await makeApiRequest(url, data);
    console.log('Success:', response);
  } catch (error) {
    console.error('Failed with valid data:', error);
  }

  // Test with invalid data
  try {
    const invalidData = { ...data, requiredField: undefined };
    await makeApiRequest(url, invalidData);
  } catch (error) {
    console.log('Expected error with invalid data:', error);
  }
}