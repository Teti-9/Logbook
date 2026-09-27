const errorHandling = (label, fn) => async (args) => {
  try {
    return await fn(args);
  } catch (error) {
    console.error(`Error in ${label}:`, error);
    return {
      isError: true,
      content: [{ type: "text", text: `Failed to ${label}: ${error.message}` }],
    };
  }
};

export default errorHandling;
