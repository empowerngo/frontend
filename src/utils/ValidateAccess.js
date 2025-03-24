export function validateAccess(usageDetails) {
  const { ngoPlan, receiptCount, userCount } = usageDetails;
  console.log(usageDetails);
  const plan = ngoPlan[0];

  const restrictions = [];

  if (plan.NUMBER_OF_DONATIONS <= receiptCount[0]?.RECEIPT_COUNT) {
    restrictions.push({
      message: "Donation limit exceeded.",
      type: "NUMBER_OF_DONATIONS",
    });
  }
  if (plan.FORM_10BE_MAIL === 0) {
    restrictions.push({
      message: "Access to Form 10BE is restricted.",
      type: "FORM_10BE_MAIL",
    });
  }
  if (plan.FORM_10BD_DATA === 0) {
    restrictions.push({
      message: "Access to Form 10BD is restricted.",
      type: "FORM_10BD_DATA",
    });
  }
  if (plan.CA_ACCESS === 0) {
    restrictions.push({
      message: "Access to CA is restricted.",
      type: "CA_ACCESS",
    });
  }
  if (plan.NUMBER_OF_USERS <= userCount[0]?.USER_COUNT) {
    restrictions.push({
      message: "User limit exceeded.",
      type: "NUMBER_OF_USERS",
    });
  }

  return restrictions.length > 0
    ? { success: false, restrictions }
    : { success: true, message: "Access granted." };
}

export function hasAccess(usageDetails, restrictionType) {
  const result = validateAccess(usageDetails);

  // If access is granted, return true
  if (result.success) return true;

  // Check if the given restrictionType exists in the list of restrictions
  return !result.restrictions.some(
    (restriction) => restriction.type === restrictionType
  );
}
