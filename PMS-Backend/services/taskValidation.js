
const validateTask = async ({
  project_ID,
  title,
  description,
  startDate,
  endDate,
}) => {

  if (!project_ID) {
    return {
      success: false,
      msg: "Project is required",
    };
  }

  if (!title) {
    return {
      success: false,
      msg: "Task title is required",
    };
  }

  if (!description) {
    return {
      success: false,
      msg: "Task description is required",
    };
  }

  if (!startDate) {
    return {
      success: false,
      msg: "Start date is required",
    };
  }

  if (!endDate) {
    return {
      success: false,
      msg: "End date is required",
    };
  }

  if (new Date(startDate) > new Date(endDate)) {
    return {
      success: false,
      msg: "End date must be greater than start date",
    };
  }

  return {
    success: true,
  };
};

module.exports = {
  validateTask,
};

