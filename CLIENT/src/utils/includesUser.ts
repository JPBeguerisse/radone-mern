// export const includesUser = (
//   list: (string | { _id: string })[] | undefined,
//   userId?: string
// ): boolean => {
//   if (!list) return false;
//   if (typeof list[0] === "string") {
//     return list.includes(userId!);
//   }
//   return list.some((item: any) => item._id === userId);
// };

export const includesUser = (
  list: (string | { _id: string })[] | undefined,
  userId?: string
): boolean => {
  if (!list || !userId) return false; // ✅ Si la liste ou l'ID sont vides, retourne false immédiatement

  // 🔹 Vérification plus sûre si la liste contient des chaînes
  if (typeof list[0] === "string") {
    return list.includes(userId);
  }

  // 🔹 Si ce sont des objets, on sécurise avant d'accéder à `_id`
  return list.some((item) => item && (item as { _id: string })._id === userId);
};
