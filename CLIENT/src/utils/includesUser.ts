export const includesUser = (
  list: (string | { _id: string })[] | undefined,
  userId: string
): boolean => {
  if (!list) return false;
  if (typeof list[0] === "string") {
    return list.includes(userId);
  }
  return list.some((item: any) => item._id === userId);
};
